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

async function doClearFolders(protectFiles, clearFolders, logger) {
    let cleared = false; // set to true to disable
    if (!cleared) {
        logger.info("Clearing Folders.");
        cleared = true;
        for (const folder of clearFolders) {
            try {
                await clearFolder(
                folder,
                [...protectFiles].map((each) => resolveUri(folder, each)),
                );
            } catch {
                // no worries
            }
        }
    }
}

function printCompleteSummary(logger, artifactWriter) {
    const runtime = Math.round(process.uptime() * 100) / 100;
    logger.info(`Autorest completed in ${runtime}s. ${artifactWriter.stats.writeCompleted} files generated.`);
}

export async function processSpecs(dirName, verbose, debug) {
    let configFile = `azure-rest-api-specs/specification/${dirName}/resource-manager/readme.md`;
    let serviceName = dirName;    
    let outputFolder = `openapi/1-autorest-output/${serviceName}`;

    if (fs.existsSync(configFile)) {
        await processSpec(serviceName, configFile, outputFolder, verbose, debug);
    } else {
        fs.writeFileSync(outputFolder, "");
        //C:\Users\javen\Dropbox\GitRepositories\stackql\stackql-azure-openapi\openapi\1-autorest-output\azsadmin
    }
}

async function processSpec(serviceName, configFile, outputFolder, verbose, debug) {
    
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
    autorest.AddConfiguration({ "output-folder": `${createFolderUri(AppRoot)}/${outputFolder}` });
    autorest.AddConfiguration({ "verbose": verbose });
    autorest.AddConfiguration({ "debug": debug });
    autorest.AddConfiguration({ "level": "error" });
    
    //autorest.AddConfiguration({ "stats": true });
    autorest.AddConfiguration({ "disable-validation": true });

    const context = await autorest.view;
    const cfg = context.config;
    const artifactWriter = new ArtifactWriter(cfg);
    //console.log(cfg);

    // listen for output messages and file writes
    let artifacts = [];
    let clearFolders = new Set();
    let protectFiles = new Set();
    autorest.GeneratedFile.Subscribe((_, artifact) => {
        if (context.config.help) {
            artifacts.push(artifact);
            return;
        }
        protectFiles.add(artifact.uri);
        artifactWriter.writeArtifact(artifact);
    });
    autorest.ProtectFile.Subscribe((_, filename) => {
        protectFiles.add(filename);
    });
    autorest.ClearFolder.Subscribe((_, folder) => clearFolders.add(folder));

    const result = await autorest.Process().finish;
    if (result !== true) {
        throw result;
    }

    // perform file system operations.
    await doClearFolders(protectFiles, clearFolders, logger);

    logger.info("Writing Outputs.");
    await artifactWriter.wait();
  
    printCompleteSummary(logger, artifactWriter);
    // return the exit code to the caller.
    return 0;
    
 }