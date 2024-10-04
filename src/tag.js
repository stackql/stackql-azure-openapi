import $RefParser from '@apidevtools/json-schema-ref-parser';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { ConsoleLogger } from '@autorest/common';
import { contactInfo, serviceInfo } from './includes/provider-metadata.js';
import {     
    getSQLVerbFromMethod,
    camelToSnake,
    fixCamelCaseIssues,
    fixCamelCase,
    // getObjectKey, 
    determineObjectKey,
    getResourceNameFromOpId,
    checkForOpIdUpdates,
} from './includes/stackql-azure-descriptors.js';
import { 
    servicesToSkip 
} from './includes/shared-functions.js';

const logger = new ConsoleLogger();

//
// main tag function
//
export async function tag(combinedDir, taggedDir, specificationDir, debug, dryrun) {

    logger.info(`tagging ${specificationDir}...`);

    if(servicesToSkip.includes(specificationDir)){
        logger.info(`skipping ${specificationDir}...`);
        return;
    }

    const inputDir = `${combinedDir}/${specificationDir}`;
    
    const providerName = serviceInfo[specificationDir].provider;
    const serviceName = serviceInfo[specificationDir].service;
    const title = serviceInfo[specificationDir].title;
    const description = serviceInfo[specificationDir].description;
    const outputDir = `${taggedDir}/${providerName}/v00.00.00000/services`;
        
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

    const stackQLHttpOps = [
        'get',
        'put',
        'post',
        'delete',
        'patch',
    ]

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
        debug ? logger.debug(`cleaning response schemas...`): null;
        Object.keys(inputDoc.components.schemas).forEach(schemaName => {
            debug ? logger.debug(`processing ${schemaName}...`): null;
            // check if the schema is an object
            if (!inputDoc.components.schemas[schemaName].type || inputDoc.components.schemas[schemaName].type == 'object'){
                // check for acceptable cases
                if (
                    inputDoc.components.schemas[schemaName]['properties'] &&
                    !inputDoc.components.schemas[schemaName]['properties']['properties'] && 
                    !inputDoc.components.schemas[schemaName]['allOf'] 
                    ){
                        // object is all good, nothing to see here...
                        debug ? logger.debug(`bypassing ${schemaName}...`): null;
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
        debug ? logger.debug(`adding paths...`): null;
        Object.keys(inputDoc.paths).forEach(pathKey => {
            debug ? logger.debug(`processing path ${pathKey}`): null;

            let apiVersion = inputDoc.paths[pathKey]['x-api-version'];
            let versionedPath = `${pathKey}?api-version=${apiVersion}`;
            debug ? logger.debug(`API version ${apiVersion}`): null;
            debug ? logger.debug(`versioned path ${versionedPath}`): null;

            outputDoc.paths[versionedPath] ? null : outputDoc.paths[versionedPath] = {};

            Object.keys(inputDoc.paths[pathKey]).forEach(verbKey => {
                debug ? logger.debug(`processing operation ${pathKey}:${verbKey}`): null;
                
                if (verbKey != 'x-api-version'){
                    outputDoc.paths[versionedPath][verbKey] = inputDoc.paths[pathKey][verbKey];
                }

                // remove api version from path level parameters
                if (verbKey == 'parameters'){
                    debug ? logger.debug(`removing api version from path parameters for ${pathKey}`): null;
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
                        logger.info(`processing operationId ${inputDoc.paths[pathKey][verbKey]['operationId']}`);
                        let operationId = checkForOpIdUpdates(serviceName, inputDoc.paths[pathKey][verbKey]['operationId']) ? checkForOpIdUpdates(serviceName, inputDoc.paths[pathKey][verbKey]['operationId']) : inputDoc.paths[pathKey][verbKey]['operationId'];
                        operationId != inputDoc.paths[pathKey][verbKey]['operationId'] ? logger.info(`operationId updated to ${operationId}`): null;
                        const operationObj = inputDoc.paths[pathKey][verbKey];

                        // remove api version from operation level parameters
                        if (inputDoc.paths[pathKey][verbKey]['parameters']){
                            debug ? logger.debug(`removing api version from operation level parameters for ${pathKey}:${verbKey}`): null;
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

                        // get resourcename, method and verb from operationId

                        let stackqlResName;
                        let stackqlSqlVerb = 'exec';
                        let stackqlObjectKey = 'none';
                        let stackqlMethodName;
                        
                        if (!operationId.split('_')[1]){
                            logger.info(`operationId [${operationId}] not splittable, update checkForOpIdUpdates for [${serviceName}]`);
                            // replace outlier operationIds with no method
                            if(providerName === 'azure'){
                                throw `operationId [${operationId}] not splittable, update checkForOpIdUpdates`;
                            }
                            // replace outlier operationIds with no method
                            if (inputDoc.paths[pathKey][verbKey]['tags']){
                                let tag = inputDoc.paths[pathKey][verbKey]['tags'][0].replace(/( |,|-)/g, '');
                                debug ? logger.debug(`using ${tag} for initial resource name and method`): null;
                                // use the tag
                                stackqlResName = tag;
                                stackqlMethodName = tag;
                            } else {
                                stackqlResName = operationId;
                                stackqlMethodName = operationId;
                            }                            
                        } else {
                            debug ? logger.debug(`operationId ${operationId} is splittable, getting initial resource and method`): null;
                            const returnValue = processOperationId(operationId, debug);
                            const resolvedResName = returnValue.initResName;
                            const resolvedMethod = returnValue.initMethod;

                            stackqlResName = resolvedResName;
                            stackqlMethodName = resolvedMethod;

                            debug ? logger.debug(`initial resource name set to ${stackqlResName}, initial method set to ${stackqlMethodName}`) : null;
                            uniqueInitMethods.add(stackqlMethodName);
                        }
                        
                        // get final resource name
                        getResourceNameFromOpId(serviceName, operationId) ? stackqlResName = getResourceNameFromOpId(serviceName, operationId) : stackqlResName = camelToSnake(fixCamelCaseIssues(fixCamelCase(stackqlResName)));
                        // remove service from stackqlResName
                        if (stackqlResName.startsWith(serviceName) && stackqlResName != serviceName){

                            debug ? logger.debug(`cleaning resource name for ${stackqlResName}`): null;
                            if (serviceName == 'security' && stackqlResName == 'security_connectors'){
                                debug ? logger.debug(`bypassing ${serviceName}.${stackqlResName}`): null;
                            } else {
                                stackqlResName.substring(serviceName.length+1).length < 3 ? null : stackqlResName = stackqlResName.substring(serviceName.length+1);
                                debug ? logger.debug(`new resource name is ${stackqlResName}`): null;
                            }
                        }

                        // get sql verb
                        stackqlSqlVerb = getSQLVerbFromMethod(serviceName, stackqlResName, stackqlMethodName, operationId);
                        debug ? logger.debug(`stackqlSqlVerb is ${stackqlSqlVerb}`) : null;

                        // get final method name
                        stackqlMethodName = camelToSnake(fixCamelCaseIssues(fixCamelCase(stackqlMethodName)))

                        // Check if finalMethod is 'List' and stackqlSqlVerb is 'exec'
                        if(stackqlSqlVerb == 'exec' && stackqlMethodName.toLowerCase() === 'list'){
                            stackqlMethodName = `exec_list`;
                        }

                        // Check if finalMethod is 'Get' and stackqlSqlVerb is 'exec'
                        if(stackqlSqlVerb == 'exec' && stackqlMethodName.toLowerCase() === 'get'){
                            stackqlMethodName = `exec_get`;
                        }                            

                        // get object key
                        stackqlObjectKey = determineObjectKey(serviceName, operationId, operationObj, inputDoc, debug);

                        debug ? logger.debug(`stackql resource : ${stackqlResName}`): null;
                        debug ? logger.debug(`stackql method : ${stackqlMethodName}`): null;
                        debug ? logger.debug(`stackql verb : ${stackqlSqlVerb}`): null;
                        debug ? logger.debug(`stackql object key : ${stackqlObjectKey}`): null;
                       
                        stackqlResName != 'skip_this_resource' && stackQLHttpOps.includes(verbKey) ? addToStackQLResources(outputDoc, providerName, serviceName, stackqlResName, versionedPath, verbKey, stackqlMethodName, stackqlSqlVerb, stackqlObjectKey, debug): null;

                    } catch (e) {
                        console.log(e);
                        if (e !== 'Break') throw e
                    }
                }
        
            });
        });
    }

    // sort the sqlverbs from most specific (highest number of path params) to least specific (lowest number of path params)
    debug ? logger.debug(`sorting sqlVerbs...`): null;
    sortSQLVerbs(outputDoc, debug);
    
    // clean up all free text descriptions
    debug ? logger.debug(`cleaning up markdown in description fields...`): null;
    outputDoc = cleanUpDescriptions(outputDoc);

    //
    // Second pass to add views
    //

    logger.info(`Processing second pass for SQL views in ${specificationDir}...`);

    const completeDoc = await processResources(outputDoc, providerName, serviceName, debug);

    if (dryrun){
        logger.info(`dryrun specified, no output written`);
    } else {
        logger.info(`writing ${outputDir}/${serviceName}.yaml...`);
        fs.writeFileSync(`${outputDir}/${serviceName}.yaml`, yaml.dump(completeDoc, {lineWidth: -1, noRefs: true}));
        logger.info(`${outputDir}/${serviceName}.yaml written successfully`);
    }
    logger.info(`${specificationDir} finished processing`);

    // logger.debug("Unique initMethod values:");
    // logger.debug(Array.from(uniqueInitMethods));

}

//
// tag utility functions
//
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

function processOperationId(operationId, debug) {
    let initResName = operationId.split('_')[0];
    let initMethod = operationId.split('_')[1];

    debug ? logger.debug(`initial resource name : ${initResName}`) : null;
    debug ? logger.debug(`initial method : ${initMethod}`) : null;

    // transpose if necessary
    if(initResName.toLowerCase() === 'list' || initResName.toLowerCase() === 'get' || initResName.toLowerCase() === 'create' || initResName.toLowerCase() === 'update' || initResName.toLowerCase() === 'delete'){
        initResName = operationId.split('_')[1];
        initMethod = operationId.split('_')[0];
        debug ? logger.debug(`transposed method : ${initMethod}`) : null;
        debug ? logger.debug(`transposed resource name : ${initResName}`) : null;
    }

    // Simple cases
    const simpleMethods = ['GetAll', 'CreateOrUpdate', 'CreateorUpdate', 'CreateUpdate', 'CreateAndUpdate', 'CreateOrReplace', 'CreateIfNotExist', 'CreateOrGetStartPendingUpload', 'Get', 'List', 'Create', 'Update', 'Delete', 'get', 'list', 'create', 'update', 'delete'];    
    if (simpleMethods.includes(initMethod)) {
        debug ? logger.debug(`returning resource name : ${initResName}`) : null;
        debug ? logger.debug(`returning method : ${initMethod}`) : null;
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

function addToStackQLResources(outputDoc, providerName, serviceName, stackqlResName, versionedPath, verbKey, stackqlMethodName, stackqlSqlVerb, stackqlObjectKey, debug) {
    debug ? logger.debug(`adding ${stackqlMethodName} to ${providerName}.${serviceName}.${stackqlResName}...`) : null;
    debug ? logger.debug(`sqlVerb : ${stackqlSqlVerb}`) : null;
    debug ? logger.debug(`stackqlObjectKey : ${stackqlObjectKey}`) : null;
    
    if (!outputDoc.components) {
        outputDoc.components = {};
    }
    if (!outputDoc.components['x-stackQL-resources']) {
        outputDoc.components['x-stackQL-resources'] = {};
    }
    if (!outputDoc.components['x-stackQL-resources'][stackqlResName]) {
        outputDoc.components['x-stackQL-resources'][stackqlResName] = {
            id: `${providerName}.${serviceName}.${stackqlResName}`,
            name: stackqlResName,
            title: stackqlResName,
            methods: {},
            sqlVerbs: {
                select: [],
                insert: [],
                update: [],
                replace: [],
                delete: []
            }
        };
    }

    const methodObj = {
        operation: {
            $ref: `#/paths/${versionedPath.replace(/\//g, '~1')}/${verbKey}`,
            operationId: outputDoc.paths[versionedPath][verbKey].operationId
        },
        response: {
            mediaType: 'application/json',
            openAPIDocKey: '200'
        }
    };

    if (stackqlObjectKey !== 'none' && stackqlSqlVerb === 'select') {
        methodObj.response['objectKey'] = stackqlObjectKey;
    }

    outputDoc.components['x-stackQL-resources'][stackqlResName].methods[stackqlMethodName] = methodObj;

    // Add "naked" method if objectKey is present
    // if (stackqlObjectKey !== 'none') {
    //     const nakedMethodName = `_${stackqlMethodName}`;
    //     const nakedMethodObj = { ...methodObj };
    //     delete nakedMethodObj.response.objectKey;
    //     outputDoc.components['x-stackQL-resources'][stackqlResName].methods[nakedMethodName] = nakedMethodObj;
    // }

    // Add references to sqlVerbs
    const methodRef = { $ref: `#/components/x-stackQL-resources/${stackqlResName}/methods/${stackqlMethodName}` };

    switch (stackqlSqlVerb.toLowerCase()) {
        case 'select':
            outputDoc.components['x-stackQL-resources'][stackqlResName].sqlVerbs.select.push(methodRef);
            break;
        case 'insert':
            outputDoc.components['x-stackQL-resources'][stackqlResName].sqlVerbs.insert.push(methodRef);
            break;
        case 'update':
            outputDoc.components['x-stackQL-resources'][stackqlResName].sqlVerbs.update.push(methodRef);
            break;
        case 'replace':
            outputDoc.components['x-stackQL-resources'][stackqlResName].sqlVerbs.replace.push(methodRef);
            break;            
        case 'delete':
            outputDoc.components['x-stackQL-resources'][stackqlResName].sqlVerbs.delete.push(methodRef);
            break;
    }
}

function sortSQLVerbs(outputDoc, debug) {
    if (!outputDoc.components || !outputDoc.components['x-stackQL-resources']) {
        debug ? logger.debug('No resources found in the document.') : null;
        return;
    }

    for (const resourceName in outputDoc.components['x-stackQL-resources']) {
        const resource = outputDoc.components['x-stackQL-resources'][resourceName];

        debug ? logger.debug(`processing sqlVerbs for ${resource.id}`) : null;

        // Iterate through sqlVerbs and sort
        for (const sqlVerb in resource.sqlVerbs) {
            debug ? logger.debug(`sorting ${sqlVerb}`) : null;
            outputDoc.components['x-stackQL-resources'][resourceName].sqlVerbs[sqlVerb].sort((a, b) => {
                const aPath = getPathFromRef(a, outputDoc);
                const bPath = getPathFromRef(b, outputDoc);
                const aPathParams = countCurlyBraces(aPath);
                const bPathParams = countCurlyBraces(bPath);
                return bPathParams - aPathParams; // Sort in descending order of path params
            });
        }
    }
}

function getPathFromRef(ref, outputDoc) {
    const refPath = ref.$ref.split('#/')[1];
    const pathObject = getPathObjectFromRef(outputDoc, refPath.replace(/~1/g, '/').replace(/~0/g, '~'));
    return pathObject ? pathObject.operation.$ref : '';
}

function countCurlyBraces(str) {
    return (str.match(/{/g) || []).length;
}

function getPathObjectFromRef(obj, path) {
    // Decode JSON Pointer path
    const decodedPath = path.replace(/~1/g, '/').replace(/~0/g, '~');
    const keys = decodedPath.split('/');
    let result = obj;

    for (const key of keys) {
        if (result && result.hasOwnProperty(key)) {
            result = result[key];
        } else {
            logger.warn(`Key ${key} not found in the current object. Path traversal stopped.`);
            return undefined;
        }
    }
    return result;
}

//
// main function to generate views
//
async function processResources(outputDoc, providerName, serviceName, debug) {
    for (const resourceName of Object.keys(outputDoc.components['x-stackQL-resources'])) {
        logger.info(`Processing resource: ${resourceName}...`);
        const resource = outputDoc.components['x-stackQL-resources'][resourceName];
        const resourceId = resource.id;
        logger.info(`FQ resource id: ${resourceId}`);

        const selectMethods = (resource && resource.sqlVerbs && resource.sqlVerbs.select) ? resource.sqlVerbs.select : [];

        debug ? logger.debug(`Found ${selectMethods.length} select methods for [${resourceName}].`) : null;

        if (selectMethods.length === 0) {
            debug ? logger.debug(`No select methods found for [${resourceName}]. Skipping...`) : null;
            continue; // Use continue instead of return to skip to the next resource
        }

        const firstSelectMethodRef = selectMethods[0].$ref;
        debug ? logger.debug(`First select method reference for ${resourceName}: ${firstSelectMethodRef}`) : null;

        const methodName = firstSelectMethodRef.split('/').pop();
        debug ? logger.debug(`Method name for ${resourceName}: ${methodName}`) : null;

        const firstSelectMethod = resource.methods[methodName];

        const responseKey = (firstSelectMethod.response && firstSelectMethod.response.openAPIDocKey) ? firstSelectMethod.response.openAPIDocKey : null;

        const opPath = firstSelectMethod.operation.$ref;
        const { path, verb } = extractPathAndVerb(opPath);

        if(verb != 'get'){
            debug ? logger.debug(`Skipping ${resourceName} as it is not a GET operation.`) : null;
            continue;
        }

        debug ? logger.debug(`Path for ${resourceName}: ${path}`) : null;
        debug ? logger.debug(`Verb for ${resourceName}: ${verb}`) : null;

        // Process the least specific path
        const lastSelectMethodRef = selectMethods[selectMethods.length - 1].$ref;

        debug ? logger.debug(`Last select method reference for ${resourceName}: ${lastSelectMethodRef}`) : null;

        const lastMethodName = lastSelectMethodRef.split('/').pop();
        debug ? logger.debug(`Last method name for ${resourceName}: ${lastMethodName}`) : null;

        const lastSelectMethod = resource.methods[lastMethodName];

        const lastOpPath = lastSelectMethod.operation.$ref;
        const { path: lastPath, verb: lastVerb } = extractPathAndVerb(lastOpPath);
        debug ? logger.debug(`Last path for ${resourceName}: ${lastPath}`) : null;

        // Extract response schema name
        let responseSchemaName;
        const responseSchemaType = (outputDoc.paths[path] && outputDoc.paths[path][verb] && outputDoc.paths[path][verb].responses && outputDoc.paths[path][verb].responses[responseKey] && outputDoc.paths[path][verb].responses[responseKey].content && outputDoc.paths[path][verb].responses[responseKey].content['application/json'] && outputDoc.paths[path][verb].responses[responseKey].content['application/json'].schema.type) ? outputDoc.paths[path][verb].responses[responseKey].content['application/json'].schema.type : null;

        if (responseSchemaType === 'array') {
            responseSchemaName = outputDoc.paths[path][verb].responses[responseKey].content['application/json'].schema.items.$ref.split('/').pop();
            debug ? logger.debug(`Response Schema for ${resourceName} (${methodName}) is an array.`) : null;
        } else {
            responseSchemaName = outputDoc.paths[path][verb].responses[responseKey].content['application/json'].schema.$ref.split('/').pop();
        }

        debug ? logger.debug(`Response Schema for ${resourceName} (${methodName}): ${responseSchemaName}`) : null;

        const responseSchema = outputDoc.components.schemas[responseSchemaName];

        debug ? logger.debug(`Response schema found for ${resourceName}.`) : null;

        // Ensure the `properties` field exists
        const propertiesRef = (responseSchema.properties && responseSchema.properties.properties && responseSchema.properties.properties.$ref) ? responseSchema.properties.properties.$ref : null;
        if (!propertiesRef) {
            debug ? logger.debug(`No top-level 'properties' field found for [${resourceName}]. Skipping view creation.`) : null;
            continue; // Use continue instead of return to skip to the next resource
        }

        logger.info(`Top-level properties field found for [${resourceName}]. Proceeding to create view...`);

        const newViewResourceName = `vw_${resourceName}`;
        logger.info(`Creating view for [${resourceName}] as ${newViewResourceName}...`);

        const columns = [];
        const topLevelFields = responseSchema.properties || {};
        const propertiesFields = outputDoc.components.schemas[propertiesRef.split('/').pop()].properties || {};

        // first SELECT (most specific) method
        const firstMethodPathParams = pathParamsFromPath(path);
        debug ? logger.debug(`Required path parameters (most specific) for ${resourceName}: ${firstMethodPathParams}`) : null;
        let firstMethodQueryParams = getRequiredQueryParams(outputDoc, path, verb);
        debug ? logger.debug(`Required query parameters (most specific) for ${resourceName}: ${firstMethodQueryParams}`) : null;

        const firstMethodCombReqParams = [...new Set([...firstMethodPathParams, ...firstMethodQueryParams])];

        // last SELECT (least specific) method
        const lastMethodPathParams = pathParamsFromPath(lastPath);
        debug ? logger.debug(`Required path parameters (least specific) for ${resourceName}: ${lastMethodPathParams}`) : null;
        let lastMethodQueryParams = getRequiredQueryParams(outputDoc, lastPath, lastVerb);
        debug ? logger.debug(`Required query parameters (most specific) for ${resourceName}: ${lastMethodQueryParams}`) : null;
        
        const lastMethodCombReqParams = [...new Set([...lastMethodPathParams, ...lastMethodQueryParams])];

        // hack fix
        if(resourceId === 'azure.maria_db.top_query_statistics'){
            lastMethodCombReqParams.push('queryStatisticId');
        } else if(resourceId === 'azure.maria_db.wait_statistics'){
            lastMethodCombReqParams.push('waitStatisticsId');
        } else if(resourceId === 'azure.monitor.tenant_action_groups'){
            lastMethodCombReqParams.push('tenantId');
        } else if(resourceId === 'azure.security.dev_ops_policy_assignments'){
            lastMethodCombReqParams.push('resourceId');
        }

        const combinedRequiredParams = [...new Set([...firstMethodCombReqParams, ...lastMethodCombReqParams])];

        // Log combinedRequiredParams as a CSV
        // console.log(`${resourceName},${combinedRequiredParams.join(',')}`);

        // Prioritize fields
        const prioritizedFields = ['id', 'name', 'description', 'location'];

        // Step 1: Add id, name, description, and location if they exist
        prioritizedFields.forEach((field) => {
            if (topLevelFields[field]) {
                columns.push(`${field} as ${camelToSnake(fixCamelCaseIssues(fixCamelCase(field)))}`);
                debug ? logger.debug(`Added prioritized field ${field} to columns.`) : null;
            }
        });

        // Step 2: Add all other fields except `properties`
        Object.keys(topLevelFields).forEach((topField) => {
            if (topField !== 'properties' && !prioritizedFields.includes(topField)) {
                columns.push(`${topField} as ${camelToSnake(fixCamelCaseIssues(fixCamelCase(topField)))}`);
                debug ? logger.debug(`Added top-level field ${topField} to columns.`) : null;
            }
        });

        // Add `properties` fields to the columns array, converting to JSON extraction in SQL
        Object.keys(propertiesFields).forEach((propField) => {
            columns.push(`JSON_EXTRACT(properties, '$.${propField}') as "${camelToSnake(fixCamelCaseIssues(fixCamelCase(propField)))}"`);
            debug ? logger.debug(`Added property field ${propField} to columns as JSON extraction.`) : null;
        });

        // Add path parameters to the columns array
        combinedRequiredParams.forEach((param) => {
            columns.push(param);
            debug ? logger.debug(`Added path parameter ${param} to columns.`) : null;
        });

        // Create the SQL query template
        const whereConditions = lastMethodCombReqParams.length > 0 ? lastMethodCombReqParams.map(param => `${param} = 'replace-me'`).join(' AND ') : combinedRequiredParams.map(param => `${param} = 'replace-me'`).join(' AND ');

        const selectQuery = `
SELECT
${columns.join(',\n')}
FROM ${providerName}.${serviceName}.${resourceName}
${whereConditions ? `WHERE ${whereConditions}` : ''};
`;

        // Add the view to the `x-stackQL-resources` section
        outputDoc.components['x-stackQL-resources'][newViewResourceName] = {
            id: `${providerName}.${serviceName}.${newViewResourceName}`,
            name: newViewResourceName,
            config: {
                views: {
                    select: {
                        predicate: 'sqlDialect == "sqlite3"',
                        ddl: selectQuery.trim(),
                        fallback: {
                            predicate: 'sqlDialect == "postgres"',
                            ddl: selectQuery.replace(/JSON_EXTRACT/g, 'json_extract_path_text').trim()
                        }
                    }
                }
            }
        };
        logger.info(`View ${newViewResourceName} created successfully for [${resourceName}].`);
    }
    return outputDoc;
}

//
// view processing utility functions
//
function extractPathAndVerb(opPath) {
    // Step 1: Remove the leading `#/paths/`
    let cleanedPath = opPath.replace('#/paths/', '');

    // Step 2: Replace '~1' with '/'
    cleanedPath = cleanedPath.replace(/~1/g, '/');

    // Step 3: Split the path to extract the HTTP verb
    const parts = cleanedPath.split('/');
    const verb = parts.pop();  // The last part is the verb
    const path = parts.join('/');  // Join the rest to form the cleaned path

    return { path, verb };
}

function getRequiredQueryParams(outputDoc, path, verb) {
    const requiredQueryParams = [];
  
    // Get the parameters for the specified path and verb
    const operation = outputDoc.paths[path][verb];
    const parameters = operation.parameters || [];
  
    parameters.forEach(param => {
      let paramDetails;
  
      // Check if the parameter is a reference
      if (param.$ref) {
        // Resolve the reference to the actual parameter object
        const refPath = param.$ref.split('/').pop();
        paramDetails = outputDoc.components.parameters[refPath];  // Function to resolve $ref
      } else {
        paramDetails = param;
      }
  
      // Check if the parameter is in 'query' and is required
      if (paramDetails.in === 'query' && paramDetails.required) {
        requiredQueryParams.push(paramDetails.name);
      }
    });
  
    return requiredQueryParams;
}
  
function pathParamsFromPath(path) {
    // Define a regex to match everything inside curly braces {}
    const regex = /\{([^}]+)\}/g;
    
    // Initialize an empty array to store the matches
    const pathParams = [];
    
    let match;
    
    // Use the regex to find all matches in the path string
    while ((match = regex.exec(path)) !== null) {
        // Add the matched token without curly braces to the output list
        pathParams.push(match[1]);
    }
    
    return pathParams;
}
