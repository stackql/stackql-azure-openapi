const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Function to generate the service info object
const generateServiceInfo = (openapidir) => {
    const serviceInfo = {};

    // Read all subdirectories in the openapidir
    const subDirs = fs.readdirSync(openapidir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    subDirs.forEach(dir => {
        const yamlPath = path.join(openapidir, dir, dir + '.yaml');

        // Check if the YAML file exists
        if (fs.existsSync(yamlPath)) {
            // Read and parse the YAML file
            const fileContents = fs.readFileSync(yamlPath, 'utf8');
            const data = yaml.load(fileContents);

            // Extract info and construct the service info object
            serviceInfo[dir] = {
                provider: 'azure',
                service: dir,
                title: data.info.title,
                description: data.info.description
            };
        }
    });

    return serviceInfo;
};

const openapidir = 'openapi/3-combined';
const result = generateServiceInfo(openapidir);
console.log(result);
