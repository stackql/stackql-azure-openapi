import * as fs from "fs";
import * as path from "path";
import { RealFileSystem } from '@azure-tools/datastore';
import { ConsoleLogger } from '@autorest/common';
import { AutoRest } from '@autorest/core';
import { resolveUri, 
         createFolderUri,
         clearFolder,
} from '@azure-tools/uri';
import { ArtifactWriter } from "./lib/artifact-writer";

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

export async function processSpecs(dirName, options) {

    if (!fs.existsSync(`azure-rest-api-specs/specification/${dirName}/resource-manager`)) {
        return;
    }

    const serviceRootDir = `azure-rest-api-specs/specification/${dirName}`;
  
    if (fs.existsSync(`${serviceRootDir}/resource-manager/readme.md`)) {
        await processSpec(
            dirName, 
            `${serviceRootDir}/resource-manager/readme.md`, 
            `openapi/1-autorest-output/${dirName}`, 
            options.debug, 
            options.dryrun);
    } else {
        // readme not found, recurse subdirectories
        const subdirs = fs.readdirSync(`azure-rest-api-specs/specification/${dirName}/resource-manager`, { withFileTypes: true }).filter(dirent => dirent.isDirectory());
        for (const subdir of subdirs) {
            await processSpec(
                `${dirName}_${subdir.name}`, 
                `${serviceRootDir}/resource-manager/${subdir.name}/readme.md`, 
                `openapi/1-autorest-output/${dirName}_${subdir.name}`, 
                options.debug, 
                options.dryrun);
        }
    }
}

export async function processSpec(serviceName, configFile, outputFolder, debug, dryrun) {
    
    console.log(`processing ${serviceName}...`);

    const AppRoot = resolveAppRoot();
    const f = new RealFileSystem();
    const logger = new ConsoleLogger();
    const autorest = new AutoRest(
        logger,
        f,
        resolveUri(createFolderUri(AppRoot), configFile),
    );

    autorest.AddConfiguration({ "azure-arm": true });
    autorest.AddConfiguration({ "output-converted-oai3": true });
    autorest.AddConfiguration({ "include-x-ms-examples-original-file": false });
    autorest.AddConfiguration({ "openapi-type": "arm" });
    autorest.AddConfiguration({ "output-folder": `${createFolderUri(AppRoot)}/${outputFolder}` });
    autorest.AddConfiguration({ "verbose": debug });
    autorest.AddConfiguration({ "debug": debug });
    autorest.AddConfiguration({ "allow-no-input": dryrun });
    autorest.AddConfiguration({ "level": "error" });
    autorest.AddConfiguration({ "skip-semantics-validation": true });
    autorest.AddConfiguration({ "model-validator": false });
    //autorest.AddConfiguration({ "stats": true });
    
    const context = await autorest.view;
    const cfg = context.config;
    const artifactWriter = new ArtifactWriter(cfg);
    //console.log(cfg);

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
    // return the exit code to the caller.
    return 0;
    
 }