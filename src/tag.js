import $RefParser from '@apidevtools/json-schema-ref-parser';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { ConsoleLogger } from '@autorest/common';
import { contactInfo, serviceInfo } from './provider-metadata';
import {     
    getSQLVerbFromMethod,
    camelToSnake,
    fixCamelCaseIssues,
    fixCamelCase,
    // getObjectKey, 
    determineObjectKey,
    getResourceNameFromOpId,
    checkForOpIdUpdates,
} from './stackql-azure-descriptors';
import { 
    servicesToSkip 
} from './shared-functions';

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
    const simpleMethods = ['CreateOrUpdate', 'CreateorUpdate', 'CreateUpdate', 'CreateAndUpdate', 'CreateOrReplace', 'CreateIfNotExist', 'CreateOrGetStartPendingUpload', 'Get', 'List', 'Create', 'Update', 'Delete', 'get', 'list', 'create', 'update', 'delete'];    
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
            $ref: `#/paths/${versionedPath.replace(/\//g, '~1')}/${verbKey}`
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
                        let operationId = checkForOpIdUpdates(serviceName, inputDoc.paths[pathKey][verbKey]['operationId']) ? checkForOpIdUpdates(serviceName, inputDoc.paths[pathKey][verbKey]['operationId']) : inputDoc.paths[pathKey][verbKey]['operationId'];
                        operationId != inputDoc.paths[pathKey][verbKey]['operationId'] ? logger.info(`operationId updated to ${operationId}`): null;
                        const operationObj = inputDoc.paths[pathKey][verbKey];

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
                        let stackqlMethodName;
                        
                        if (!operationId.split('_')[1]){
                            debug ? logger.debug(`operationId ${operationId} not splittable, checking for tags`): null;
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
                        // stackqlObjectKey = getObjectKey(serviceName, stackqlResName, verbKey, stackqlMethodName);

                        debug ? logger.debug(`stackql resource : ${stackqlResName}`): null;
                        debug ? logger.debug(`stackql method : ${stackqlMethodName}`): null;
                        debug ? logger.debug(`stackql verb : ${stackqlSqlVerb}`): null;
                        debug ? logger.debug(`stackql object key : ${stackqlObjectKey}`): null;

                        // add special keys to the operation
                        // outputDoc.paths[versionedPath][verbKey]['x-stackQL-resource'] = stackqlResName;
                        // outputDoc.paths[versionedPath][verbKey]['x-stackQL-method'] = stackqlMethodName;
                        // outputDoc.paths[versionedPath][verbKey]['x-stackQL-verb'] = stackqlSqlVerb;
                        // stackqlObjectKey == 'none' ? null : outputDoc.paths[versionedPath][verbKey]['x-stackQL-objectKey'] = stackqlObjectKey;   
                        
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

    // add azure specific config key
    // debug ? logger.debug(`adding azure specific key to deal with allOf usage...`): null;
    // outputDoc['x-stackQL-config'] = {};
    // outputDoc['x-stackQL-config']['variations'] = {};
    // outputDoc['x-stackQL-config']['variations']['isObjectSchemaImplicitlyUnioned'] = true;

//
// second pass to add views
//

logger.info(`Processing second pass for SQL views in ${specificationDir}...`);

Object.keys(outputDoc.components['x-stackQL-resources']).forEach((resourceName) => {
    logger.info(`Processing resource : ${resourceName}...`);

    const resource = outputDoc.components['x-stackQL-resources'][resourceName];
    const selectMethods = (resource.sqlVerbs && resource.sqlVerbs.select) ? resource.sqlVerbs.select : [];

    logger.debug(`Found ${selectMethods.length} select methods for [${resourceName}].`);

    if (selectMethods.length > 0) {
        const firstSelectMethodRef = selectMethods[0].$ref;

        // Ensure firstSelectMethodRef exists and is valid
        if (!firstSelectMethodRef) {
            logger.warn(`First select method reference not found for [${resourceName}]. Skipping...`);
            return;
        }

        logger.debug(`First select method reference for ${resourceName}: ${firstSelectMethodRef}`);

        const methodName = firstSelectMethodRef.split('/').pop();

        logger.debug(`Method name for ${resourceName}: ${methodName}`);

        const firstSelectMethod = resource.methods[methodName]; 

        if (!firstSelectMethod) {
            logger.warn(`First select method not found for reference ${firstSelectMethodRef}. Skipping...`);
            return;
        }

        // Check if the response body has a top-level `properties` field
        const responseKey = firstSelectMethod.response && firstSelectMethod.response.openAPIDocKey;
        if (!responseKey) {
            logger.warn(`Response key not found in the first select method for resource [${resourceName}]. Skipping...`);
            return;
        }

        const opPath = firstSelectMethod.operation.$ref;

        logger.debug(`Response key for ${resourceName}: ${responseKey}`);

        const pathAndVerb = extractPathAndVerb(opPath);
        const path = pathAndVerb.path;
        const verb = pathAndVerb.verb;

        logger.debug(`Path for ${resourceName}: ${path}`);
        logger.debug(`Verb for ${resourceName}: ${verb}`);

        let responseSchemaName;

        // Check if the response schema is an array
        if (outputDoc.paths[path][verb].responses[responseKey].content['application/json'].schema.type === 'array') {
            logger.debug(`Response Schema for ${resourceName} (${methodName}) is an array.`);
            responseSchemaName = outputDoc.paths[path][verb].responses[responseKey].content['application/json'].schema.items.$ref.split('/').pop();
        } else {
            responseSchemaName = outputDoc.paths[path][verb].responses[responseKey].content['application/json'].schema.$ref.split('/').pop();
        }
        
        logger.debug(`Response Schema for ${resourceName} (${methodName}): ${responseSchemaName}`);

        const responseSchema = outputDoc.components.schemas[responseSchemaName];

        if (!responseSchema) {
            logger.warn(`Response schema not found for operation reference ${firstSelectMethod.operation && firstSelectMethod.operation.$ref} and response key ${responseKey}. Skipping...`);
            return;
        }

        logger.debug(`Response schema found for ${resourceName}.`);

        // Safeguard to ensure that `properties` exists
        if (responseSchema.properties && responseSchema.properties.properties && responseSchema.properties.properties.$ref) {
            logger.info(`Top-level properties field found for [${resourceName}]. Proceeding to create view...`);

            const newViewResourceName = `vw_${resourceName}`;
            logger.info(`Creating view for [${resourceName}] as ${newViewResourceName}...`);

            const columns = [];
            const topLevelFields = responseSchema.properties || {}; // fields at the top level
            const propertiesFields = outputDoc.components.schemas[responseSchema.properties.properties.$ref.split('/').pop()].properties || {}; // fields under `properties`

            // Add top-level fields to the columns array
            Object.keys(topLevelFields).forEach((topField) => {
                if (topField !== 'properties') { // Skip `properties` field itself
                    columns.push(`${topField} as ${camelToSnake(fixCamelCaseIssues(fixCamelCase(topField)))}`);
                    logger.debug(`Added top-level field ${topField} to columns.`);
                }
            });

            // Add `properties` fields to the columns array, converting to JSON extraction in SQL
            Object.keys(propertiesFields).forEach((propField) => {
                columns.push(`JSON_EXTRACT(properties, '$.${propField}') as ${camelToSnake(fixCamelCaseIssues(fixCamelCase(propField)))}`);
                logger.debug(`Added property field ${propField} to columns as JSON extraction.`);
            });

            // Create the SQL query template
            const selectQuery = `
SELECT
${columns.join(',\n')}
FROM ${providerName}.${serviceName}.${resourceName}
WHERE resourceGroupName = 'replace-me'
AND subscriptionId = 'replace-me';
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
                                ddl: selectQuery.replace('JSON_EXTRACT', 'json_extract_path_text').trim() // Handle Postgres JSON
                            }
                        }
                    }
                }
            };

            logger.info(`View ${newViewResourceName} created successfully for [${resourceName}].`);
        } else {
            logger.debug(`No top-level 'properties' field found for [${resourceName}]. Skipping view creation.`);
        }
    } else {
        logger.debug(`No select methods found for [${resourceName}]. Skipping...`);
    }
});

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
