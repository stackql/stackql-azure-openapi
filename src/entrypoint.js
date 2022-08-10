import { readdir } from 'fs/promises'
import { processSpecs, processSpec } from './autorest'
import { dereference, combine, validate } from './openapi'
import { showUsage, parseArgumentsIntoOptions } from './usage.js';
import { ConsoleLogger } from '@autorest/common';

const logger = new ConsoleLogger();

// directory locations
const azureRestApiSpecsDir = 'azure-rest-api-specs';
const generatedDir = 'openapi/1-autorest-generated';
const derefedDir = 'openapi/2-dereferenced';
const combinedDir = 'openapi/3-combined';

async function autorest(options) {
  if (options.specificationDir){
    const serviceName = options.specificationDir;
    const serviceRootDir = `${azureRestApiSpecsDir}/specification/${serviceName}`;
    await processSpec(
      serviceName, 
      `${serviceRootDir}/resource-manager/readme.md`, 
      `${generatedDir}/${serviceName}`, 
      options.debug, 
      options.dryrun);   
  } else {
    // interate through all specification subdirs
    const subdirs = (await readdir(`${azureRestApiSpecsDir}/specification`, { withFileTypes: true })).filter(dirent => dirent.isDirectory());
    for (const subdir of subdirs){
      try {
        if (subdir.name !== 'common-types' && subdir.name !== 'dynamicstelemetry') {
          // blows up the machine if you try to do this asynchronously...
          await processSpecs(azureRestApiSpecsDir, generatedDir, subdir.name, { dryrun: options.dryrun, debug: options.debug });
        }
      } catch (err) {
        logger.error(err);
        continue;
      }
    }
  }
  return true;
}

async function openapiDereference(options) {
  if (options.specificationDir){
    await dereference(generatedDir, derefedDir, options.specificationDir, options.debug, options.dryrun).finally(() => {
      logger.info(`dereferencing completed!`);
    });
  } else {
    // interate through all generated subdirs
    const subdirs = (await readdir(`${generatedDir}`, { withFileTypes: true })).filter(dirent => dirent.isDirectory());
    for (const subdir of subdirs){
      try {
        await dereference(generatedDir, derefedDir, subdir.name, options.debug, options.dryrun).finally(() => {
          logger.info(`dereferencing completed!`);
        });
      } catch (err) {
        logger.error(err);
        continue;
      }
    }
  }
  return true;
}

async function openapiCombine(options) {
  if (options.specificationDir){
    await combine(derefedDir, combinedDir, options.specificationDir, options.debug, options.dryrun).finally(() => {
      logger.info(`finished combining!`);
    });
  } else {
    // interate through all specification subdirs

  }
  return true;
}


export async function main(args) {

  const options = parseArgumentsIntoOptions(args);
  const command = options.command || false;

  if (!command){
    showUsage('unknown');
    return
  } else {
    switch(command) {
        case 'generate':
          await autorest(options).finally(() => {
            process.exit(0);
          }).catch(err => {
            logger.error(err);
            process.exit(1);
          });
          break;
        case 'dereference':
          await openapiDereference(options).finally(() => {
            process.exit(0);
          }).catch(err => {
            logger.error(err);
            process.exit(1);
          });
          break;
        case 'combine':
          await openapiCombine(options).finally(() => {
            process.exit(0);
          }).catch(err => {
            logger.error(err);
            process.exit(1);
          });
          break;
        case 'validate':
            //
            break; 
        default:
            showUsage('unknown');
            break;
    };
  };
}