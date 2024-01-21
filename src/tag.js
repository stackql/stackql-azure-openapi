import $RefParser from '@apidevtools/json-schema-ref-parser';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { ConsoleLogger } from '@autorest/common';
import { createOrCleanDir } from './shared-functions';
import { contactInfo, serviceInfo } from './provider-metadata';
import {     
    getSQLVerbFromMethod,
    camelToSnake,
    fixCamelCase,
    getObjectKey, 
    getResourceNameFromOpId,
} from './stackql-azure-descriptors';

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

// function processOperationId(operationId) {
//     let initResName = operationId.split('_')[0];
//     let initMethod = operationId.split('_')[1];

//     // simiple cases
//     const simpleMethods = ['CreateOrUpdate', 'Get', 'List', 'Create', 'Update', 'Delete'];    
//     if (simpleMethods.includes(initMethod)) {
//         return { initResName, initMethod };
//     }

//     // by or in cases
//     const byOrInMethods = [
//         'CreateOrUpdateBy', 
//         'GetBy', 
//         'GetIn', 
//         'ListBy', 
//         'ListIn', 
//         'CreateBy', 
//         'CreateIn', 
//         'UpdateBy', 
//         'UpdateIn', 
//         'DeleteBy',
//         'DeleteIn',
//     ];    
//     if (byOrInMethods.some(methodPrefix => initMethod.startsWith(methodPrefix))) {
//         return { initResName, initMethod };
//     }

//     // if we are here then it is not a simple verb or a by/in case
//     if (simpleMethods.some(methodPrefix => initMethod.startsWith(methodPrefix))) {
//         // Not a simple verb or a By/In case
//         let extractedVerb = simpleMethods.find(methodPrefix => initMethod.startsWith(methodPrefix));
//         if (extractedVerb) {
//             const restOfMethod = initMethod.substring(extractedVerb.length);
//             initResName += restOfMethod; // Append the rest of the method to the resource name
//             initMethod = extractedVerb; // The method is the simple verb itself
//             return { initResName, initMethod };
//         }
//     } 

//     return { initResName, initMethod };
// }

function processOperationId(operationId) {
    let initResName = operationId.split('_')[0];
    let initMethod = operationId.split('_')[1];

    // Simple cases
    const simpleMethods = ['CreateOrUpdate', 'CreateorUpdate', 'Get', 'List', 'Create', 'Update', 'Delete'];    
    if (simpleMethods.includes(initMethod)) {
        return { initResName, initMethod };
    }

    // By or In cases
    const byOrInMethods = [
        'CreateOrUpdateBy', 
        'GetBy', 
        'GetIn', 
        'ListBy', 
        'ListIn', 
        'CreateBy', 
        'CreateIn', 
        'UpdateBy', 
        'UpdateIn', 
        'DeleteBy',
        'DeleteIn',
    ];    
    for (const methodPrefix of byOrInMethods) {
        if (initMethod.startsWith(methodPrefix)) {
            const remainder = initMethod.substring(methodPrefix.length);
            if (remainder.length > 0 && remainder[0] === remainder[0].toUpperCase()) {
                return { initResName, initMethod };
            }
            break; // Exit the loop if prefix matches but doesn't follow the capitalization rule
        }
    }

    // Not a simple verb or a By/In case
    let extractedVerb = simpleMethods.find(methodPrefix => initMethod.startsWith(methodPrefix));
    if (extractedVerb) {
        const restOfMethod = initMethod.substring(extractedVerb.length);
        initResName += restOfMethod; // Append the rest of the method to the resource name
        initMethod = extractedVerb; // The method is the simple verb itself
        return { initResName, initMethod };
    }

    return { initResName, initMethod };
}


export async function tag(combinedDir, taggedDir, specificationDir, debug, dryrun) {

    logger.info(`tagging ${specificationDir}...`);

    const inputDir = `${combinedDir}/${specificationDir}`;
    
    // get metadata for service
    if (!serviceInfo[specificationDir]){
        logger.warn(`skipping ${specificationDir}, no metadata...`);
        return;
    }

    const providerName = serviceInfo[specificationDir].provider;
    const serviceName = serviceInfo[specificationDir].service;
    const title = serviceInfo[specificationDir].title;
    const description = serviceInfo[specificationDir].description;
        
    const outputDir = `${taggedDir}/${providerName}/v00.00.00000/services/${serviceName}`;

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

    // get generated date for version
    const date = new Date();
    const versionDate = `${date.toISOString().split('T')[0]}-stackql-generated`;
    debug ? logger.debug(`version : ${versionDate}`): null;
    debug ? logger.debug(`contact info : ${JSON.stringify(contactInfo)}`): null;
   
    const uniqueInitMethods = new Set();

    for (const f of files) {
        const fileName = `${inputDir}/${f}`;
        debug ? logger.debug(`Processing ${fileName}`): null;

        inputDoc = await $RefParser.parse(fileName);

        // Check if 'paths' is not present or is an empty object
        if (!inputDoc.paths || Object.keys(inputDoc.paths).length === 0) {
            throw new Error(`The specification '${fileName}' contains no paths.`);
        }

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
                            finalProps = {...finalProps, ...inputDoc.components.schemas[schemaName]['properties']};
                            
                            // flatten nested props?
                            // if (inputDoc.components.schemas[schemaName]['properties']['properties'] &&
                            //     inputDoc.components.schemas[schemaName]['properties']['properties']['x-ms-client-flatten'] &&
                            //     inputDoc.components.schemas[schemaName]['properties']['properties']['x-ms-client-flatten'] == true &&
                            //     inputDoc.components.schemas[schemaName]['properties']['properties']['$ref']){
                            //         let origProps = inputDoc.components.schemas[schemaName]['properties'];
                            //         let referredSchemaName = inputDoc.components.schemas[schemaName]['properties']['properties']['$ref'].split('/').pop();
                            //         finalProps = {...finalProps, ...inputDoc.components.schemas[referredSchemaName]['properties']};
                            //         delete origProps['properties'];
                            //         finalProps = {...finalProps, ...origProps};
                            // } else {
                            //     finalProps = {...finalProps, ...inputDoc.components.schemas[schemaName]['properties']};    
                            // }
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
                        const operationId = inputDoc.paths[pathKey][verbKey]['operationId'];

                        logger.info(`Processing operationId ${operationId}`);

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

                        let stackqlResName;
                        let stackqlSqlVerb = 'exec';
                        let stackqlObjectKey = 'none';

                        let finalMethod;
                        
                        if (!operationId.split('_')[1]){
                            // replace outlier operationIds with no method
                            if (inputDoc.paths[pathKey][verbKey]['tags']){
                                let tag = inputDoc.paths[pathKey][verbKey]['tags'][0].replace(/( |,|-)/g, '');
                                // use the tag
                                stackqlResName = camelToSnake(fixCamelCase(tag));
                            }
                        } else {
                            // we have a method, lets check it
                            // clean up camel case before we convert to snake case in openapi-doc-util
                            // let initResName = operationId.split('_')[0];
                            // let initMethod = operationId.split('_')[1];

                            let { initResName, initMethod } = processOperationId(operationId);

                            uniqueInitMethods.add(initMethod);

                            let finalResName = initResName;
                            finalMethod = initMethod;
                            
                            // fix up anomolies in operationid naming
                            if (['list', 'update'].includes(initResName.toLowerCase())){
                                finalResName = initMethod;
                                finalMethod = initResName;
                                logger.info(`initResName is ${initResName}, initMethod is ${initMethod}`);
                                logger.info(`changing finalResName to ${initMethod}`);
                                logger.info(`changing finalMethod to ${initResName}`);
                            }

                            // get stackql resourcename
                            getResourceNameFromOpId(serviceName, operationId) ? stackqlResName = getResourceNameFromOpId(serviceName, operationId) : stackqlResName = camelToSnake(fixCamelCase(finalResName));

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

                            // get stackql objectkey
                            stackqlObjectKey = getObjectKey(serviceName, stackqlResName, verbKey, finalMethod);
                        }
                        
                        debug ? logger.debug(`stackql resource : ${stackqlResName}`): null;
                        debug ? logger.debug(`stackql verb : ${stackqlSqlVerb}`): null;

                        // add special keys to the operation
                        outputDoc.paths[versionedPath][verbKey]['x-stackQL-resource'] = stackqlResName;
                        outputDoc.paths[versionedPath][verbKey]['x-stackQL-verb'] = stackqlSqlVerb;

                        // if(finalMethod){
                        //     let finalStackQLMethodName = camelToSnake(fixCamelCase(finalMethod))

                        //     if(stackqlSqlVerb == 'exec' && finalStackQLMethodName.includes('get','list')){
                        //         finalStackQLMethodName = `exec_${finalStackQLMethodName}`;
                        //     }
    
                        //     outputDoc.paths[versionedPath][verbKey]['x-stackQL-method'] = finalStackQLMethodName;                        
                        // }

                        if(finalMethod){
                            let finalStackQLMethodName = camelToSnake(fixCamelCase(finalMethod))
                        
                            // Check if finalMethod is 'List' and stackqlSqlVerb is 'exec'
                            if(stackqlSqlVerb == 'exec' && finalMethod.toLowerCase() === 'list'){
                                finalStackQLMethodName = `exec_list`;
                            }

                            // Check if finalMethod is 'Get' and stackqlSqlVerb is 'exec'
                            if(stackqlSqlVerb == 'exec' && finalMethod.toLowerCase() === 'get'){
                                finalStackQLMethodName = `exec_get`;
                            }                            
                        
                            outputDoc.paths[versionedPath][verbKey]['x-stackQL-method'] = finalStackQLMethodName;                        
                        }

                        stackqlObjectKey == 'none' ? null : outputDoc.paths[versionedPath][verbKey]['x-stackQL-objectKey'] = stackqlObjectKey;

                    } catch (e) {
                        console.log(e);
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

    console.log("Unique initMethod values:");
    console.log(Array.from(uniqueInitMethods));

}
