const fs = require('fs');
const $RefParser = require('@apidevtools/json-schema-ref-parser');

// Take the Swagger file path from the command line arguments
const SWAGGER_FILE_PATH = process.argv[2];

if (!SWAGGER_FILE_PATH) {
  console.error('Please provide the path to the Swagger file as a command line argument.');
  process.exit(1);
}

async function checkRefs(obj, path = '') {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // If we find a $ref, we log it and attempt to parse the reference
      if (key === '$ref') {
        console.log(`Found $ref at ${path}: ${obj[key]}`);
        try {
          // Here we attempt to resolve the reference
          let resolved = await $RefParser.resolve(obj[key]);
          console.log(`Resolved $ref at ${path}: ${obj[key]}`);
          // Recursively check for refs within the resolved object
          await checkRefs(resolved, path + obj[key]);
        } catch (err) {
          console.error(`Error resolving $ref at ${path}: ${obj[key]}`, err);
        }
      } else {
        // Recursively check for nested refs
        await checkRefs(obj[key], path + '/' + key);
      }
    }
  }
}

async function testSwaggerRefs(swaggerFilePath) {
  try {
    // Parse the Swagger file without dereferencing
    let swagger = await $RefParser.parse(swaggerFilePath);

    // Start checking for refs recursively within the parsed object. You can start at the paths object,
    // as it's likely where most references will be.
    if (swagger.paths) {
      await checkRefs(swagger.paths, '#/paths');
    }

    console.log('Finished checking all $refs.');
  } catch (err) {
    console.error('Error parsing Swagger file:', err);
    process.exit(1);
  }
}

// Run the function with the Swagger file path provided as a command-line argument
testSwaggerRefs(SWAGGER_FILE_PATH);