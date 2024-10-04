import $RefParser from '@apidevtools/json-schema-ref-parser';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { ConsoleLogger } from '@autorest/common';
import { createOrCleanDir } from './includes/shared-functions.js';

const logger = new ConsoleLogger();

export async function combine(derefedDir, combinedDir, specificationDir, debug, dryrun) {
    
    logger.info(`combining ${specificationDir}...`);

    const inputDir = `${derefedDir}/${specificationDir}`;
    const outputDir = `${combinedDir}/${specificationDir}`;

    try {
        const files = fs.readdirSync(inputDir);
        let outputDoc = {};
        let inputDoc = {};
    
        createOrCleanDir(outputDir, false, debug);
    
        // Statically defined properties, shouldn't change between services
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

        // Print list of files
        logger.info(`found ${files.length} files:`);

        for (const f of files) {
            const fileName = `${inputDir}/${f}`;
            logger.info(`Processing ${fileName}`);
            inputDoc = await $RefParser.parse(fileName);

            // info
            if (!info.title){
                if (!inputDoc['x-ms-secondary-file']){
                    info = inputDoc.info;
                }
            }
    
            // Get version
            let apiVersion = inputDoc.info.version;

            debug ? logger.debug(`  ${f} - ${apiVersion}`) : null;
            
            // schemas
            schemas = {
                ...schemas,
                ...(inputDoc.components && inputDoc.components.schemas ? inputDoc.components.schemas : {})
            };

            // parameters - process global components parameters
            parameters = {
                ...parameters,
                ...(inputDoc.components && inputDoc.components.parameters ? processParameters(inputDoc.components.parameters) : {})
            };
            
            // Clean paths and adjust api-version parameter
            let cleanPaths = {};
            Object.keys(inputDoc.paths).forEach(pathKey => {
                cleanPaths[pathKey] = {};
                cleanPaths[pathKey]['x-api-version'] = apiVersion;
                Object.keys(inputDoc.paths[pathKey]).forEach(verbKey => {
                    cleanPaths[pathKey][verbKey] = {};
                    if (verbKey === 'parameters') {
                        // Process parameters in the path
                        cleanPaths[pathKey]['parameters'] = processParameters(inputDoc.paths[pathKey].parameters);
                    } else {
                        // Process each verb
                        cleanPaths[pathKey][verbKey] = {};
                        Object.keys(inputDoc.paths[pathKey][verbKey]).forEach(itemKey => {
                            if (itemKey !== 'x-ms-examples') {
                                cleanPaths[pathKey][verbKey][itemKey] = inputDoc.paths[pathKey][verbKey][itemKey];
                            }
                        });
                        // Process parameters in the verb itself
                        if (inputDoc.paths[pathKey][verbKey].parameters) {
                            cleanPaths[pathKey][verbKey].parameters = processParameters(inputDoc.paths[pathKey][verbKey].parameters);
                        }
                    }
                });
            });
    
            paths = {
                ...paths,
                ...cleanPaths
            };
        }

        // Combine output document
        outputDoc.openapi = openapi;
        outputDoc.servers = servers;
        outputDoc.info = info;
        outputDoc.security = security;
        outputDoc.components = {};
        outputDoc.components.securitySchemes = securitySchemes;
        outputDoc.components.schemas = schemas;
        outputDoc.components.parameters = parameters;
        outputDoc.paths = paths;
    
        if (dryrun) {
            logger.info(`dryrun specified, no output written`);
        } else {
            logger.info(`writing ${outputDir}/${specificationDir}.yaml...`);
            fs.writeFileSync(`${outputDir}/${specificationDir}.yaml`, yaml.dump(outputDoc, { lineWidth: -1, noRefs: true }));
            logger.info(`${outputDir}/${specificationDir}.yaml written successfully`);
        }
        logger.info(`${specificationDir} finished processing`);

    } catch (err) {
        logger.error(err);
        return;
    }
}

// Function to process parameters and adjust 'api-version' required flag
function processParameters(parameters) {
    // logger.info(`Processing parameters: ${JSON.stringify(parameters)}...`);
    
    // Iterate over the object properties
    for (const key in parameters) {
        if (parameters.hasOwnProperty(key)) {
            const param = parameters[key];
            // Check if it's the 'api-version' query parameter
            if (param.name === 'api-version' && param.in === 'query' && param.required) {
                logger.info(`Found 'api-version' parameter, setting required to false`);
                param.required = false;  // Modify the parameter directly
            }
        }
    }
    
    return parameters;  // Return the modified parameters object
}

