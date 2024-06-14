import * as fs from 'fs';
import { ConsoleLogger } from '@autorest/common';

const logger = new ConsoleLogger();

export function createOrCleanDir(dir, cleanOnly, debug) {

    function cleanDir(dir, debug){
        debug ? logger.debug(`${dir} exists, cleaning...`): null;
        fs.rmdirSync(dir, { recursive: true, force: true });
    }

    function createDir(dir, debug){
        debug ? logger.debug(`Creating ${dir}...`): null;
        fs.mkdirSync(dir, { recursive: true });
    }

    if(cleanOnly){
        if (fs.existsSync(dir)) {
            cleanDir(dir, debug);
        }
    } else {
        if (fs.existsSync(dir)) {
            cleanDir(dir, debug);
        }
        createDir(dir, debug);
    }

}

export const servicesToSkip = [
    'chaos',
    'policyinsights', 
    'resourcehealth',
    'iotspaces',
];