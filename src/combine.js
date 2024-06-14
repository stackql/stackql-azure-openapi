import $RefParser from '@apidevtools/json-schema-ref-parser';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { ConsoleLogger } from '@autorest/common';
import { createOrCleanDir } from './shared-functions';

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

        // print list of files
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
    
            // get version
            let apiVersion = inputDoc.info.version;

            debug ? logger.debug(`  ${f} - ${apiVersion}`) : null;
    
            
            // schemas
            schemas = {
                ...schemas,
                ...(inputDoc.components && inputDoc.components.schemas ? inputDoc.components.schemas : {})
              };

            // parameters
            parameters = {
                ...parameters,
                ...(inputDoc.components && inputDoc.components.parameters ? inputDoc.components.parameters : {})
            };
            
            // clean paths x-ms-examples
            let cleanPaths = {};
            Object.keys(inputDoc.paths).forEach(pathKey => {
                cleanPaths[pathKey] = {};
                // add version tag
                cleanPaths[pathKey]['x-api-version'] = apiVersion;            
                Object.keys(inputDoc.paths[pathKey]).forEach(verbKey => {
                    cleanPaths[pathKey][verbKey] = {};
                    if (verbKey === 'parameters'){
                        // path params
                        cleanPaths[pathKey]['parameters'] = inputDoc.paths[pathKey].parameters;
                    } else {
                        // normal verb
                        Object.keys(inputDoc.paths[pathKey][verbKey]).forEach(itemKey => {
                            if (itemKey != "x-ms-examples") {
                                cleanPaths[pathKey][verbKey][itemKey] = inputDoc.paths[pathKey][verbKey][itemKey];
                            }
                        });
                    }
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

    } catch (err) {
        logger.error(err);
        return;
    }
}