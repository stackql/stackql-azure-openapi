import $RefParser from '@apidevtools/json-schema-ref-parser';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { ConsoleLogger } from '@autorest/common';
import { createOrCleanDir } from './shared-functions';
import { contactInfo, serviceInfo } from './provider-metadata';

const logger = new ConsoleLogger();

function fixString(str) {
    // clean up free text strings here if needed
    return str
}

function cleanUpDescriptions(obj) {
    for (let k in obj) {
        if (typeof obj[k] === "object") {
            cleanUpDescriptions(obj[k])
        } else {
            if (k === "description"){
                obj[k] = fixString(obj[k]);
            }
        }
    }
    return obj;
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
    
    // get metadata for service
    if (!serviceInfo[specificationDir]){
        logger.info(`skipping ${specificationDir}...`);
        return;
    }

    const providerName = serviceInfo[specificationDir].provider;
    const serviceName = serviceInfo[specificationDir].service;
    const title = serviceInfo[specificationDir].title;
    const description = serviceInfo[specificationDir].description;
        
    const outputDir = `${taggedDir}/${providerName}/${serviceName}`;

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
            .replace(/VM/g, 'Vm')
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
            if (s == 'api_management'){
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
            if (s == 'key_vault'){
                if (['Vaults_List'].includes(o)){
                    v = 'exec';
                } else {
                    v = 'select';
                }
            } else if (s == 'consumption'){
                if (['Marketplaces_List', 'ReservationRecommendations_List', 'UsageDetails_List'].includes(o)){
                    v = 'exec';
                } else {
                    v = 'select';
                }                
            } else if (s == 'cost_management') {
                if (['Dimensions_List'].includes(o)){
                    v = 'exec';
                } else {
                    v = 'select';
                }
            } else if (s == 'network'){
                if (['VpnServerConfigurationsAssociatedWithVirtualWan_List'].includes(o)){
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

    // get generated date for version
    const date = new Date();
    const versionDate = `${date.toISOString().split('T')[0]}-stackql-generated`;
    debug ? logger.debug(`version : ${versionDate}`): null;
    debug ? logger.debug(`contact info : ${JSON.stringify(contactInfo)}`): null;
   
    for (const f of files) {
        const fileName = `${inputDir}/${f}`;
        debug ? logger.debug(`Processing ${fileName}`): null;

        inputDoc = await $RefParser.parse(fileName);

        outputDoc.openapi = inputDoc.openapi;
        outputDoc.servers = inputDoc.servers;
        outputDoc.info = {};
        outputDoc.info.title = title;
        outputDoc.info.description = description;
        outputDoc.info.contact = contactInfo;
        outputDoc.info.version = versionDate;

        outputDoc.security = inputDoc.security;

        outputDoc.components = {};
        inputDoc.components.securitySchemes ? outputDoc.components.securitySchemes = inputDoc.components.securitySchemes : null;
        inputDoc.components.parameters ? outputDoc.components.parameters = inputDoc.components.parameters : null;
        
        // clean response schemas
        outputDoc.components.schemas = {};
        debug ? logger.debug(`Cleaning response schemas...`): null;
        Object.keys(inputDoc.components.schemas).forEach(schemaName => {
            debug ? logger.debug(`Processing ${schemaName}...`): null;
            // check if the schema is an object
            if (!inputDoc.components.schemas[schemaName].type || inputDoc.components.schemas[schemaName].type == 'object'){
                // check for acceptable cases
                if (
                    inputDoc.components.schemas[schemaName]['properties'] &&
                    !inputDoc.components.schemas[schemaName]['properties']['properties'] && 
                    !inputDoc.components.schemas[schemaName]['allOf'] 
                    ){
                        // object is all good, nothing to see here...
                        debug ? logger.debug(`Bypassing ${schemaName}...`): null;
                        outputDoc.components.schemas[schemaName] = inputDoc.components.schemas[schemaName];
                        // its an object, if not explicitly defined as an object, set it to object 
                        !outputDoc.components.schemas[schemaName].type ? outputDoc.components.schemas[schemaName]['type'] = 'object': null;
                } else {
                    let finalSchema = {};
                    let finalProps = {};

                    // go through each field in the object
                    Object.keys(inputDoc.components.schemas[schemaName]).forEach(fieldName => {
                        if (fieldName != 'properties' && fieldName != 'allOf' && fieldName != 'type'){
                            // another top level key like 'required', 'description' or 'x-something'
                            finalSchema[fieldName] = inputDoc.components.schemas[schemaName][fieldName];
                        }

                        if (fieldName == 'allOf'){
                            for (let i in inputDoc.components.schemas[schemaName]['allOf']){
                                // each item really should be a pointer here...
                                if (inputDoc.components.schemas[schemaName]['allOf'][i]['$ref']){
                                    let referredSchemaName = inputDoc.components.schemas[schemaName]['allOf'][i]['$ref'].split('/').pop();
                                    finalProps = {...finalProps, ...inputDoc.components.schemas[referredSchemaName]['properties']};
                                }
                            }
                        }

                        if (fieldName == 'properties'){
                            // flatten nested props?
                            if (inputDoc.components.schemas[schemaName]['properties']['properties'] &&
                                inputDoc.components.schemas[schemaName]['properties']['properties']['x-ms-client-flatten'] &&
                                inputDoc.components.schemas[schemaName]['properties']['properties']['x-ms-client-flatten'] == true &&
                                inputDoc.components.schemas[schemaName]['properties']['properties']['$ref']){
                                    let origProps = inputDoc.components.schemas[schemaName]['properties'];
                                    let referredSchemaName = inputDoc.components.schemas[schemaName]['properties']['properties']['$ref'].split('/').pop();
                                    finalProps = {...finalProps, ...inputDoc.components.schemas[referredSchemaName]['properties']};
                                    delete origProps['properties'];
                                    finalProps = {...finalProps, ...origProps};
                            } else {
                                finalProps = {...finalProps, ...inputDoc.components.schemas[schemaName]['properties']};    
                            }
                        }
                    });

                    finalSchema['properties'] = finalProps;
                    finalSchema['type'] = 'object';
                    
                    outputDoc.components.schemas[schemaName] = finalSchema;
                }
            } else {
                // its not an object, just push it through
                outputDoc.components.schemas[schemaName] = inputDoc.components.schemas[schemaName];
            }
        });

        // add paths
        outputDoc.paths = {};

        Object.keys(inputDoc.paths).forEach(pathKey => {
            debug ? logger.debug(`Processing path ${pathKey}`): null;

            let apiVersion = inputDoc.paths[pathKey]['x-api-version'];
            let versionedPath = `${pathKey}/?api-version=${apiVersion}`;
            debug ? logger.debug(`API version ${apiVersion}`): null;
            debug ? logger.debug(`Versioned path ${versionedPath}`): null;

            outputDoc.paths[versionedPath] ? null : outputDoc.paths[versionedPath] = {};

            Object.keys(inputDoc.paths[pathKey]).forEach(verbKey => {
                debug ? logger.debug(`Processing operation ${pathKey}:${verbKey}`): null;
                
                if (verbKey != 'x-api-version'){
                    outputDoc.paths[versionedPath][verbKey] = inputDoc.paths[pathKey][verbKey];
                }

                // remove api version from path level parameters
                if (verbKey == 'parameters'){
                    debug ? logger.debug(`Removing api version from path parameters for ${pathKey}`): null;
                    let newPathParams = [];
                    for (let i = 0; i < inputDoc.paths[pathKey]['parameters'].length; i++){
                        if (inputDoc.paths[pathKey]['parameters'][i]['$ref']){
                            if (inputDoc.paths[pathKey]['parameters'][i]['$ref'].toLowerCase() == '#/components/parameters/apiversionparameter'){
                                debug ? logger.debug(`API Version at path level for ${pathKey}`): null;
                                continue;
                            }
                        }
                        newPathParams.push(inputDoc.paths[pathKey]['parameters'][i]);
                    }
                    outputDoc.paths[versionedPath]['parameters'] = newPathParams;
                }

                if (operations.includes(verbKey)){
                    try {
                        logger.info(`Processing operationId ${inputDoc.paths[pathKey][verbKey]['operationId']}`);

                        // remove api version from operation level parameters
                        if (inputDoc.paths[pathKey][verbKey]['parameters']){
                            debug ? logger.debug(`Removing api version from operation level parameters for ${pathKey}:${verbKey}`): null;
                            let newOpParams = [];
                            for (let i = 0; i < inputDoc.paths[pathKey][verbKey]['parameters'].length; i++){
                                if (inputDoc.paths[pathKey][verbKey]['parameters'][i]['$ref']){
                                    if (inputDoc.paths[pathKey][verbKey]['parameters'][i]['$ref'].toLowerCase() == '#/components/parameters/apiversionparameter'){
                                        debug ? logger.debug(`API Version at verb level for ${pathKey}:${verbKey}`): null;
                                        continue;
                                    }
                                }
                                newOpParams.push(inputDoc.paths[pathKey][verbKey]['parameters'][i]);
                            }
                            outputDoc.paths[versionedPath][verbKey]['parameters'] = newOpParams;
                        }

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
                            
                            // get stackql resourcename
                            stackqlResName = camelToSnake(fixCamelCase(finalResName));

                            // remove service from stackqlResName
                            if (stackqlResName.startsWith(serviceName) && stackqlResName != serviceName){
                                debug ? logger.debug(`cleaning resource name for ${stackqlResName}`): null;
                                if (serviceName == 'security' && stackqlResName == 'security_connectors'){
                                    debug ? logger.debug(`bypassing ${serviceName}.${stackqlResName}`): null;
                                } else {
                                    stackqlResName = stackqlResName.substring(serviceName.length+1);
                                }
                            }

                            // get stackql verb
                            stackqlSqlVerb = getSQLVerbFromMethod(serviceName, stackqlResName, finalMethod, inputDoc.paths[pathKey][verbKey]['operationId']);
                        }
                        
                        debug ? logger.debug(`stackql resource : ${stackqlResName}`): null;
                        debug ? logger.debug(`stackql verb : ${stackqlSqlVerb}`): null;

                        // add special keys to the operation
                        outputDoc.paths[versionedPath][verbKey]['x-stackQL-resource'] = stackqlResName;
                        outputDoc.paths[versionedPath][verbKey]['x-stackQL-verb'] = stackqlSqlVerb;

                    } catch (e) {
                        if (e !== 'Break') throw e
                    }
                }
        
            });
        });
    }

    // clean up all free text descriptions
    debug ? logger.debug(`cleaning up markdown in description fields...`): null;
    outputDoc = cleanUpDescriptions(outputDoc);

    // add azure specific config key
    // debug ? logger.debug(`adding azure specific key to deal with allOf usage...`): null;
    // outputDoc['x-stackQL-config'] = {};
    // outputDoc['x-stackQL-config']['variations'] = {};
    // outputDoc['x-stackQL-config']['variations']['isObjectSchemaImplicitlyUnioned'] = true;

    if (dryrun){
        logger.info(`dryrun specified, no output written`);
    } else {
        logger.info(`writing ${outputDir}/${serviceName}.yaml...`);
        fs.writeFileSync(`${outputDir}/${serviceName}.yaml`, yaml.dump(outputDoc, {lineWidth: -1, noRefs: true}));
        logger.info(`${outputDir}/${serviceName}.yaml written successfully`);
    }
    logger.info(`${specificationDir} finished processing`);

}
