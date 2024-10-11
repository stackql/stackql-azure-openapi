import $RefParser from '@apidevtools/json-schema-ref-parser';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { ConsoleLogger } from '@autorest/common';
import { contactInfo, serviceInfo } from './includes/provider-metadata.js';
import {     
    camelToSnake,
    fixCamelCaseIssues,
    fixCamelCase,
    determineObjectKey,
    cleanResourceName,
    isNotSelectable,
    getTransformedOperationId,
    resolveStackQLDescriptorsFromOpId,
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

                        const operationObj = inputDoc.paths[pathKey][verbKey];
                        const originalOperationId = inputDoc.paths[pathKey][verbKey]['operationId'];
                        const operationTags = inputDoc.paths[pathKey][verbKey]['tags'] ? inputDoc.paths[pathKey][verbKey]['tags'] : [];
                        logger.info(`processing operationId [${originalOperationId}]`);


                        //
                        // update operationId if necessary
                        // 
                        const transformedOperationId = getTransformedOperationId(serviceName, originalOperationId);
                        if (transformedOperationId){
                            logger.info(`transformed operationId [${transformedOperationId}]`);
                            outputDoc.paths[versionedPath][verbKey]['operationId'] = transformedOperationId;
                            outputDoc.paths[versionedPath][verbKey]['x-ms-original-operationId'] = originalOperationId;
                        }
                        
                        const operationId = transformedOperationId ? transformedOperationId : originalOperationId;

                        //
                        // resolve resource name and method
                        // 

                        let stackqlResName;
                        let stackqlMethodName;
                        let stackqlSqlVerb = 'exec';
                        let stackqlObjectKey = 'none';
                    
                        // direct hit
                        // ({ stackqlResName, stackqlMethodName } = resolveStackQLDescriptorsFromOpId(serviceName, operationId));
                        ({ stackqlResName, stackqlMethodName } = resolveStackQLDescriptorsFromOpId(operationId));

                        // if(!stackqlResName && !stackqlMethodName){

                            // // splitable
                            // if (operationId.split('_')[1]){
                            //     ({ stackqlResName, stackqlMethodName } = resolveStackQLDescriptorsFromSplittableOpId(serviceName, operationId));
                            // } else {
                            //     // not splitable
                            //     ({ stackqlResName, stackqlMethodName } = resolveStackQLDescriptorsFromNonSplittableOpId(operationId, operationTags));
                            // }
                        // }

                        stackqlResName = cleanResourceName(serviceName, stackqlResName);

                        logger.info(`resolved resource name: [${stackqlResName}]`);
                        logger.info(`resolved method name: [${stackqlMethodName}]`);

                        //
                        // resolve sql verb
                        //

                        if(verbKey.toLowerCase() == 'delete'){
                            if(stackqlMethodName == 'delete' || stackqlMethodName.startsWith('delete_by') || stackqlMethodName.startsWith('delete_in')){
                                stackqlSqlVerb = 'delete';
                            }
                        }
                    
                        if(verbKey.toLowerCase() == 'post' || verbKey.toLowerCase() == 'put'){
                            if(isMethodOrFirstTokenEqualTo(stackqlMethodName, 'create')){
                                stackqlSqlVerb =  'insert';
                            }
                        }

                        if(verbKey.toLowerCase() == 'put'){
                            if(stackqlMethodName == 'update' || stackqlMethodName == 'put' || stackqlMethodName == 'replace'){ 
                                stackqlSqlVerb =  'replace';
                            }
                        }    
                    
                        if(verbKey.toLowerCase() == 'patch'){
                            if(stackqlMethodName == 'update' || stackqlMethodName == 'patch'){ 
                                stackqlSqlVerb =  'update';
                            }
                        }    
                    
                        if(verbKey.toLowerCase() == 'get' || verbKey.toLowerCase() == 'post'){
                            if(isMethodOrFirstTokenEqualTo(stackqlMethodName, 'get') || isMethodOrFirstTokenEqualTo(stackqlMethodName, 'list')){
                                if(isNotSelectable(serviceName, stackqlResName, stackqlMethodName)){
                                    stackqlSqlVerb =  'exec';
                                } else {
                                    stackqlSqlVerb =  'select';
                                }
                            }
                        }

                        logger.info(`resolved SQL verb: [${stackqlSqlVerb}]`);

                        //
                        // get object key
                        //
                        stackqlObjectKey = determineObjectKey(serviceName, operationId, operationObj, inputDoc, debug);

                        logger.info(`resolved object key: [${stackqlObjectKey}]`);

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

    // logger.info(`Processing second pass for SQL views in ${specificationDir}...`);

    const completeDoc = await processResources(outputDoc, providerName, serviceName, debug);
    // const completeDoc = outputDoc;

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

function isMethodOrFirstTokenEqualTo(method, searchStr) {
    const normalizedMethod = method.toLowerCase();
    const normalizedSearchStr = searchStr.toLowerCase();
    const methodTokens = normalizedMethod.split('_');
    return normalizedMethod === normalizedSearchStr || methodTokens[0] === normalizedSearchStr;
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

    const first2XXResponse = Object.keys(outputDoc.paths[versionedPath][verbKey].responses).find(responseCode => responseCode.startsWith('2'));
    const respSchemaRef = outputDoc.paths?.[versionedPath]?.[verbKey]?.responses?.[first2XXResponse]?.content?.['application/json']?.schema?.$ref?.split('/')?.pop() ?? null;

    const methodObj = {
        operation: {
            $ref: `#/paths/${versionedPath.replace(/\//g, '~1')}/${verbKey}`,
            operationId: outputDoc.paths[versionedPath][verbKey].operationId
        },
        response: {
            mediaType: 'application/json',
            openAPIDocKey: first2XXResponse,
        }
    };

    // Add response schema reference if available
    if (respSchemaRef) {
        methodObj.response['schemaRef'] = respSchemaRef;
    }

    // Add objectKey if available
    if (stackqlObjectKey !== 'none' && stackqlSqlVerb === 'select') {
        methodObj.response['objectKey'] = stackqlObjectKey;
    }

    outputDoc.components['x-stackQL-resources'][stackqlResName].methods[stackqlMethodName] = methodObj;

    // Add references to sqlVerbs
    const methodRef = { $ref: `#/components/x-stackQL-resources/${stackqlResName}/methods/${stackqlMethodName}` };

    switch (stackqlSqlVerb.toLowerCase()) {
        case 'select':
            if (respSchemaRef) {
                outputDoc.components['x-stackQL-resources'][stackqlResName].sqlVerbs.select.push(methodRef);
            }            
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
            // console.log('path', path);
            // console.log('verb', verb);
            // console.log('responseKey', responseKey);
            // console.info(outputDoc.paths[path][verb]);
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
