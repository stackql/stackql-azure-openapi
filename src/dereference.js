import $RefParser from '@apidevtools/json-schema-ref-parser';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ConsoleLogger } from '@autorest/common';
import { createOrCleanDir } from './shared-functions';

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

function replaceAllRefs(obj) {
    for (let k in obj) {
        if (typeof obj[k] === "object") {
            replaceAllRefs(obj[k])
        } else {
            if (k === "$ref"){
                obj[k] = "#" + obj[k].split("#")[1];
            }
        }
    }
    return obj;
}  

export async function dereference(generatedDir, derefedDir, serviceName, debug, dryrun, prettyprint) {
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
        //let schema = await $RefParser.bundle(files[i].path);
        let schema = await $RefParser.parse(files[i].path);
        schema = replaceAllRefs(schema);
        if (dryrun){
            logger.info(`dryrun specified, no output written`);
        } else {
            prettyprint ? fs.writeFileSync(outputFilePath, JSON.stringify(schema, null, 2)) : fs.writeFileSync(outputFilePath, JSON.stringify(schema)); 
            logger.info(`${outputFilePath} written`);
        }
        debug ? logger.debug(`processed element ${i+1} of ${files.length}`): null;
    };    
    logger.info(`dereferencing ${serviceName} completed in ${new Date().getTime() - startTime.getTime()}ms`);
}