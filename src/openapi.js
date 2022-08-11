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

    logger.info(`tagging ${specificationDir}...`);

    const inputDir = `${combinedDir}/${specificationDir}`;
    const outputDir = `${taggedDir}/${specificationDir}`;

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
    //cosmos-db
    
    for (const f of files) {
        const fileName = `${inputDir}/${f}`;
        debug ? logger.debug(`Processing ${fileName}`): null;

        inputDoc = await $RefParser.parse(fileName);

        outputDoc.openapi = inputDoc.openapi;
        outputDoc.servers = inputDoc.servers;
        outputDoc.info = inputDoc.info;
        outputDoc.security = inputDoc.security;
        outputDoc.components = inputDoc.components;

        Object.keys(inputDoc.paths).forEach(pathKey => {
            //debug ? logger.debug(`Processing path ${pathKey}`): null;
            Object.keys(inputDoc.paths[pathKey]).forEach(verbKey => {
                //debug ? logger.debug(`Processing operation ${pathKey}:${verbKey}`): null;
                if (operations.includes(verbKey)){
                    try {
                        //logger.info(`Processing operationId ${inputDoc.paths[pathKey][verbKey]['operationId']}`);
                        // clean up camel case before we convert to snake case in openapi-doc-util
                        
                        //inputDoc.paths[pathKey][verbKey]['operationId'].split('_')[1] ? null : console.log(inputDoc.paths[pathKey][verbKey]['operationId'].split('_')[0]);
                        
                        let resName = inputDoc.paths[pathKey][verbKey]['operationId'].split('_')[0]
                        .replace(/VCenters/g, 'Vcenters')
                        .replace(/HyperV/g, 'Hyperv')
                        .replace(/NetApp/g, 'Netapp')
                        .replace(/VCores/g, 'Vcores')
                        .replace(/MongoDB/g, 'Mongodb')
                        .replace(/VmSS/g, 'Vms')
                        .replace(/SaaS/g, 'Saas')
                        .replace(/vNet/g, 'Vnet')
                        .replace(/GitHub/g, 'Github')
                        .replace(/OAuth/g, 'Oauth')

                        .replace(/HCRP/g, 'Hcrp')
                        .replace(/MHSM/g, 'Mhsm')
                        .replace(/MSIX/g, 'Msix')
                        

                        
                        
                        .replace(/B2C/g, 'B2c')
                        .replace(/SAP/g, 'Sap')
                        .replace(/MIP/g, 'Mip')
                        .replace(/API/g, 'Api')
                        .replace(/EDM/g, 'Edm')
                        .replace(/SCC/g, 'Scc')
                        .replace(/HCI/g, 'Hci')
                        .replace(/WCF/g, 'Wcf')
                        .replace(/CRR/g, 'Crr')
                        .replace(/BMS/g, 'Bms')
                        .replace(/PIN/g, 'Pin')
                        .replace(/AFD/g, 'Afd')
                        .replace(/MAM/g, 'Mam')
                        

                        
                        
                        .replace(/VM/g, 'Vm')
                        .replace(/VM/g, 'Vm')
                        .replace(/OS/g, 'Os')
                        .replace(/AD/g, 'Ad')
                        .replace(/IP/g, 'Ip')
                        .replace(/ML/g, 'Ml')
                        .replace(/BI/g, 'Bi')
                        

                        .replace(/-/g, '_')
                        ;

                        //resName === 'generatevirtualwanvpnserverconfigurationvpnprofile' ? resName = 'generate_virtual_wan_vpn_server_configuration_vpn_profile' : null;

                        // AdCOperations
                        // AdCCatalogs

                        debug ? logger.debug(`Resource name ${resName}`): null;
                    } catch (e) {
                        if (e !== 'Break') throw e
                    }
                }
        
            });
        });
    }
}

export async function validate(spec) {
    return await $RefParser.parse(spec);
}
