import $RefParser from "@apidevtools/json-schema-ref-parser";
import * as fs from "fs";
import * as yaml from "js-yaml";

export async function defererence(inputDir, outputDir) {
    const dirs = fs.readdirSync(inputDir);
    for (const d of dirs) {
        const childObj = `${inputDir}/${d}`;
        const commonJsonPath = `${childObj}/common.json`;
        if (fs.existsSync(commonJsonPath)) {
            // its a dir, process contents
            for (sd of fs.readdirSync(childObj)) {
                //if sd is not a directory skip it
                if (!fs.lstatSync(`${childObj}/${sd}`).isDirectory()) {
                    continue;
                }
                const subDir = `${childObj}/${sd}`;
                for (f of fs.readdirSync(subDir)) {
                    const fileName = f.split(".json")[0];
                    const filePath = `${subDir}/${f}`;
                    console.log(`Processing ${filePath}`);
                    let schema = await $RefParser.dereference(filePath);
                    fs.writeFileSync(`${outputDir}/${fileName}.yaml`, yaml.dump(schema, {lineWidth: -1, noRefs: true}));
                }
            }
        } else {
            // its files, process the
            for (f of fs.readdirSync(childObj)) {
                const fileName = f.split(".json")[0];
                const filePath = `${childObj}/${f}`;
                console.log(`Processing ${filePath}`);
                let schema = await $RefParser.dereference(filePath);
                fs.writeFileSync(`${outputDir}/${fileName}.yaml`, yaml.dump(schema, {lineWidth: -1, noRefs: true}));
            }
        }
    }
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
