import { ConsoleLogger } from '@autorest/common';
import pluralize from 'pluralize';

const logger = new ConsoleLogger();

const opIdMap = {
    ad_hybrid_health_service: {
        update_IPAddressAggregateSettings: 'IPAddressAggregateSettings_Update',
        list_IPAddressAggregateSettings: 'IPAddressAggregateSettings_List',
        list_IPAddressAggregatesByService: 'IPAddressAggregatesByService_List',
    },
    advisor: {
        Predict: 'Recommendations_Predict',
        Recommendations_GetGenerateStatus: 'Recommendations_ExecGetGenerateStatus',
    },
    serial_console: {
        DisableConsole: 'Console_Disable',
        EnableConsole: 'Console_Enable',
        GetConsoleStatus: 'Console_GetStatus',
    },
    cloud_shell: {
        keepAliveWithLocation: 'Console_KeepAliveWithLocation',
        KeepAlive: 'Console_KeepAlive',
        PatchUserSettings: 'UserSettings_Patch',
        patchUserSettingsWithLocation: 'UserSettings_PatchWithLocation',
        PutConsole: 'Console_Put',
        putConsoleWithLocation: 'Console_PutWithLocation',
        PutUserSettings: 'UserSettings_Put',
        putUserSettingsWithLocation: 'UserSettings_PutWithLocation',
        DeleteConsole: 'Console_Delete',
        GetConsole: 'Console_Get',
        deleteConsoleWithLocation: 'ConsoleWithLocation_Delete',
        getConsoleWithLocation: 'ConsoleWithLocation_Get',
    },
    cognitive_services: {
        calculateModelCapacity: 'Models_CalculateCapacity',
    },
    scom: {
        Operations_ListV2: 'V2Operations_List',
    },
    container_apps: {
        ContainerAppsRevisionReplicas_GetReplica: 'ContainerAppsRevisionReplicas_Get',
        ContainerAppsRevisionReplicas_ListReplicas: 'ContainerAppsRevisionReplicas_List',
        ContainerAppsRevisions_ListRevisions: 'ContainerAppsRevisions_List',
        ContainerAppsRevisions_GetRevision: 'ContainerAppsRevisions_Get',
    },
    search: {
        UsageBySubscriptionSku: 'UsageBySubscriptionSku_Get',
    },
    resource_graph: {
        Resources: 'Resources_Query',
    }
}

export function getTransformedOperationId(serviceName, operationId) {

    // check opIdMap for direct hit
    if(opIdMap[serviceName] && opIdMap[serviceName][operationId]){
        return opIdMap[serviceName][operationId];
    }

    // Check for Check*-related operation IDs
    const checkRegex = /^check/i;
    if (checkRegex.test(operationId)) {
        return `Operations_${operationId.replace('_', '')}`;
    }

    // Check if operationId is splittable by '_'
    const parts = operationId.split('_');
    
    if (parts.length === 1) {
        // Not splittable

        // Check if operationId starts with a known verb
        if (operationId.toLowerCase().startsWith('list')) {
            const rest = operationId.slice(4);
            return `${rest}_List`;
        }

        if (operationId.toLowerCase().startsWith('get')) {
            const rest = operationId.slice(3);
            return `${rest}_Get`;
        }        

        if (operationId.toLowerCase().startsWith('delete')) {
            const rest = operationId.slice(6);
            return `${rest}_Delete`;
        }

        if (operationId.toLowerCase().startsWith('put')) {
            const rest = operationId.slice(3);
            return `${rest}_Put`;
        }
        
        if (operationId.toLowerCase().startsWith('update')) {
            const rest = operationId.slice(6);
            return `${rest}_Update`;
        }        

        if (operationId.toLowerCase().startsWith('create')) {
            const rest = operationId.slice(6);
            if(rest.startsWith('And') || rest.startsWith('Or') || rest.startsWith('If') || rest.startsWith('With') || rest.startsWith('In')) {
                return `Operations_${operationId}`;
            } else {
                return `${rest}_Create`;
            }
        }        

        return `Operations_${operationId}`;
    }
    
    // Splittable
    const [firstPart, secondPart] = parts;
   
    // Check first part patterns for transposed opid, excluding 'Deleted'
    const firstPartPatterns = ['Create', 'Delete', 'Get', 'List'];
    if (firstPartPatterns.some(pattern => firstPart.toLowerCase().startsWith(pattern.toLowerCase())) && 
        !firstPart.toLowerCase().startsWith('deleted')) {
        // Check if the second part starts with any of the firstPartPatterns
        const matchedFirstPattern = firstPartPatterns.find(pattern => firstPart.toLowerCase().startsWith(pattern.toLowerCase()));
        const matchedSecondPattern = firstPartPatterns.find(pattern => secondPart.toLowerCase().startsWith(pattern.toLowerCase()));
        
        if (matchedSecondPattern) {
            // Both parts start with a verb pattern
            const restOfFirstPart = firstPart.slice(matchedFirstPattern.length);
            return `${restOfFirstPart}_${matchedSecondPattern}`;
        } else {
            // Only the first part starts with a verb pattern
            return `${secondPart}_${matchedFirstPattern}`;
        }
    }

    // Check second part exact matches
    const exactMatches = [
        'Create', 'CreateAndUpdate', 'CreateOrReplace', 'CreateOrUpdate', 'CreateIfNotExist',
        'CreateUpdate', 'Delete', 'Get', 'GetAll', 'List', 'ListAll', 'Patch', 'Put',
        'Update', 'Replace', 'ReplaceAll', 'UpdatePatch', 'UpdatePut'
    ];
    if (exactMatches.some(match => secondPart.toLowerCase() === match.toLowerCase())) {
        return false;
    }
    
    // Check second part patterns
    const patternRegex = /^(Create(By|OrUpdateBy)|Delete(By|In)|Get(By|In)|List(All(By)?|By|In|With)|UpdateBy|In(?=[A-Z]))/;

    if (patternRegex.test(secondPart)) {
        return false;
    }

    // Check if second part doesn't start with specific prefixes
    const nonMatchingPrefixes = [
        'Create', 'Get', 'GetAll', 'Update', 'Replace', 'ReplaceAll', 'Delete', 'List', 'ListAll', 'get', 'list',
    ];
    if (!nonMatchingPrefixes.some(prefix => secondPart.startsWith(prefix))) {
        return false;
    }
    
    // New logic for handling specific verbs at the start of the second part
    const verbs = [
        'CreateOrUpdate', 'createOrUpdate',
        'Create', 'create',
        'Get', 'get',
        'List', 'list',
        'Delete', 'delete',
        'Update', 'update',
        'Replace', 'replace',
    ];
    for (const verb of verbs) {
        if (secondPart.startsWith(verb)) {
            const rest = secondPart.slice(verb.length);
            // Check for By*, In* (except Instances), or With* at the end
            if (rest.endsWith('By') || rest.endsWith('In') || rest.endsWith('With') || 
                (rest.endsWith('Instances') && rest !== 'Instances')) {
                return `${firstPart}${rest}_${secondPart}`;
            } else {
                return `${firstPart}${rest}_${verb}`;
            }
        }
    }

    return `Unassigned_${operationId.replace('_', '')}`;
}


export function resolveStackQLDescriptorsFromOpId(operationId){
    // split by _
    const parts = operationId.split('_');
    let stackqlResName;
    let stackqlMethodName;
    if(parts.length == 2){
        stackqlResName = camelCaseAndPluralize(parts[0]);
        stackqlMethodName = camelCase(parts[1]);
    } else if(parts.length == 1){
        stackqlResName = 'operations';
        stackqlMethodName = camelCase(operationId);
    } else {
        throw new Error(`OperationId ${operationId} is not in the expected format.`);
    }

    return { stackqlResName, stackqlMethodName };
}

export function cleanResourceName(serviceName, stackqlResName) {

    let retName = stackqlResName;

    retName = retName.replace(/skuses/g, 'skus');

    retName = retName.replace('_for_my_approvals', '_for_my_approval')

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

    if(serviceName == 'dashboard' && retName == 'grafanas'){
        retName = 'grafana';
    }    

    if(serviceName == 'app_service' && retName.startsWith('web_apps_')){
        retName = retName.replace('web_apps_', '');
    }
    
    if(serviceName == 'cosmos_db' && retName.startsWith('cassandra_resources_')){
        retName = retName.replace('cassandra_resources_', '');
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
        SignalR: "Signalr",
        GraphQL: "Graphql",
        SKU: "Sku",
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
  