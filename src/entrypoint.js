import { readdir } from 'fs/promises'
import { processSpecs } from './autorest'

export async function main() {

  const subdirs = (await readdir('azure-rest-api-specs/specification', { withFileTypes: true })).filter(dirent => dirent.isDirectory());
  for (const subdir of subdirs){
    try {
      if (subdir.name !== 'common-types') {
        // blows up the machine if you try to do this asynchronously...
        await processSpecs(subdir.name, false, false);
      }
    } catch (err) {
      console.error(err);
      continue;
    }
  }
}

