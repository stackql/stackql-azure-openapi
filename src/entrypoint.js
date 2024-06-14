import { readdir } from 'fs/promises';
import { processSpecs, processSpec } from './autorest';
import { dereference } from './dereference';
import { combine } from './combine';
import { tag } from './tag';
import { validate } from './validate';
import { showUsage, parseArgumentsIntoOptions } from './usage.js';
import { ConsoleLogger } from '@autorest/common';
import yaml from 'js-yaml';
import * as fs from 'fs';
import { createOrCleanDir } from './shared-functions';

const logger = new ConsoleLogger();

// directory locations
const azureRestApiSpecsDir = 'azure-rest-api-specs';
const generatedDir = 'openapi/1-autorest-generated';
const derefedDir = 'openapi/2-dereferenced';
const combinedDir = 'openapi/3-combined';
const taggedDir = 'openapi/src';

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
    await dereference(generatedDir, derefedDir, options.specificationDir, options.debug, options.dryrun, options.prettyprint).finally(() => {
      logger.info(`dereferencing completed!`);
    });
  } else {
    // interate through all generated subdirs
    const subdirs = (await readdir(`${generatedDir}`, { withFileTypes: true })).filter(dirent => dirent.isDirectory());
    for (const subdir of subdirs){
      try {
        await dereference(generatedDir, derefedDir, subdir.name, options.debug, options.dryrun, options.prettyprint).finally(() => {
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
    // interate through all dereferenced subdirs
    const subdirs = (await readdir(`${derefedDir}`, { withFileTypes: true })).filter(dirent => dirent.isDirectory());
    
    for (const subdir of subdirs){
      try {
        await combine(derefedDir, combinedDir, subdir.name, options.debug, options.dryrun).finally(() => {
          logger.info(`finished combining!`);
        });
      } catch (err) {
        logger.error(err);
        continue;
      }
    }
  }
  return true;
}

async function openapiTag(options) {

  const providers = [
    'azure',
    'azure_extras',
    'azure_stack',
    'azure_isv'
  ];

  if (options.specificationDir){
    await tag(combinedDir, taggedDir, options.specificationDir, options.debug, options.dryrun).finally(() => {
      logger.info(`finished tagging!`);
    });
  } else {
    // interate through all combined subdirs

    providers.forEach(provider => {
      createOrCleanDir(`${taggedDir}/${provider}/v00.00.00000/services`, false, options.debug);
      fs.unlinkSync(`${taggedDir}/${provider}/v00.00.00000/provider.yaml`);
    });

    const allFilesAndDirs = await readdir(`${combinedDir}`, { withFileTypes: true });
    const subdirs = allFilesAndDirs.filter(dirent => dirent.isDirectory());

    for (const subdir of subdirs){
      logger.info(`Processing ${subdir.name}`);
      try {
        await tag(combinedDir, taggedDir, subdir.name, options.debug, options.dryrun).finally(() => {
          logger.info(`finished tagging!`);
        });
      } catch (err) {
        logger.error(err);
        continue;
      }
    }
  }

  // generate provider.yaml files
  for (const provider of providers){
    logger.info(`Processing ${provider}`);
    const providerServices = await readdir(`${taggedDir}/${provider}/v00.00.00000/services`, { withFileTypes: true });
    const serviceFiles = providerServices
      .filter(dirent => dirent.isFile() && dirent.name !== '.gitignore')
      .map(dirent => dirent.name);
    const providerYamlData = {
      id: provider,
      name: provider,
      version: 'v00.00.00000',
      config: {
        auth: {
          type: 'azure_default'
        }
      },
      providerServices: {}
    };
    for(const serviceFile in serviceFiles){
      logger.info(`Processing ${serviceFiles[serviceFile]}`);
      const serviceName = serviceFiles[serviceFile].split('.')[0];
      // read data from service file (its a yaml file)
      const serviceData = yaml.load(fs.readFileSync(`${taggedDir}/${provider}/v00.00.00000/services/${serviceFiles[serviceFile]}`));
      const serviceTitle = serviceData.info.title;
      const serviceDescription = serviceData.info.description;

      providerYamlData.providerServices[serviceName] = {
        id: `${provider}:${serviceName}`,
        name: serviceName,
        preferred: true,
        service: {
          $ref: `${provider}/v00.00.00000/services/${serviceFiles[serviceFile]}`
        },
        title: serviceTitle,
        version: 'v00.00.00000',
        description: serviceDescription
      }
    }
    // write provider.yaml
    fs.writeFileSync(`${taggedDir}/${provider}/v00.00.00000/provider.yaml`, yaml.dump(providerYamlData)); 

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
        case 'tag':
          await openapiTag(options).finally(() => {
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