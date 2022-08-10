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

export async function dereference(generatedDir, derefedDir, serviceName, debug, dryrun) {
    const startTime = new Date();
    logger.info(`dereferencing ${serviceName}`);
    const inputDir = `${generatedDir}/${serviceName}`;
    const outputDir = `${derefedDir}/${serviceName}`;

    if (!fs.existsSync(outputDir)){
        logger.debug(`creating ${outputDir}...`);
        fs.mkdirSync(outputDir);
    } else {
        // delete all file in outputDir
        logger.debug(`${outputDir} exists, cleaning...`);
        const files = getFiles(outputDir);
        for (let file of files){
            fs.unlinkSync(file.path);
        }
    }

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

export async function combine(derefedDir, outputDir, specificationDir, debug, dryrun) {
    
    const inputDir = `${derefedDir}/${specificationDir}`;
    const files = fs.readdirSync(inputDir);
    let outputDoc = {};
    let inputDoc = {};

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
        console.log(`Processing ${fileName}`);
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

    fs.writeFileSync(`${outputDir}/${specificationDir}.yaml`, yaml.dump(outputDoc, {lineWidth: -1, noRefs: true}));
}


export async function validate(spec) {
    return await $RefParser.parse(spec);
}
