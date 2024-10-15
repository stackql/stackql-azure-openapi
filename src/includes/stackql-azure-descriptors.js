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
    api_management: {
        TenantAccessGit_RegeneratePrimaryKey: 'TenantAccess_RegenerateGitPrimaryKey',
        TenantAccessGit_RegenerateSecondaryKey: 'TenantAccess_RegenerateGitSecondaryKey',
        ApiManagementServiceSkus_ListAvailableServiceSkus: 'ApiManagementAvailableServiceSkus_List',
        NamedValue_ListValue: 'NamedValue_List',
    },
    app_service: {
        WebApps_ListBackupsSlot: 'WebApps_ListBackupSlots',
        ContainerAppsRevisions_ListRevisions: 'ContainerAppsRevisions_List',
        ContainerAppsRevisions_GetRevision: 'ContainerAppsRevisions_Get',
        WebApps_GetDiagnosticLogsConfigurationSlot: 'WebApps_GetDiagnosticLogsConfigSlot',
        WebApps_GetDiagnosticLogsConfiguration: 'WebApps_GetDiagnosticLogsConfig',
        AppServiceEnvironments_GetDiagnosticsItem: 'AppServiceEnvironments_GetDiagnostics',
        AppServicePlans_GetRouteForVnet: 'AppServicePlans_GetVnetRoute',
        AppServicePlans_ListRoutesForVnet: 'AppServicePlans_ListVnetRoute',
        DeletedWebApps_GetDeletedWebAppByLocation: 'DeletedWebApps_GetByLocation',
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
    container_apps: {
        ContainerAppsRevisionReplicas_GetReplica: 'ContainerAppsRevisionReplicas_Get',
        ContainerAppsRevisionReplicas_ListReplicas: 'ContainerAppsRevisionReplicas_List',
        ContainerAppsRevisions_ListRevisions: 'ContainerAppsRevisions_List',
        ContainerAppsRevisions_GetRevision: 'ContainerAppsRevisions_Get',
    },
    delegated_network: {
        ControllerDetails_Get: 'Controller_Get',
    },
    desktop_virtualization: {
        AppAttachPackageInfo_Import: 'AppAttachPackage_ImportInfo',
    },
    front_door: {
        FrontDoorNameAvailability_Check: 'Operations_CheckNameAvailability',
        FrontDoorNameAvailabilityWithSubscription_Check: 'Operations_CheckNameAvailabilityWithSubscription',
    },
    migrate_projects: {
        Solutions_GetSolution: 'Solutions_Get',
        Solutions_DeleteSolution: 'Solutions_Delete',
    },
    network: {
        IpGroups_UpdateGroups: 'IpGroups_Update',
    },
    postgresql: {
        GetPrivateDnsZoneSuffix_Execute: 'PrivateDnsZoneSuffix_ExecGet'
    },
    resource_graph: {
        Resources: 'Resources_Query',
    },
    scom: {
        Operations_ListV2: 'V2Operations_List',
    },
    search: {
        UsageBySubscriptionSku: 'UsageBySubscriptionSku_Get',
    },
    serial_console: {
        DisableConsole: 'Console_Disable',
        EnableConsole: 'Console_Enable',
        GetConsoleStatus: 'Console_GetStatus',
    },
    service_fabric_managed_clusters: {
        managedApplyMaintenanceWindow_Post: 'ManagedClusters_ApplyMaintenanceWindow'
    },
    voice_services: {
        NameAvailability_CheckLocal: 'Operations_CheckLocalNameAvailability',
    }
};

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

    // New condition to handle {Resource}_{Verb}{SubResource}{By|With|In}{Condition} pattern
    const resourceVerbPattern = /^(\w+)_((?:Create(?:OrUpdate)?|Get|List|Delete|Update|Replace)(?:\w+)(?:By|With|In)\w+)$/;
    const match = operationId.match(resourceVerbPattern);
    if (match) {
        const [, resource, restOfOperation] = match;
        const verbMatch = restOfOperation.match(/^(Create(?:OrUpdate)?|Get|List|Delete|Update|Replace)/);
        if (verbMatch) {
            const verb = verbMatch[0];
            const subResourceAndCondition = restOfOperation.slice(verb.length);
            return `${resource}${subResourceAndCondition}_${verb}`;
        }
    }    

    if (firstPart.toLowerCase().startsWith('generate')) {
        const rest = firstPart.slice(8).trim(); // Remove 'Generate' and any extra spaces
    
        // If there's nothing left after 'Generate', return firstPart and secondPart combined
        if (!rest) {
            return `${firstPart}_${secondPart}`;
        }
    
        return `${rest}_${secondPart}`;
    }
   
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
        'Create', 'CreateAndUpdate', 'CreateOrReplace', 'CreateOrUpdate', 'CreateIfNotExist', 'CreateOrGetStartPendingUpload', 'CreateAndStartMigration',
        'CreateUpdate', 'Delete', 'Get', 'GetAll', 'List', 'ListAll', 'Patch', 'Put',
        'Update', 'Replace', 'ReplaceAll', 'UpdatePatch', 'UpdatePut', 'UpdateTags'
    ];
    if (exactMatches.some(match => secondPart.toLowerCase() === match.toLowerCase())) {
        return false;
    }
    
    // Check second part patterns

    const patternRegex = /^(Create(By|OrUpdateBy|In(?=[A-Z]))|Delete(By|In)|Get(By|In)|List(All(By)?|By|In|With|For)|UpdateBy|In(?=[A-Z]))/;

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
        'CreateUpdate', 'createUpdate',
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
    retName = retName.replace(/_for_my_approvals$/g, '_for_my_approval');
    retName = retName.replace(/_news$/g, '_new');
    retName = retName.replace(/_existings$/g, '_existing');
    retName = retName.replace(/_prems$/g, '_prem');
    retName = retName.replace(/_supporteds$/g, '_supported');
    retName = retName.replace(/_recommendeds$/g, '_recommended');
    retName = retName.replace(/_currents$/g, '_current');
    retName = retName.replace(/_detaileds$/g, '_detailed');
    retName = retName.replace(/_mongos$/g, '_mongo');
    retName = retName.replace(/_activates$/g, '_activate');
    retName = retName.replace(/_centers$/g, '_center');
    retName = retName.replace(/_dismisses$/g, '_dismiss');
    retName = retName.replace(/_latests$/g, '_latest');
    retName = retName.replace(/_progresses$/g, '_progress');
    retName = retName.replace(/_resolves$/g, '_resolve');
    retName = retName.replace(/_bis$/g, '_bi');
    retName = retName.replace(/_crrs$/g, '_crr');
    retName = retName.replace(/_powershells$/g, '_powershell');
    retName = retName.replace(/_freshnesses$/g, '_freshness');
    retName = retName.replace(/_fors$/g, '_for');
    retName = retName.replace(/_jsons$/g, '_json');
    retName = retName.replace(/_sses$/g, '_sse');
    retName = retName.replace(/_troubleshoots$/g, '_troubleshoot');
    retName = retName.replace(/_v2s$/g, '_v2');
    retName = retName.replace(/_ins$/g, '_in');
    retName = retName.replace(/_texts$/g, '_text');
    retName = retName.replace(/_texts$/g, '_text');
    retName = retName.replace(/_deleteds$/g, '_deleted');
    retName = retName.replace(/_statuses$/g, '_status');
    retName = retName.replace(/_infos$/g, '_info');
    retName = retName.replace(/_alloweds$/g, '_allowed');

    // if the resource starts with the service name, remove it
    if (retName.startsWith(`${serviceName}_`)) {
        retName = retName.replace(`${serviceName}_`, '');
    }

    if(serviceName == 'web_pubsub'){
        retName = retName.replace(/^web_pub_sub_/, '');
        retName = retName.replace(/^web_pub_subs_/, '');
    }

    if(serviceName == 'key_vault' && retName == 'vaults_deleteds'){
        retName = 'deleted_vaults';
    }

    if(serviceName == 'dashboard' && retName == 'grafanas'){
        retName = 'grafana';
    }    

    if(serviceName == 'app_service'){

        retName = retName.replace(/^web_apps_/, '');
        retName = retName.replace(/^static_sites_/, '');
    
        switch (retName) {
            case 'app_settings_key_vault_references_slots':
                retName = 'app_setting_key_vault_reference_slots';
                break;
            case 'app_settings_key_vault_references':
                retName = 'app_setting_key_vault_references';
                break;
            case 'build_database_connection_with_details':
                retName = 'build_database_connections_with_details';
                break;
            case 'configurations_slots':
                retName = 'configuration_slots';
                break;
            case 'continuous_web_jobs_slots':
                retName = 'continuous_web_job_slots';
                break;
            case 'database_connection_with_details':
                retName = 'database_connections_with_details';
                break;
            case 'deployments_slots':
                retName = 'deployment_slots';
                break;
            case 'diagnostics_site_analyses_slots':
                retName = 'diagnostics_site_analysis_slots';
                break;
            case 'diagnostics_site_detector_responses_slots':
                retName = 'diagnostics_site_detector_response_slots';
                break;
            case 'diagnostics_site_detectors_slots':
                retName = 'diagnostics_site_detector_slots';
                break;
            case 'diagnostics_site_diagnostic_categories_slots':
                retName = 'diagnostics_site_diagnostic_category_slots';
                break;
            case 'domain_ownership_identifiers_slots':
                retName = 'domain_ownership_identifier_slots';
                break;
            case 'function_secrets_slots':
                retName = 'function_secret_slots';
                break;
            case 'host_name_bindings_slots':
                retName = 'host_name_binding_slots';
                break;
            case 'hybrid_connections_slots':
                retName = 'hybrid_connection_slots';
                break;
            case 'linked_backends_for_builds':
                retName = 'linked_backend_for_builds';
                break;
            case 'migrate_my_sql_status':
                retName = 'migrate_mysql_status';
                break;
            case 'migrate_my_sql_status_slots':
                retName = 'migrate_mysql_status_slots';
                break;
            case 'premier_add_ons_slots':
                retName = 'premier_add_on_slots';
                break;
            case 'processes_slots':
                retName = 'process_slots';
                break;
            case 'process_modules_slots':
                retName = 'process_module_slots';
                break;
            case 'public_certificates_slots':
                retName = 'public_certificate_slots';
                break;
            case 'relay_service_connections_slots':
                retName = 'relay_service_connection_slots';
                break;
            case 'site_containers_slots':
                retName = 'site_container_slots';
                break;
            case 'site_extensions_slots':
                retName = 'site_extension_slots';
                break;
            case 'slot_site_deployment_statuses_slots':
                retName = 'slot_site_deployment_status_slots';
                break;
            case 'triggered_web_jobs_slots':
                retName = 'triggered_web_job_slots';
                break;
            case 'user_provided_function_apps_for_static_site_builds':
                retName = 'user_provided_function_app_for_static_site_builds';
                break;
            case 'user_provided_function_apps_for_static_sites':
                retName = 'user_provided_function_app_for_static_sites';
                break;
            case 'vnet_connections_slots':
                retName = 'vnet_connection_slots';
                break;
            case 'web_jobs_slots':
                retName = 'web_job_slots';
                break;
        }
    }
    
    if(serviceName == 'cosmos_db'){
        retName = retName.replace(/^cassandra_resources_/, '');
        retName = retName.replace(/^gremlin_resources_/, '');
        retName = retName.replace(/^mongodb_resources_/, '');
        retName = retName.replace(/^sql_resources_/, '');
        retName = retName.replace(/^table_resources_/, '');
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
  