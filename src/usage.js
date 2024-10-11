// const arg = require('arg');
// const commandLineUsage = require('command-line-usage');
import arg from 'arg';
import commandLineUsage from 'command-line-usage';

const programName = 'stackql-azure-openapi';

const generateDesc = 'Uses autorest to generate latest OpenAPI3 specs for an Azure RM service or services.';
const dereferenceDesc = 'Uses the output from the generate command to create intermediate dereferenced OpenAPI schemas (removing all JSON pointers) for an Azure RM service or services.';
const combineDesc = 'Uses the output from the dereference command to create a single OpenAPI3 yaml document for an Azure RM service or services.';
const validateDesc = 'Validates an OpenAPI3 document.';
const tagDesc = 'Tags an OpenAPI3 document with the appropriate stackql resource name.';
const docDesc = 'Generates docusaurus markdown docs for the stackql provider.';

const debugDesc = '[OPTIONAL] Debug flag. (defaults to false)';
const dryrunDesc = '[OPTIONAL] Dry run flag. (defaults to false)';
const prettyprintDesc = '[OPTIONAL] Pretty print flag for JSON output. (defaults to false)';

const cmdUsage = [
  {
    header: programName,
    content: 'OpenAPI utility for developing stackql provider interfaces from Azure Resource Manager specifications.'
  },
  {
    header: 'Synopsis',
    content: `$ ${programName} <command> [<specificationDir>] [<options>]`
  },
  {
    header: 'Command List',
    content: [
      { name: 'generate', summary: generateDesc },
      { name: 'dereference', summary: dereferenceDesc },       
      { name: 'combine', summary: combineDesc },
      { name: 'tag', summary: tagDesc },      
      { name: 'validate', summary: validateDesc },
    ]
  },
];

const generateUsage = [
  {
    header: `${programName} generate`,
    content: generateDesc
  },
  {
    header: 'Synopsis',
    content: `$ ${programName} generate [<specificationDir>] [<flags>]`
  },
  {
    header: 'Arguments',
    content: [
      { name: 'specificationDir', summary: '[OPTIONAL] Specify a single directory containing and autorest configuration document' },
    ]
  },
  {
      header: 'Flags',
      optionList: [
        {
          name: 'debug',
          alias: 'd',
          type: Boolean,
          description: debugDesc,
        },
        {
          name: 'dryrun',
          type: Boolean,
          description: dryrunDesc,
        },        
      ]
    }    
];

const dereferenceUsage = [
  {
    header: `${programName} dereference`,
    content: dereferenceDesc
  },
  {
    header: 'Synopsis',
    content: `$ ${programName} dereference [<specificationDir>] [<flags>]`
  },
  {
    header: 'Arguments',
    content: [
      { name: 'specificationDir', summary: '[OPTIONAL] Specify a single directory containing OpenAPI JSON documents emitted from the generate command (autorest output files)' },
    ]
  },
  {
      header: 'Flags',
      optionList: [
        {
          name: 'debug',
          alias: 'd',
          type: Boolean,
          description: debugDesc,
        },
        {
          name: 'dryrun',
          type: Boolean,
          description: dryrunDesc,
        }, 
        {
          name: 'prettyprint',
          type: Boolean,
          description: prettyprintDesc,
        },        
      ]
    }    
];

const combineUsage = [
  {
    header: `${programName} combine`,
    content: combineDesc
  },
  {
    header: 'Synopsis',
    content: `$ ${programName} combine [<specificationDir>] [<flags>]`
  },
  {
    header: 'Arguments',
    content: [
      { name: 'specificationDir', summary: '[OPTIONAL] Specify a single directory containing dereferenced OpenAPI JSON documents emitted from the dereference command' },
    ]
  },
  {
      header: 'Flags',
      optionList: [
        {
          name: 'debug',
          alias: 'd',
          type: Boolean,
          description: debugDesc,
        },
        {
          name: 'dryrun',
          type: Boolean,
          description: dryrunDesc,
        },        
      ]
    }    
];

const docUsage = [
  {
    header: `${programName} doc`,
    content:docDesc
  },
  {
    header: 'Synopsis',
    content: `$ ${programName} doc <providerName>`
  },
  {
    header: 'Arguments',
    content: [
      { name: 'providerName', summary: 'stackql provider name' },
    ]
  },
  {
      header: 'Flags',
      optionList: [
        {
          name: 'debug',
          alias: 'd',
          type: Boolean,
          description: debugDesc,
        },
        {
          name: 'dryrun',
          type: Boolean,
          description: dryrunDesc,
        },        
      ]
    }    
];

const validateUsage = [
  {
    header: `${programName} validate`,
    content:validateDesc
  },
  {
    header: 'Synopsis',
    content: `$ ${programName} validate [<specificationDir>] [<flags>]`
  },
  {
    header: 'Arguments',
    content: [
      { name: 'specificationDir', summary: '[OPTIONAL] Specify a single directory containing dereferenced and combined OpenAPI yaml document' },
    ]
  },
  {
      header: 'Flags',
      optionList: [
        {
          name: 'debug',
          alias: 'd',
          type: Boolean,
          description: debugDesc,
        },
        {
          name: 'dryrun',
          type: Boolean,
          description: dryrunDesc,
        },        
      ]
    }    
];

const tagUsage = [
  {
    header: `${programName} tag`,
    content:tagDesc
  },
  {
    header: 'Synopsis',
    content: `$ ${programName} tag [<specificationDir>] [<flags>]`
  },
  {
    header: 'Arguments',
    content: [
      { name: 'specificationDir', summary: '[OPTIONAL] Specify a single directory containing a combined OpenAPI yaml document' },
    ]
  },
  {
      header: 'Flags',
      optionList: [
        {
          name: 'debug',
          alias: 'd',
          type: Boolean,
          description: debugDesc,
        },
        {
          name: 'dryrun',
          type: Boolean,
          description: dryrunDesc,
        },        
      ]
    }    
];

function showUsage(command) {
    switch(command) {
        case 'generate':
          console.log(commandLineUsage(generateUsage));
          break;
        case 'dereference':
          console.log(commandLineUsage(dereferenceUsage));
          break;
        case 'combine':
          console.log(commandLineUsage(combineUsage));
          break;
        case 'validate':
          console.log(commandLineUsage(validateUsage));
          break;
        case 'doc':
          console.log(commandLineUsage(docUsage));
          break;          
        case 'tag':
          console.log(commandLineUsage(tagUsage));
          break;           
        default:
            console.log(commandLineUsage(cmdUsage));
    };
}

function parseArgumentsIntoOptions(rawArgs) {
 const args = arg(
   {
     '--dryrun': Boolean,
     '--debug': Boolean,
     '--prettyprint': Boolean,
     '-d': '--debug',
   },
   {
     argv: rawArgs.slice(2),
   }
 );
 return {
  dryrun: args['--dryrun'] || false,
  debug: args['--debug'] || false,
  prettyprint: args['--prettyprint'] || false,
  command: args._[0] || false,
  specificationDir: args._[1] || false,
 };
}

export {
  showUsage,
  parseArgumentsIntoOptions,
}
