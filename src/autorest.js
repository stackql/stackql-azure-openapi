import * as fs from "fs";
import * as path from "path";
import { RealFileSystem } from '@azure-tools/datastore';
import { ConsoleLogger } from '@autorest/common';
import { AutoRest } from '@autorest/core';
import { resolveUri, 
         createFolderUri,
} from '@azure-tools/uri';
import { ArtifactWriter } from "./lib/artifact-writer";
import { 
    createOrCleanDir,
    servicesToSkip 
} from './shared-functions';

const logger = new ConsoleLogger();

const resolveAppRoot = () => {
    let current = path.resolve(__dirname);
    while (!fs.existsSync(path.join(current, "package.json"))) {
        current = path.dirname(current);
    }
    return current;
};

function printCompleteSummary(logger, artifactWriter) {
    const runtime = Math.round(process.uptime() * 100) / 100;
    logger.info(`Autorest completed in ${runtime}s. ${artifactWriter.stats.writeCompleted} files generated.`);
}

export async function processSpecs(azureRestApiSpecsDir, generatedDir, dirName, options) {

    if (!fs.existsSync(`${azureRestApiSpecsDir}/specification/${dirName}/resource-manager`)) {
        return;
    }

    const serviceRootDir = `${azureRestApiSpecsDir}/specification/${dirName}`;

    if (fs.existsSync(`${serviceRootDir}/resource-manager/readme.md`)) {
        logger.info(`reading config at ${serviceRootDir}/resource-manager/readme.md.`);
        await processSpec(
            dirName, 
            `${serviceRootDir}/resource-manager/readme.md`, 
            `${generatedDir}/${dirName}`, 
            options.debug, 
            options.dryrun);
    } else {
        const subdirs = fs.readdirSync(`${serviceRootDir}/resource-manager`, { withFileTypes: true })
                          .filter(dirent => dirent.isDirectory());
        
        for (const subdir of subdirs) {
            if (fs.existsSync(`${serviceRootDir}/resource-manager/${subdir.name}/readme.md`)) {
                logger.info(`reading config at ${serviceRootDir}/resource-manager/${subdir.name}/readme.md.`);
                await processSpec(
                    `${dirName}_${subdir.name}`, 
                    `${serviceRootDir}/resource-manager/${subdir.name}/readme.md`, 
                    `${generatedDir}/${dirName}_${subdir.name}`, 
                    options.debug, 
                    options.dryrun);
            } else {
                logger.info(`no config found in ${serviceRootDir}/resource-manager/${subdir.name}. going one level below...`);

                // Going one level deeper
                const deeperSubdirs = fs.readdirSync(`${serviceRootDir}/resource-manager/${subdir.name}`, { withFileTypes: true })
                                        .filter(dirent => dirent.isDirectory());

                for (const deeperSubdir of deeperSubdirs) {
                    if (fs.existsSync(`${serviceRootDir}/resource-manager/${subdir.name}/${deeperSubdir.name}/readme.md`)) {
                        logger.info(`reading config at ${serviceRootDir}/resource-manager/${subdir.name}/${deeperSubdir.name}/readme.md.`);
                        await processSpec(
                            `${dirName}_${subdir.name}_${deeperSubdir.name}`, 
                            `${serviceRootDir}/resource-manager/${subdir.name}/${deeperSubdir.name}/readme.md`, 
                            `${generatedDir}/${dirName}_${subdir.name}_${deeperSubdir.name}`, 
                            options.debug, 
                            options.dryrun);
                    }
                }
            }
        }
    }
}

export async function processSpec(serviceName, configFile, outputFolder, debug, dryrun) {
    
    logger.info(`processing ${serviceName}...`);

    createOrCleanDir(outputFolder, true, debug);

    const AppRoot = resolveAppRoot();
    const f = new RealFileSystem();
    const autorest = new AutoRest(
        logger,
        f,
        resolveUri(createFolderUri(AppRoot), configFile),
    );

    autorest.AddConfiguration({ "azure-arm": true });
    autorest.AddConfiguration({ "output-converted-oai3": true });
    autorest.AddConfiguration({ "include-x-ms-examples-original-file": false });
    autorest.AddConfiguration({ "openapi-type": "arm" });
    autorest.AddConfiguration({ "output-folder": `${createFolderUri(AppRoot)}${outputFolder}` });
    autorest.AddConfiguration({ "verbose": debug });
    autorest.AddConfiguration({ "debug": debug });
    autorest.AddConfiguration({ "allow-no-input": dryrun });
    autorest.AddConfiguration({ "level": "error" });
    autorest.AddConfiguration({ "skip-semantics-validation": true });
    autorest.AddConfiguration({ "model-validator": false });

    if (serviceName === 'machinelearning'){
        autorest.AddConfiguration({ "tag": "package-webservices-2017-01" });
    }
    
    // Skip processing for specified services
    if (servicesToSkip.includes(serviceName)) {
        logger.info(`Skipping ${serviceName}...`);
        return;
    }
    
    const context = await autorest.view;
    const cfg = context.config;
    const artifactWriter = new ArtifactWriter(cfg);
  
    // listen for output messages and file writes
    let artifacts = [];
    autorest.GeneratedFile.Subscribe((_, artifact) => {
        if (context.config.help) {
            artifacts.push(artifact);
            return;
        }
        artifactWriter.writeArtifact(artifact);
    });

    const result = await autorest.Process().finish;
    if (result !== true) {
        throw result;
    }

    // perform file system operations.

    // clear folders here if you want...

    if (dryrun){
        logger.info("No output, dryrun mode selected.");
    } else {
        logger.info("Writing outputs.");
        await artifactWriter.wait();
    }
  
    printCompleteSummary(logger, artifactWriter);
    return 0;
    
 }