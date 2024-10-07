import { ConsoleLogger } from '@autorest/common';
import pluralize from 'pluralize';

const logger = new ConsoleLogger();

export function resolveStackQLDescriptorsDirectlyFromOpId(serviceName, operationId) {
    let stackqlResName;
    let stackqlMethodName;

    switch (serviceName) {
        case 'serial_console':
            switch (operationId) {
                case 'DisableConsole':
                    stackqlResName = 'console';
                    stackqlMethodName = 'disable';
                    break;
                case 'EnableConsole':
                    stackqlResName = 'console';
                    stackqlMethodName = 'enable';
                    break;
                case 'GetConsoleStatus':
                    stackqlResName = 'console'
                    stackqlMethodName = 'get_status';
                    break;
            }
        case 'compute':
            switch (operationId) {
                case 'VirtualMachines_InstanceView':
                    stackqlResName = 'virtual_machines';
                    stackqlMethodName = 'get_by_instance_view';
                    break;
                case 'DiskAccesses_GetAPrivateEndpointConnection':
                    stackqlResName = 'disk_access_private_endpoint_connections';
                    stackqlMethodName = 'get';
                    break;
                case 'DiskAccesses_ListPrivateEndpointConnections':
                    stackqlResName = 'disk_access_private_endpoint_connections';
                    stackqlMethodName = 'list';
                    break;
                case 'DiskAccesses_UpdateAPrivateEndpointConnection':
                    stackqlResName = 'disk_access_private_endpoint_connections';
                    stackqlMethodName = 'update';
                    break;
                case 'DiskAccesses_DeleteAPrivateEndpointConnection':
                    stackqlResName = 'disk_access_private_endpoint_connections';
                    stackqlMethodName = 'delete';
                    break;                                                
            }
    }

    return { stackqlResName, stackqlMethodName };
}

export function resolveStackQLDescriptorsFromSplittableOpId(serviceName, operationId) {
    let stackqlResName;
    let stackqlMethodName;

    // Split the operationId and process the parts
    stackqlResName = camelCaseAndPluralize(operationId.split('_')[0]);
    stackqlMethodName = camelCase(operationId.split('_')[1]);

    const actions = [
        'create', 
        'create_and_update', 
        'create_if_not_exist', 
        'create_or_replace', 
        'create_or_update',
        'create_update',
        'create_and_start_migration',
        'create_or_get_start_pending_upload',
        'create_or_update_or_cancel',
        'get',
        'get_all',
        'list',
        'list_all',
        'update',
        'update_put',
        'patch',
        'put',
        'replace',
        'replace_all',
        'delete',
    ];    

    const subResActions = [
        'get',
        'get_all',
        'list',
        'list_all',
        'create_or_update',
        'create_update',
        'create',
        'delete',
    ]

    const conditionalClauses = ['_by_', '_with_', '_in_'];

    // Simple direct match
    if (actions.includes(stackqlMethodName)) {
        return { stackqlResName, stackqlMethodName };
    }

    // Check if the stackqlMethodName is a known action followed immediately by a conditional clause
    for (const action of actions) {
        for (const clause of conditionalClauses) {
            const regex = new RegExp(`^${action}${clause}`);
            if (regex.test(stackqlMethodName)) {
                return { stackqlResName, stackqlMethodName };
            }
        }
    }

    // If it's a known action but not just the action or action + condition
    for (const action of subResActions) {
        if (stackqlMethodName.startsWith(action)) {
            // Remove the action from the method name
            let remaining = stackqlMethodName.replace(action, '');

            // Now, remove any conditional clause and everything after it
            for (const clause of conditionalClauses) {
                const clauseIndex = remaining.indexOf(clause);
                if (clauseIndex !== -1) {
                    remaining = remaining.substring(0, clauseIndex); // Keep only the part before the condition
                    break;
                }
            }

            // Update the resource name by appending the remaining part
            stackqlResName = `${stackqlResName}_${camelCaseAndPluralize(remaining)}`;
            return { stackqlResName, stackqlMethodName };
        }
    }

    return { stackqlResName, stackqlMethodName };
}

export function resolveStackQLDescriptorsFromNonSplittableOpId(operationId, operationTags){
    let stackqlResName;
    let stackqlMethodName;

    // starts with a known verb?
    const verbs = ['Create', 'Delete', 'Get', 'List', 'Put', 'Update', 'Patch', 'Post'];
    const verbRegex = new RegExp(`^(${verbs.join('|')})(.*)`, 'i');
    const match = operationId.match(verbRegex);

    if (match) {
        const verb = match[1]; // The matched verb
        let rest = match[2];   // The rest of the string after the verb

        // Check if it ends with 'ByANYTHING' or 'WithANYTHING'
        const byOrWithRegex = /(By\w+|With\w+)$/;
        const byOrWithMatch = rest.match(byOrWithRegex);
        
        if (byOrWithMatch) {
            // Extract By or With statement
            stackqlMethodName = verb + byOrWithMatch[0]; // MethodName is verb + By/With statement
            stackqlResName = rest.replace(byOrWithRegex, ''); // ResName is the rest after removing By/With
        } else {
            stackqlMethodName = verb; // MethodName is just the verb
            stackqlResName = rest;    // ResName is the rest of the string after the verb
        }

        stackqlResName = camelCaseAndPluralize(stackqlResName);
        stackqlMethodName = camelCase(stackqlMethodName);
    } else {
        // not a known verb, check tags
        stackqlMethodName = camelCase(operationId);
        if(operationTags.length > 0) {
            // use the tag
            stackqlResName = camelCaseAndPluralize(operationTags[0].replace(/( |,|-)/g, ''));
        } else {
            stackqlResName = 'operations';
        }  
    }	
    
    return { stackqlResName, stackqlMethodName };
}

export function cleanResourceName(serviceName, stackqlResName) {

    let retName = stackqlResName;

    retName = retName.replace('skuses', 'skus')
                .replace('_for_my_approvals', '_for_my_approval')

    // if the resource starts with the service name, remove it
    if (retName.startsWith(`${serviceName}_`)) {
        retName = retName.replace(`${serviceName}_`, '');
    }

    if(serviceName == 'web_pubsub' && retName.startsWith('web_pub_sub_')){
        retName = retName.replace('web_pub_sub_', '');
    }

    if(serviceName == 'web_pubsub' && retName.startsWith('web_pub_subs_')){
        retName = retName.replace('web_pub_subs_', '');
    }

    if(serviceName == 'key_vault' && retName == 'vaults_deleteds'){
        retName = 'deleted_vaults';
    }

    return retName;
}

export function isNotSelectable(serviceName, stackqlResName, stackqlMethodName){

    switch (serviceName) {
        case 'container_apps':
            switch (stackqlResName) {
                case 'custom_domain_verification_ids':
                    switch (stackqlMethodName) {
                        case 'get':
                            return true;
            }
        }
        case 'key_vault':
            switch (stackqlResName) {
                case 'vaults':
                    switch (stackqlMethodName) {
                        case 'list':
                            return true;
            }
        }        
    }

    return false;
}

/* ----------------------------------------------------------------- */
/* needed to find the appropriate return object in an Azure response */
/* ----------------------------------------------------------------- */

function resolveRef(ref, inputDoc) {
    // Assuming the $ref is in the format "#/components/schemas/SchemaName"
    const refParts = ref.split('/');

    // Navigate through the inputDoc to find the referenced schema
    let schema = inputDoc;
    for (let i = 1; i < refParts.length; i++) { // Start from 1 to skip the '#' part
        schema = schema[refParts[i]];
        if (!schema) {
            // If the schema is not found, handle the error appropriately
            throw new Error(`Reference ${ref} not found in the document.`);
        }
    }

    return schema;
}

export function determineObjectKey(serviceName, operationId, operationObj, inputDoc, debug) {
    
    // look for specific overrides
    switch (serviceName) {
        case 'orbital':
            switch (operationId) {
                case 'OperationsResults_Get':
                    return 'none';
                default:
                    break;
            }
        case 'sql':
            switch (operationId) {
                case 'DatabaseSchemas_ListByDatabase':
                    return 'none';
                case 'JobVersions_ListByJob':
                    return 'none';
                case 'ManagedDatabaseSchemas_ListByDatabase':
                    return 'none';
                default:
                    break;
            }
        case 'synapse':
            switch (operationId) {
                case 'SqlPoolSchemas_List':
                    return 'none';
                case 'SqlPoolTables_ListBySchema':
                    return 'none';                    
                default:
                    break;
            }                        
        default:
            break;
    }
    
    // Check if there's a '200' response
    if (operationObj.responses && operationObj.responses['200']) {
        // Get the 200 response
        const response200 = operationObj.responses['200'];

        // Check if the response has a content of 'application/json' with a schema
        if (response200.content && response200.content['application/json'] && response200.content['application/json'].schema) {
            // Get the schema
            let schema = response200.content['application/json'].schema;

            // If schema is a $ref, resolve it to get the actual schema object
            if (schema.$ref) {
                // Resolve the $ref to get the actual schema object
                // This requires a function that can resolve $ref to a schema in 'components/schemas'
                // Let's assume you have such a function implemented
                schema = resolveRef(schema.$ref, inputDoc); // Assuming 'inputDoc' is accessible here
            }
            
            // Check if the schema has a 'value' property of type 'array'
            if (schema.properties && schema.properties.value && schema.properties.value.type === 'array') {
                debug ? logger.debug(`Returning '$.value' for objectKey for ${operationId}`) : null;
                return '$.value';
            }
        }
    }

    // Return 'none' if above conditions are not met
    return 'none';
}

/* --------------------------------------------------------------------- */
/* END needed to find the appropriate return object in an Azure response */
/* --------------------------------------------------------------------- */

function camelCase(methodName) {
    return camelToSnake(fixCamelCaseIssues(fixCamelCase(methodName)));
}

function camelCaseAndPluralize(resName) {
    const camelCaseResName = camelToSnake(fixCamelCaseIssues(fixCamelCase(resName)));
    let resNameParts = camelCaseResName.split('_');
    let lastPartPluralized = pluralize(resNameParts.pop());
    resNameParts.push(lastPartPluralized);
    return resNameParts.join('_');
}

export function camelToSnake(inStr){
    let str = inStr.replace(/-/g, '_').replace(/ /g, '_');
    return str.replace(/\.?([A-Z])/g, function (x,y){
        return "_" + y.toLowerCase()
    }).replace(/^_/, "");
}

export function fixCamelCaseIssues(propertyName) {
    const replacements = {
        GB: "Gb",
        IOPS: "Iops",
        MBps: "Mbps",
        DB: "Db",
        CRR: "Crr",
        BMS: "Bms",
        WAN: "Wan",
        URL: "Url",
        DHCP: "Dhcp",
        DNS: "Dns",
        IP: "Ip",
        TLS: "Tls",
        CNAME: "Cname",
        ML: "Ml",
        SKU: "Sku",
        CA: "Ca",
        ID: "Id",
        TTL: "Ttl",
        URI: "Uri",
        ACL: "Acl",
        API: "Api",
        MFA: "Mfa",
        OAuth: "Oauth",
        HyperV: "Hyperv",
    };
  
    let updatedPropertyName = propertyName;
  
    for (const [key, value] of Object.entries(replacements)) {
        const regex = new RegExp(key, 'g');
        updatedPropertyName = updatedPropertyName.replace(regex, value);
    }
  
    return updatedPropertyName;
}

export function fixCamelCase(inStr){
	
    const getReplaceArgs = (s) => {
        let retstr = s.charAt(0) + s.slice(1, s.length-1).toLowerCase() + s.charAt(s.length-1);
        return {find: s, replace: retstr}
    };
    
    const updateStr = (f, r) => {
        let re = new RegExp(f,"g");
        outStr = outStr.replace(re, r);
    };

    const replaceTokens = (s) => {
        return s.replace(/VCenters/g, 'Vcenters')
        .replace(/HyperV/g, 'Hyperv')
        .replace(/NetApp/g, 'Netapp')
        .replace(/VCores/g, 'Vcores')
        .replace(/MongoDB/g, 'Mongodb')
        .replace(/VmSS/g, 'Vms')
        .replace(/SaaS/g, 'Saas')
        .replace(/vNet/g, 'Vnet')
        .replace(/GitHub/g, 'Github')
        .replace(/OAuth/g, 'Oauth')
        .replace(/B2C/g, 'B2c')
        .replace(/B2B/g, 'B2b')
        .replace(/P2S/g, 'P2s')
        .replace(/VM/g, 'Vm')
        .replace(/-/g, '_');
    }

    // pre clean name
    let outStr = replaceTokens(inStr);

    // find all occurrences of sequences of more than one upper case letter 
    const sequentialCaps = /[A-Z]{2,}/g;
    const seqs = [...outStr.matchAll(sequentialCaps)];
    const flattened = seqs.flatMap(seq => seq);
    const uniq = [...new Set(flattened)];
    
    // generate the replace args for each unique sequence
    const arr= uniq.map(element => getReplaceArgs(element));
    
    // iterate through each replace operation
    arr.forEach(obj => updateStr(obj.find, obj.replace))
    
    // final clean up and return
    return outStr.slice(0,-1) + outStr.charAt(outStr.length-1).toLowerCase();

}
  