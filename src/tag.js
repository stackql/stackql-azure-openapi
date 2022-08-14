import $RefParser from '@apidevtools/json-schema-ref-parser';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { ConsoleLogger } from '@autorest/common';
import { createOrCleanDir } from './shared-functions';

const logger = new ConsoleLogger();

export async function tag(combinedDir, taggedDir, specificationDir, debug, dryrun) {

    const camelToSnake = (inStr) => {
        let str = inStr.replace(/-/g, '_').replace(/ /g, '_');
        return str.replace(/\.?([A-Z])/g, function (x,y){
            return "_" + y.toLowerCase()
        }).replace(/^_/, "");
    }

    logger.info(`tagging ${specificationDir}...`);

    const inputDir = `${combinedDir}/${specificationDir}`;
    const serviceName = camelToSnake(specificationDir.replace(/-/g, '_'));
    const outputDir = `${taggedDir}/${serviceName}`;

    const files = fs.readdirSync(inputDir);
    let outputDoc = {};
    let inputDoc = {};

    const operations = [
        'get',
        'put',
        'post',
        'delete',
        'options',
        'head',
        'patch',
        'trace',
    ];

    createOrCleanDir(outputDir, debug);

    const fixCamelCase = (inStr) => {
	
        const getReplaceArgs = (s) => {
            let retstr = s.charAt(0) + s.slice(1, s.length-1).toLowerCase() + s.charAt(s.length-1);
            return {find: s, replace: retstr}
        };
        
        const updateStr = (f, r) => {
            let re = new RegExp(f,"g");
            outStr = outStr.replace(re, r);
        };

        const replaceTokens = (s) => {
            return s.replace(/VCenters/g, 'Vcenters')
            .replace(/HyperV/g, 'Hyperv')
            .replace(/NetApp/g, 'Netapp')
            .replace(/VCores/g, 'Vcores')
            .replace(/MongoDB/g, 'Mongodb')
            .replace(/VmSS/g, 'Vms')
            .replace(/SaaS/g, 'Saas')
            .replace(/vNet/g, 'Vnet')
            .replace(/GitHub/g, 'Github')
            .replace(/OAuth/g, 'Oauth')
            .replace(/B2C/g, 'B2c')
            .replace(/B2B/g, 'B2b')
            .replace(/-/g, '_');
        }

        // pre clean name
        let outStr = replaceTokens(inStr);

        // find all occurrences of sequences of more than one upper case letter 
        const sequentialCaps = /[A-Z]{2,}/g;
        const seqs = [...outStr.matchAll(sequentialCaps)];
        const flattened = seqs.flatMap(seq => seq);
        const uniq = [...new Set(flattened)];
        
        // generate the replace args for each unique sequence
        const arr= uniq.map(element => getReplaceArgs(element));
        
        // iterate through each replace operation
        arr.forEach(obj => updateStr(obj.find, obj.replace))
        
        // final clean up and return
        return outStr.slice(0,-1) + outStr.charAt(outStr.length-1).toLowerCase();
    
    }

    const getSQLVerbFromMethod = (s, r, m, o) => {
        let v = 'exec';
        if (m.startsWith('ListBy')){
            if (s == 'apimanagement'){
                if (!['Api_ListByTags','Product_ListByTags','Reports_ListByApi','Reports_ListByUser','Reports_ListByOperation','Reports_ListByProduct','Reports_ListByGeo','Reports_ListByTime','Reports_ListByRequest'].includes(o)){
                    v = 'select';
                }
            } else {
                v = 'select';
            }
        } else if (m == 'ListAll'){
            v = 'select';
        } else if (m == 'GetBy'){
            v = 'select';
        } else if (m.toLowerCase() == 'list'){
            if (s == 'keyvault'){
                if (['Vaults_List'].includes(o)){
                    v = 'exec';
                } else {
                    v = 'select';
                }
            } else {
                v = 'select';        
            }
        } else if (m.toLowerCase() == 'delete' || m.startsWith('DeleteBy')){
            v = 'delete';
        } else if (m.toLowerCase() == 'add' || m.toLowerCase() == 'create' || m == 'CreateOrUpdate' || m == 'CreateOrReplace'){
            v = 'insert';
        } 
        return v;
    };
   
    for (const f of files) {
        const fileName = `${inputDir}/${f}`;
        debug ? logger.debug(`Processing ${fileName}`): null;

        inputDoc = await $RefParser.parse(fileName);

        outputDoc.openapi = inputDoc.openapi;
        outputDoc.servers = inputDoc.servers;
        outputDoc.info = inputDoc.info;
        outputDoc.security = inputDoc.security;
        outputDoc.components = inputDoc.components;0
        outputDoc.paths = {};

        Object.keys(inputDoc.paths).forEach(pathKey => {
            debug ? logger.debug(`Processing path ${pathKey}`): null;
            outputDoc.paths[pathKey] ? null : outputDoc.paths[pathKey] = {};
            Object.keys(inputDoc.paths[pathKey]).forEach(verbKey => {
                debug ? logger.debug(`Processing operation ${pathKey}:${verbKey}`): null;
                outputDoc.paths[pathKey][verbKey] = inputDoc.paths[pathKey][verbKey];
                if (operations.includes(verbKey)){
                    try {
                        logger.info(`Processing operationId ${inputDoc.paths[pathKey][verbKey]['operationId']}`);
                        let stackqlResName = 'operations';
                        let stackqlSqlVerb = 'exec';
                        if (!inputDoc.paths[pathKey][verbKey]['operationId'].split('_')[1]){
                            // replace outlier operationIds with no method
                            if (inputDoc.paths[pathKey][verbKey]['tags']){
                                let tag = inputDoc.paths[pathKey][verbKey]['tags'][0].replace(/( |,|-)/g, '');
                                // use the tag
                                stackqlResName = camelToSnake(fixCamelCase(tag));
                            }
                        } else {
                            // we have a method, lets check it
                            // clean up camel case before we convert to snake case in openapi-doc-util
                            let initResName = inputDoc.paths[pathKey][verbKey]['operationId'].split('_')[0];
                            let initMethod = inputDoc.paths[pathKey][verbKey]['operationId'].split('_')[1];
                            let finalResName = initResName;
                            let finalMethod = initMethod;
                            // fix up anomolies in operationid naming
                            if (['list', 'update'].includes(initResName.toLowerCase())){
                                finalResName = initMethod;
                                finalMethod = initResName;
                            }
                            // get stackql resourcename and verb
                            stackqlResName = camelToSnake(fixCamelCase(finalResName));
                            stackqlSqlVerb = getSQLVerbFromMethod(serviceName, stackqlResName, finalMethod, inputDoc.paths[pathKey][verbKey]['operationId']);
                        }
                        
                        debug ? logger.debug(`stackql resource : ${stackqlResName}`): null;
                        debug ? logger.debug(`stackql verb : ${stackqlSqlVerb}`): null;

                        // add special keys to the operation
                        outputDoc.paths[pathKey][verbKey]['x-stackQL-resource'] = stackqlResName;
                        outputDoc.paths[pathKey][verbKey]['x-stackQL-verb'] = stackqlSqlVerb;

                    } catch (e) {
                        if (e !== 'Break') throw e
                    }
                }
        
            });
        });
    }

    if (dryrun){
        logger.info(`dryrun specified, no output written`);
    } else {
        logger.info(`writing ${outputDir}/${serviceName}.yaml...`);
        fs.writeFileSync(`${outputDir}/${serviceName}.yaml`, yaml.dump(outputDoc, {lineWidth: -1, noRefs: true}));
        logger.info(`${outputDir}/${serviceName}.yaml written successfully`);
    }
    logger.info(`${specificationDir} finished processing`);

}