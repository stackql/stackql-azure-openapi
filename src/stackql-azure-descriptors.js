

/* --------------------------------------------- */
/* needed to avoid unreachable routes in stackQL */
/* --------------------------------------------- */

function getSQLVerbFromMethod(s, r, m, o){
    let v = 'exec';
    if (m.startsWith('ListBy')){
        v = selectOrExec('ListBy', s, r, m, o);
    } else if (m == 'ListAll'){
        v = 'select';
    } else if (m == 'GetBy'){
        v = 'select';
    } else if (m.toLowerCase() == 'get'){
        v = selectOrExec('Get', s, r, m, o);
    } else if (m.toLowerCase() == 'list'){
        v = selectOrExec('List', s, r, m, o);
    } else if (m.toLowerCase() == 'delete' || m.startsWith('DeleteBy')){
        v = 'delete';
    } else if (m.toLowerCase() == 'add' || m.toLowerCase() == 'create' || m == 'CreateOrUpdate' || m == 'CreateOrReplace'){
        v = 'insert';
    } 
    return v;
};

const selectExcludedOps = {
    api_management: [
        'Api_ListByTags', // method signature clash
        'Product_ListByTags', // method signature clash
        'Reports_ListByApi', // method signature clash
        'Reports_ListByUser', // method signature clash
        'Reports_ListByOperation', // method signature clash
        'Reports_ListByProduct', // method signature clash
        'Reports_ListByGeo', // method signature clash
        'Reports_ListByTime', // method signature clash
        'Reports_ListByRequest', // method signature clash
    ],
    application_insights: [
        'AnalyticsItems_Get', // method signature clash
    ],
    deployment_admin: [
        'Locations_Get', // method signature clash
    ],
    event_grid: [
        'PartnerConfigurations_Get', // method signature clash
    ],
    hdinsight: [
        'Configurations_Get', // unsuitable schema
    ],
    iot_security: [
        'Sites_Get', // method signature clash
        'DefenderSettings_Get', // method signature clash
    ],
    logic_apps: [
        'IntegrationServiceEnvironmentNetworkHealth_Get', // unsuitable schema
    ],
    management_groups: [
        'HierarchySettings_Get', // method signature clash
    ],
    mysql: [
        'ServerAdministrators_Get', // method signature clash
    ],
    network: [
        'FirewallPolicyIdpsSignaturesOverrides_Get', // method signature clash
        'VpnServerConfigurationsAssociatedWithVirtualWan_List', // method signature clash
    ],
    recovery_services_backup: [
        'BackupOperationResults_Get', // method signature clash
        'JobOperationResults_Get', // method signature clash
        'ProtectionContainerRefreshOperationResults_Get', // method signature clash
    ],
    recovery_services_site_recovery: [
        'ReplicationEligibilityResults_Get', // method signature clash
    ],
    security: [
        'IotSecuritySolutionAnalytics_Get', // method signature clash
        'MdeOnboardings_Get', // method signature clash
    ],
    service_fabric_managed_clusters: [
        'OperationResults_Get', // unsuitable schema
    ],
    sql: [
        'ManagedInstances_Get', // method signature clash
        'ManagedDatabaseQueries_Get', // method signature clash
        'DatabaseExtensions_Get', // unsuitable schema
        'DatabaseSchemas_Get', // unsuitable schema
        'JobVersions_Get', // unsuitable schema
        'ManagedDatabaseSchemas_Get', // unsuitable schema
    ],
    synapse: [
        'SqlPoolSchemas_Get', // unsuitable schema
        'SqlPoolTables_Get', // unsuitable schema
    ],
    automanage: [
        'ServicePrincipals_Get', // method signature clash
    ],
    data_box_edge: [
        'Orders_Get', // method signature clash
        'MonitoringConfig_Get', // method signature clash
    ],
    education: [
        'Grants_Get', // method signature clash
        'Labs_Get', // method signature clash
    ],
    workloads: [
        'WordpressInstances_Get', // method signature clash
    ],
    key_vault: [
        'Vaults_List', // method signature clash
    ],
    consumption: [
        'Marketplaces_List', // method signature clash
        'ReservationRecommendations_List', // method signature clash
        'UsageDetails_List', // method signature clash
    ],
    cost_management: [
        'Dimensions_List', // method signature clash
    ],
};

function selectOrExec(t, s, r, m, o){
    let defaultVerb = 'select';
    switch (t) {    
        case 'ListBy':
            if(['api_management'].includes(s)){
                if (selectExcludedOps[s].includes(o)){
                    defaultVerb = 'exec';
                    break;
                } 
            }
        case 'Get':    
            if([
                'application_insights',
                'deployment_admin',
                'event_grid',
                'hdinsight',
                'iot_security',
                'logic_apps',
                'management_groups',
                'mysql',
                'network',
                'recovery_services_backup',
                'recovery_services_site_recovery',
                'security',
                'service_fabric_managed_clusters',
                'sql',
                'synapse',
                'automanage',
                'data_box_edge',
                'education',
                'workloads',
                ].includes(s)){
                if (selectExcludedOps[s].includes(o)){
                    defaultVerb = 'exec';
                    break;
                }
            }
        case 'List':
            if([
                'key_vault',
                'consumption',
                'cost_management',
                'network',
                ].includes(s)){
                if (selectExcludedOps[s].includes(o)){
                    defaultVerb = 'exec';
                    break;
                }
            }
        default:
            defaultVerb = 'select';
            break;
    }
    return defaultVerb;
}

/* ------------------------------------------------- */
/* END needed to avoid unreachable routes in stackQL */
/* ------------------------------------------------- */

/* ----------------------------------------------------------------- */
/* needed to find the appropriate return object in an Azure response */
/* ----------------------------------------------------------------- */

const nonDefaultReturnObjects = {
    ad_hybrid_health_service: [
        'ip_address_aggregate_settings'
    ],
    api_management: [
        'network_status',
    ],
    application_insights: [
        'analytics_items',
        'export_configurations',
        'favorites',
        'proactive_detection_configurations',
    ],
    azure_stack: [
        'cloud_manifest_file',
    ],
    cdn: [
        'afd_origin_groups',
        'afd_origins',
        'routes',
        'rules',
    ],
    compute: [
        'virtual_machine_images',
        'virtual_machine_images_edge_zone',
        'shared_galleries',
    ],
    compute_admin: [
        'platform_images',
        'vm_extensions',
    ],
    databricks: [
        'outbound_network_dependencies_endpoints',
    ],
    deployment_admin: [
        'action_plan_operation_attempt',
    ],
    deployment_manager: [
        'rollouts',
        'artifact_sources',
        'service_topologies',
        'service_units',
        'services',
        'steps',
    ],
    elastic: [
        'deployment_info',
    ],
    engagement_fabric: [
        'accounts',
    ],
    hdinsight: [
        'configurations',
    ],
    iot_hub: [
        'private_endpoint_connections',
    ],
    maria_db: [
        'advisors',
    ],
    marketplace_ordering: [
        'marketplace_agreements',
    ],
    mysql: [
        'advisors',
    ],
    network: [
        'firewall_policy_idps_signatures',
        'firewall_policy_idps_signatures_filter_values',
        'service_tags',
    ],
    operational_insights: [
        'available_service_tiers',
        'intelligence_packs',
    ],
    peering: [
        'service_countries'
    ],
    powerbi_privatelinks: [
        'power_bi_resources',
        'private_link_services',
        'private_link_services_for_power_bi',
    ],
    provider_hub: [
        'operations',
    ],
    security: [
        'external_security_solutions',
    ],
    service_fabric_managed_clusters: [
        'managed_cluster_version',
    ],
    sql: [
        'capabilities',
        'database_advisors',
        'database_recommended_actions',
        'server_advisors',
        'database_schemas',
        'job_versions',
        'managed_database_schemas',
    ],
    synapse: [
        'integration_runtime_auth_keys',
        'integration_runtime_monitoring_data',
        'operations',
        'sql_pool_schemas',
        'sql_pool_tables',
    ],
};

function getObjectKey(service, resource, verbKey, method){
    let objectKey = 'none';

    if (verbKey === 'get'){

        if(method.toLowerCase().startsWith('list')){

            // default to jsonpath to 'value'
            objectKey = '$.value';

            // override defaults where needed
            if ([
                'ad_hybrid_health_service',
                'api_management',
                'application_insights',
                'azure_stack',
                'cdn',
                'compute',
                'compute_admin',
                'databricks',
                'deployment_admin',
                'deployment_manager',
                'elastic',
                'engagement_fabric',
                'hdinsight',
                'iot_hub',
                'maria_db',
                'marketplace_ordering',
                'mysql',
                'network',
                'operational_insights',
                'peering',
                'powerbi_privatelinks',
                'provider_hub',
                'security',
                'service_fabric_managed_clusters',
                'sql',
                'synapse',
            ].includes(service)){
                if(nonDefaultReturnObjects[service].includes(resource)){
                    objectKey = 'none';
                }
            } else if (service === 'automation'){
                if (resource === 'network_status'){
                    objectKey = '$.keys';
                } else if (resource === 'keys'){
                    objectKey = 'none';
                }
            }
        }
    }

    return objectKey;
}

/* --------------------------------------------------------------------- */
/* END needed to find the appropriate return object in an Azure response */
/* --------------------------------------------------------------------- */

function camelToSnake(inStr){
    let str = inStr.replace(/-/g, '_').replace(/ /g, '_');
    return str.replace(/\.?([A-Z])/g, function (x,y){
        return "_" + y.toLowerCase()
    }).replace(/^_/, "");
}

function fixCamelCase(inStr){
	
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

export {
    getSQLVerbFromMethod,
    camelToSnake,
    fixCamelCase,
    getObjectKey,
}
  