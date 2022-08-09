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

export async function dereference(serviceName, debug, dryrun) {
    const startTime = new Date();

    logger.info(`dereferencing ${serviceName}`);

    const inputDir = `openapi/1-autorest-output/${serviceName}`;

    const outputDir = `openapi/2-staging/${serviceName}`;

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
    for (const file of files){
        try {
            logger.debug(`dereferencing ${file.name}...`);
            logger.debug(`input path : ${file.path}`);
            const outputFileName = `${uuidv4()}.yaml`
            const outputFilePath = `${outputDir}/${outputFileName}`;
            logger.debug(`output path : ${outputFilePath}`);
            let schema = await $RefParser.dereference(file.path);
            if (dryrun) {
                logger.info('No output, dryrun mode selected.')
                continue;
            }
            logger.info(`writing ${outputFileName}...`);
            fs.writeFileSync(outputFilePath, yaml.dump(schema, {lineWidth: -1, noRefs: true}));
            

            //dryrun ? logger.info('No output, dryrun mode selected.') : fs.writeFileSync(outputFilePath, yaml.dump(schema, {lineWidth: -1, noRefs: true}));

            // const parser = new $RefParser();
            // const dereferenced = await parser.dereference(inputFile, { logger });
            // const dereferencedYaml = yaml.safeDump(dereferenced);
            // outputFile.write(dereferencedYaml);
            // outputFile.end();
            debug ? logger.debug(`dereferenced ${filePath}`) : null;
        } catch (err) {
            logger.error(err);
            continue;
        }
    };    

    // const files = await getAllFiles(inputDir).finally(() => {
    //     logger.info(JSON.stringify(files));
    //     logger.info(`dereferencing ${serviceName} completed in ${Math.round((new Date()).getTime() - startTime.getTime()) / 1000}s`);
    // });

    

    
    
    
    
    
    // .finally(files => {
    //     for (const file of files) {
    //         debug ? logger.debug(`dereferencing ${file}`) : null;
    //         // const contents = fs.readFileSync(file, 'utf8');
    //         // const parsed = yaml.safeLoad(contents);
    //         // const dereferenced = $RefParser.dereference(parsed);
    //         // const outputFile = file.replace(inputDir, outputDir);
    //         // fs.writeFileSync(outputFile, yaml.safeDump(dereferenced));
    //     }
    // });


    // output to uuid-named files in outputDir



    // const dirs = fs.readdirSync(inputDir);
    // for (const d of dirs) {
    //     const childObj = `${inputDir}/${d}`;
    //     const commonJsonPath = `${childObj}/common.json`;
    //     debug ? logger.debug(`looking for ${commonJsonPath}`) : null;
    //     if (fs.existsSync(commonJsonPath)) {
    //         // its a dir, process contents
    //         for (sd of fs.readdirSync(childObj)) {
    //             //if sd is not a directory skip it
    //             if (!fs.lstatSync(`${childObj}/${sd}`).isDirectory()) {
    //                 continue;
    //             }
    //             const subDir = `${childObj}/${sd}`;
    //             for (f of fs.readdirSync(subDir)) {
    //                 const fileName = f.split(".json")[0];
    //                 const filePath = `${subDir}/${f}`;
    //                 console.log(`Processing ${filePath}`);
    //                 let schema = await $RefParser.dereference(filePath);
    //                 dryrun ? logger.info('No output, dryrun mode selected.') : fs.writeFileSync(`${outputDir}/${fileName}.yaml`, yaml.dump(schema, {lineWidth: -1, noRefs: true}));
    //             }
    //         }
    //     } else {
    //         debug ? logger.debug(`common.json not found, processing files in ${childObj}`) : null;
    //         // its files, process the
    //         for (f of fs.readdirSync(childObj)) {
    //             const fileName = f.split(".json")[0];
    //             const filePath = `${childObj}/${f}`;
    //             debug ? logger.debug(`Processing ${filePath}`) : null;
    //             let schema = await $RefParser.dereference(filePath);
    //             dryrun ? logger.info('No output, dryrun mode selected.') : fs.writeFileSync(`${outputDir}/${fileName}.yaml`, yaml.dump(schema, {lineWidth: -1, noRefs: true}));
    //         }
    //     }
    // }
    // const endTime = new Date();
    // const runtime = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
    // logger.info(`dereferencing ${serviceName} completed in ${runtime}s`);
}

export async function combine(inputDir, outputDir) {
    const files = fs.readdirSync(inputDir);
    let outputDoc = {};
    let inputDoc = {};
    let schemas = {};
    let parameters = {};
    let paths = {};
    for (const f of files) {
        const fileName = `${inputDir}/${f}`;
        console.log(`Processing ${fileName}`);
        inputDoc = await $RefParser.parse(fileName);
        schemas = {
            ...schemas,
            ...inputDoc.components.schemas
        };
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
    outputDoc.servers = inputDoc.servers;
    outputDoc.openapi = inputDoc.openapi;
    outputDoc.info = inputDoc.info;
    outputDoc.security = inputDoc.security;
    outputDoc.components = {};
    outputDoc.components.securitySchemes = inputDoc.components.securitySchemes;
    outputDoc.components.schemas = schemas;
    outputDoc.components.parameters = parameters;
    outputDoc.paths = paths;

    fs.writeFileSync(`${outputDir}/compute.yaml`, yaml.dump(outputDoc, {lineWidth: -1, noRefs: true}));
}


export async function validate(spec) {
    return await $RefParser.parse(spec);
}
