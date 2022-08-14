import * as fs from 'fs';
import * as path from 'path';
import { ConsoleLogger } from '@autorest/common';

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

export function createOrCleanDir(dir, debug){
    if (!fs.existsSync(dir)){
        debug ? logger.debug(`creating ${dir}...`): null;
        fs.mkdirSync(dir);
    } else {
        // delete all files in dir
        debug ? logger.debug(`${dir} exists, cleaning...`): null;
        const files = getFiles(dir);
        for (let file of files){
            fs.unlinkSync(file.path);
        }
    }
}