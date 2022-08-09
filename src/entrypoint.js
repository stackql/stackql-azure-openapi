import { readdir } from 'fs/promises'
import { processSpecs, processSpec } from './autorest'
import { dereference, combine, validate } from './openapi'
import { showUsage, parseArgumentsIntoOptions } from './usage.js';

async function autorest(options) {
  if (options.specificationDir){
    const serviceName = options.specificationDir;
    const serviceRootDir = `azure-rest-api-specs/specification/${serviceName}`;
    await processSpec(
      serviceName, 
      `${serviceRootDir}/resource-manager/readme.md`, 
      `openapi/1-autorest-output/${serviceName}`, 
      options.debug, 
      options.dryrun);   
  } else {
    // interate through all specification subdirs
    const subdirs = (await readdir('azure-rest-api-specs/specification', { withFileTypes: true })).filter(dirent => dirent.isDirectory());
    for (const subdir of subdirs){
      try {
        if (subdir.name !== 'common-types' && subdir.name !== 'dynamicstelemetry') {
          // blows up the machine if you try to do this asynchronously...
          await processSpecs(subdir.name, { dryrun: options.dryrun, debug: options.debug });
        }
      } catch (err) {
        console.error(err);
        continue;
      }
    }
  }
  return true;
}


async function openapiDereference(options) {
  if (options.specificationDir){
    await dereference(options.specificationDir, options.debug, options.dryrun);
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
            console.error(err);
            process.exit(1);
          });
          break;
        case 'dereference':
          await openapiDereference(options).finally(() => {
            process.exit(0);
          }).catch(err => {
            console.error(err);
            process.exit(1);
          });
          break;
        case 'combine':
            //
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