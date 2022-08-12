import $RefParser from '@apidevtools/json-schema-ref-parser';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { ConsoleLogger } from '@autorest/common';
import { v4 as uuidv4 } from 'uuid';

const logger = new ConsoleLogger();

function getFiles(inputDir, files=[]){
    const objs = fs.readdirSync(inputDir, { withFileTypes: true });
    for (let obj in objs){
        if (objs[obj].isDirectory()){
            getFiles(path.join(inputDir, objs[obj].name), files)
        } else {
            files.push({ name: objs[obj].name, path: path.join(inputDir, objs[obj].name)});
        }
    } 
    return files;
}

function createOrCleanDir(dir, debug){
    if (!fs.existsSync(dir)){
        debug ? logger.debug(`creating ${dir}...`): null;
        fs.mkdirSync(dir);
    } else {
        // delete all files in dir
        debug ? logger.debug(`${dir} exists, cleaning...`): null;
        const files = getFiles(dir);
        for (let file of files){
            fs.unlinkSync(file.path);
        }
    }
}

export async function dereference(generatedDir, derefedDir, serviceName, debug, dryrun) {
    const startTime = new Date();
    logger.info(`dereferencing ${serviceName}`);
    const inputDir = `${generatedDir}/${serviceName}`;
    const outputDir = `${derefedDir}/${serviceName}`;

    createOrCleanDir(outputDir, debug);

    debug ? logger.debug(`dereferencing ${inputDir}`) : null;

    // process all files in all sub dirs in inputDir
    const files = getFiles(inputDir);
    for (let i = 0; i < files.length; i++) {        
        logger.info(`dereferencing ${files[i].name}...`);
        debug ? logger.debug(`input path : ${files[i].path}`): null;
        const outputFileName = `${uuidv4()}.json`
        const outputFilePath = `${outputDir}/${outputFileName}`;
        debug ? logger.debug(`output path : ${outputFilePath}`): null;
        let schema = await $RefParser.bundle(files[i].path);
        if (dryrun){
            logger.info(`dryrun specified, no output written`);
        } else {
            fs.writeFileSync(outputFilePath, JSON.stringify(schema));
            logger.info(`${outputFilePath} written`);
        }
        debug ? logger.debug(`processed element ${i+1} of ${files.length}`): null;
    };    
    logger.info(`dereferencing ${serviceName} completed in ${new Date().getTime() - startTime.getTime()}ms`);
}

export async function combine(derefedDir, combinedDir, specificationDir, debug, dryrun) {
    
    logger.info(`combining ${specificationDir}...`);

    const inputDir = `${derefedDir}/${specificationDir}`;
    const outputDir = `${combinedDir}/${specificationDir}`;

    const files = fs.readdirSync(inputDir);
    let outputDoc = {};
    let inputDoc = {};

    createOrCleanDir(outputDir, debug);

    // statically defined properties, shouldn't change between services
    const openapi = '3.0.0';
    const servers = [{url: 'https://management.azure.com/'}];
    const security = [{azure_auth: ['user_impersonation']}];
    const securitySchemes = {
        azure_auth: {
            description: 'Azure Active Directory OAuth2 Flow.',
            type: 'oauth2',
            flows: {
              implicit: {
                authorizationUrl: 'https://login.microsoftonline.com/common/oauth2/authorize',
                scopes: {
                  user_impersonation: 'impersonate your user account'
                }
              }
            }
          }
    };

    let info = {};
    let schemas = {};
    let parameters = {};
    let paths = {};
    for (const f of files) {
        const fileName = `${inputDir}/${f}`;
        debug ? logger.debug(`Processing ${fileName}`): null;
        inputDoc = await $RefParser.parse(fileName);

        // info
        if (!info.title){
            if (!inputDoc['x-ms-secondary-file']){
                info = inputDoc.info;
            }
        }

        // schemas
        schemas = {
            ...schemas,
            ...inputDoc.components.schemas
        };

        // parameters
        parameters = {
            ...parameters,
            ...inputDoc.components.parameters
        };

        // clean paths x-ms-examples
        let cleanPaths = {};
        Object.keys(inputDoc.paths).forEach(pathKey => {
            cleanPaths[pathKey] = {};
            Object.keys(inputDoc.paths[pathKey]).forEach(verbKey => {
                cleanPaths[pathKey][verbKey] = {};
                Object.keys(inputDoc.paths[pathKey][verbKey]).forEach(itemKey => {
                    if (itemKey != "x-ms-examples") {
                        cleanPaths[pathKey][verbKey][itemKey] = inputDoc.paths[pathKey][verbKey][itemKey];
                    }
                });
            });
        });        
        paths = {
            ...paths,
            ...cleanPaths
        };
    }
    outputDoc.openapi = openapi;
    
    outputDoc.servers = servers;
    outputDoc.info = info;
    outputDoc.security = security;
    
    outputDoc.components = {};
    outputDoc.components.securitySchemes = securitySchemes;
    outputDoc.components.schemas = schemas;

    outputDoc.components.parameters = parameters;
    outputDoc.paths = paths;

    if (dryrun){
        logger.info(`dryrun specified, no output written`);
    } else {
        logger.info(`writing ${outputDir}/${specificationDir}.yaml...`);
        fs.writeFileSync(`${outputDir}/${specificationDir}.yaml`, yaml.dump(outputDoc, {lineWidth: -1, noRefs: true}));
        logger.info(`${outputDir}/${specificationDir}.yaml written successfully`);
    }
    logger.info(`${specificationDir} finished processing`);
    
}

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

    const getSQLVerbFromMethod = (m) => {
        if (m.toLowerCase() == 'list' || m.toLowerCase() == 'get' || m == 'ListAll' || m.startsWith('ListBy') || m.startsWith('GetBy')){
            return 'select';
        } else if (m.toLowerCase() == 'add' || m.toLowerCase() == 'create' || m == 'CreateOrUpdate' || m == 'CreateOrReplace'){
            return 'insert';
        } else if (m.toLowerCase() == 'delete' || m.startsWith('DeleteBy')) {
            return 'delete';
        } else {
            return 'exec';
        }
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
                            // clean up camel case before we convert to snake case in openapi-doc-util
                            stackqlResName = camelToSnake(fixCamelCase(inputDoc.paths[pathKey][verbKey]['operationId'].split('_')[0]));
                            // we have a method, lets check it
                            let method = inputDoc.paths[pathKey][verbKey]['operationId'].split('_')[1];
                            stackqlSqlVerb = getSQLVerbFromMethod(method);
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

export async function validate(spec) {
    return await $RefParser.parse(spec);
}
