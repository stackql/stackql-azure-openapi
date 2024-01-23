

/* --------------------------------------------- */
/* needed to avoid unreachable routes in stackQL */
/* --------------------------------------------- */

export function checkForMethodNameOverrides(serviceName, opId, initMethod){
    switch (serviceName) {
        case 'elastic':
            switch (opId) {
                case 'createAndAssociatePLFilter_Create':
                    return 'create_and_associate_pl_filter';
                case 'createAndAssociateIPFilter_Create':
                    return 'create_and_associate_ip_filter';                    
                default:
                    return initMethod;
            }
        case 'deployment_admin':
            switch (opId) {
                case 'BootstrapAction_Product':
                    return 'product_bootstrap_action';
                case 'DeployAction_Product':
                    return 'product_deploy_action';
                case 'ExecuteRunnerAction_Product':
                    return 'product_execute_runner_action';
                case 'RemoveAction_Product':
                    return 'product_remove_action';
                case 'RotateSecretsAction_Product':
                    return 'product_rotate_secrets_action';                                            
                default:
                    return initMethod;
            }            
        case 'azure_stack':
            switch (opId) {
                case 'Products_ListProducts':
                    return 'list_products';
                default:
                    return initMethod;
            }            
        default:
            return initMethod;
    }
}

function getSqlVerbFromOpId(service, opId){
    switch (service) {
        case 'vmware':
            switch (opId) {
                case 'WorkloadNetworks_Get':
                    return 'exec';
                case 'WorkloadNetworks_List':
                    return 'exec';
                default:
                    return false;
            }
        case 'elastic':
            switch (opId) {
                case 'createAndAssociateIPFilter_Create':
                    return 'exec';
                case 'createAndAssociatePLFilter_Create':
                    return 'exec';                    
                case 'DetachAndDeleteTrafficFilter_Delete':
                    return 'exec';                    
                default:
                    return false;
            }
        case 'netapp':
            switch (opId) {
                case 'NetAppResource_QueryNetworkSiblingSet':
                    return 'select';
                case 'NetAppResource_QueryRegionInfo':
                    return 'select';        
                default:
                    return false;
            }
        case 'sap_workloads':
            switch (opId) {
                case 'SAPAvailabilityZoneDetails':
                    return 'select';
                case 'SAPDiskConfigurations':
                    return 'select';
                case 'SAPSizingRecommendations':
                    return 'select';
                case 'SAPSupportedSku':
                    return 'select';                        
                default:
                    return false;
            }               
        case 'azure_stack':
            switch (opId) {
                case 'Products_GetProducts':
                    return 'exec';
                case 'Products_GetProduct':
                    return 'exec';        
                default:
                    return false;
            }                                       
        default:
            return false;
    }
}

export function getResourceNameFromOpId(service, opId){
    switch (service) {
        case 'confluent':
            switch (opId) {
                case 'Validations_ValidateOrganization':
                    return 'organization';
                case 'Validations_ValidateOrganizationV2':
                    return 'organization';
                case 'Access_InviteUser':
                    return 'access_users';                    
                default:
                    return false;
            }
        case 'connected_vsphere':
            switch (opId) {
                case 'VirtualMachineInstances_Get':
                    return 'virtual_machine_instance';
                case 'VmInstanceHybridIdentityMetadata_List':
                    return 'vm_instance_hybrid_identity_metadata_list';
                case 'VMInstanceGuestAgents_Get':
                    return 'vm_instance_guest_agent';
                default:
                    return false;
            }
        case 'datadog':
            switch (opId) {
                case 'CreationSupported_List':
                    return 'subscription_statuses';
                case 'CreationSupported_Get':
                    return 'subscription_statuses_default';
                default:
                    return false;
            }
        case 'paloaltonetworks':
            switch (opId) {
                case 'FirewallStatus_ListByFirewalls':
                    return 'firewall_statuses';
                default:
                    return false;
            }
        case 'sap_workloads':
            switch (opId) {
                case 'SapLandscapeMonitor_List':
                    return 'sap_landscape_monitors';
                case 'SapLandscapeMonitor_Create':
                    return 'sap_landscape_monitors';                    
                default:
                    return false;
            }                          
        case 'vmware':
            switch (opId) {
                case 'WorkloadNetworks_Get':
                    return 'skip_this_resource';
                case 'WorkloadNetworks_List':
                    return 'skip_this_resource';
                case 'WorkloadNetworks_ListPublicIPs':
                    return 'workload_networks_public_ip';                    
                default:
                    return false;
            }
        case 'redis':
            switch (opId) {
                case 'AccessPolicy_CreateUpdate':
                    return 'access_policy';
                case 'AccessPolicyAssignment_CreateUpdate':
                    return 'access_policy_assignment';        
                default:
                    return false;
            }
        case 'netapp':
            switch (opId) {
                case 'NetAppResource_QueryNetworkSiblingSet':
                    return 'resource_network_sibling_set';
                case 'NetAppResource_QueryRegionInfo':
                    return 'resource_region_info';
                case 'Volumes_DeleteReplication':
                    return 'volumes_replications';
                case 'Volumes_ListGetGroupIdListForLdapUser':
                    return 'group_id_for_ldap_user';                                    
                default:
                    return false;
            }        
        case 'logz':
            switch (opId) {
                case 'Monitor_VMHostPayload':
                    return 'monitors';
                default:
                    return false;
            }
        case 'elastic':
            switch (opId) {
                case 'DetachTrafficFilter_Update':
                    return 'traffic_filters';
                case 'AllTrafficFilters_list':
                    return 'traffic_filters';
                case 'AssociateTrafficFilter_Associate':
                    return 'traffic_filters';
                case 'createAndAssociateIPFilter_Create':
                    return 'traffic_filters';
                case 'createAndAssociatePLFilter_Create':
                    return 'traffic_filters';
                case 'TrafficFilters_Delete':
                    return 'traffic_filters'; 
                case 'DetachAndDeleteTrafficFilter_Delete':
                    return 'traffic_filters';
                case 'listAssociatedTrafficFilters_list':
                    return 'associated_traffic_filters';
                case 'Monitor_Upgrade':
                    return 'monitors';
                case 'UpgradableVersions_Details':
                    return 'versions';                                                                        
                default:
                    return false;
            }
        case 'azure_stack_hci':
            switch (opId) {
                case 'UpdateSummaries_List':
                    return 'update_summaries_list';
                default:
                    return false;
            }
        case 'azure_stack':
            switch (opId) {
                case 'Products_ListProducts':
                    return 'products';
                case 'Products_GetProducts':
                    return 'products';
                case 'Products_GetProduct':
                    return 'product';
                case 'Products_Get':
                    return 'product';                                        
                default:
                    return false;
            }
        case 'fabric_admin':
            switch (opId) {
                case 'ScaleUnits_CreateFromJson':
                    return 'scale_units';
                default:
                    return false;
            }                                                                                  
        case 'container_registry_admin':
            switch (opId) {
                case 'Quota_CreateOrUpdate':
                    return 'quotas';
                default:
                    return false;
            }                                                                                  
        case 'deployment_admin':
            switch (opId) {
                case 'BootstrapAction_Product':
                    return 'actions';
                case 'DeployAction_Product':
                    return 'actions';
                case 'ExecuteRunnerAction_Product':
                    return 'actions';
                case 'RemoveAction_Product':
                    return 'actions';
                case 'RotateSecretsAction_Product':
                    return 'actions';
                default:
                    return false;
            }                                                                                  
        case 'backup_admin':
            switch (opId) {
                case 'BackupLocations_CreateBackup':
                    return 'backups';
                default:
                    return false;
            }
        case 'marketplace':
            switch (opId) {
                case 'PrivateStoreCollectionOffer_ListByContexts':
                    return 'collection_offers_by_context';
                default:
                    return false;
            }
        case 'alerts_management':
            switch (opId) {
                case 'Alerts_ListEnrichments':
                    return 'alerts_enrichments_list';
                default:
                    return false;
            }
        case 'cosmos_db':
            switch (opId) {
                case 'DatabaseAccounts_ListReadOnlyKeys': return 'database_accounts_read_only_keys_list';
                case 'MongoClusters_ListFirewallRules': return 'mongo_clusters_firewall_rule';
                case 'MongoDBResources_GetMongoRoleDefinition': return 'mongo_role_definition';
                case 'MongoDBResources_DeleteMongoRoleDefinition': return 'mongo_role_definition';
                case 'MongoDBResources_CreateUpdateMongoRoleDefinition': return 'mongo_role_definition';
                case 'MongoDBResources_ListMongoRoleDefinitions': return 'mongo_role_definition';
                case 'MongoDBResources_GetMongoUserDefinition': return 'mongo_user_definition';
                case 'MongoDBResources_DeleteMongoUserDefinition': return 'mongo_user_definition';
                case 'MongoDBResources_CreateUpdateMongoUserDefinition': return 'mongo_user_definition';
                case 'MongoDBResources_ListMongoUserDefinitions': return 'mongo_user_definition';
                case 'SqlResources_GetSqlRoleDefinition': return 'sql_role_definition';
                case 'SqlResources_DeleteSqlRoleDefinition': return 'sql_role_definition';
                case 'SqlResources_CreateUpdateSqlRoleDefinition': return 'sql_role_definition';
                case 'SqlResources_ListSqlRoleDefinitions': return 'sql_role_definition';
                case 'SqlResources_GetSqlRoleAssignment': return 'sql_role_assignment';
                case 'SqlResources_DeleteSqlRoleAssignment': return 'sql_role_assignment';
                case 'SqlResources_CreateUpdateSqlRoleAssignment': return 'sql_role_assignment';
                case 'SqlResources_ListSqlRoleAssignments': return 'sql_role_assignment';
                case 'GraphResources_ListGraphs': return 'graphs';
                case 'GraphResources_GetGraph': return 'graphs';
                case 'GraphResources_CreateUpdateGraph': return 'graphs';
                case 'GraphResources_DeleteGraphResource': return 'graphs';
                case 'SqlResources_ListSqlDatabases': return 'sql_databases';
                case 'SqlResources_GetSqlDatabase': return 'sql_databases';
                case 'SqlResources_DeleteSqlDatabase': return 'sql_databases';
                case 'SqlResources_CreateUpdateSqlDatabase': return 'sql_databases';
                case 'SqlResources_ListClientEncryptionKeys': return 'client_encryption_keys';
                case 'SqlResources_GetClientEncryptionKey': return 'client_encryption_keys';
                case 'SqlResources_CreateUpdateClientEncryptionKey': return 'client_encryption_keys';
                case 'SqlResources_ListSqlContainers': return 'sql_containers';
                case 'SqlResources_GetSqlContainer': return 'sql_containers';
                case 'SqlResources_DeleteSqlContainer': return 'sql_containers';
                case 'SqlResources_CreateUpdateSqlContainer': return 'sql_containers';
                case 'SqlResources_ListSqlStoredProcedures': return 'sql_stored_procedures';
                case 'SqlResources_GetSqlStoredProcedure': return 'sql_stored_procedures';
                case 'SqlResources_DeleteSqlStoredProcedure': return 'sql_stored_procedures';
                case 'SqlResources_CreateUpdateSqlStoredProcedure': return 'sql_stored_procedures';
                case 'SqlResources_ListSqlUserDefinedFunctions': return 'sql_user_defined_functions';
                case 'SqlResources_GetSqlUserDefinedFunction': return 'sql_user_defined_functions';
                case 'SqlResources_DeleteSqlUserDefinedFunction': return 'sql_user_defined_functions';
                case 'SqlResources_CreateUpdateSqlUserDefinedFunction': return 'sql_user_defined_functions';
                case 'SqlResources_ListSqlTriggers': return 'sql_triggers';
                case 'SqlResources_GetSqlTrigger': return 'sql_triggers';
                case 'SqlResources_DeleteSqlTrigger': return 'sql_triggers';
                case 'SqlResources_CreateUpdateSqlTrigger': return 'sql_triggers';
                case 'MongoDBResources_ListMongoDBDatabases': return 'mongodb_databases';
                case 'MongoDBResources_GetMongoDBDatabase': return 'mongodb_databases';
                case 'MongoDBResources_DeleteMongoDBDatabase': return 'mongodb_databases';
                case 'MongoDBResources_CreateUpdateMongoDBDatabase': return 'mongodb_databases';
                case 'MongoDBResources_ListMongoDBCollections': return 'mongodb_collections';
                case 'MongoDBResources_GetMongoDBCollection': return 'mongodb_collections';
                case 'MongoDBResources_DeleteMongoDBCollection': return 'mongodb_collections';
                case 'MongoDBResources_CreateUpdateMongoDBCollection': return 'mongodb_collections';
                case 'TableResources_ListTables': return 'tables';
                case 'TableResources_GetTable': return 'tables';
                case 'TableResources_DeleteTable': return 'tables';
                case 'TableResources_CreateUpdateTable': return 'tables';
                case 'CassandraResources_ListCassandraKeyspaces': return 'cassandra_keyspaces';
                case 'CassandraResources_GetCassandraKeyspace': return 'cassandra_keyspaces';
                case 'CassandraResources_DeleteCassandraKeyspace': return 'cassandra_keyspaces';
                case 'CassandraResources_CreateUpdateCassandraKeyspace': return 'cassandra_keyspaces';
                case 'CassandraResources_ListCassandraTables': return 'cassandra_tables';
                case 'CassandraResources_GetCassandraTable': return 'cassandra_tables';
                case 'CassandraResources_DeleteCassandraTable': return 'cassandra_tables';
                case 'CassandraResources_CreateUpdateCassandraTable': return 'cassandra_tables';
                case 'GremlinResources_ListGremlinDatabases': return 'gremlin_databases';
                case 'GremlinResources_GetGremlinDatabase': return 'gremlin_databases';
                case 'GremlinResources_DeleteGremlinDatabase': return 'gremlin_databases';
                case 'GremlinResources_CreateUpdateGremlinDatabase': return 'gremlin_databases';
                case 'GremlinResources_ListGremlinGraphs': return 'gremlin_graphs';
                case 'GremlinResources_GetGremlinGraph': return 'gremlin_graphs';
                case 'GremlinResources_DeleteGremlinGraph': return 'gremlin_graphs';
                case 'GremlinResources_CreateUpdateGremlinGraph': return 'gremlin_graphs';
                case 'CassandraResources_ListCassandraViews': return 'cassandra_views';
                case 'CassandraResources_GetCassandraView': return 'cassandra_views';
                case 'CassandraResources_DeleteCassandraView': return 'cassandra_views';
                case 'CassandraResources_CreateUpdateCassandraView': return 'cassandra_views';
                case 'ThroughputPoolAccounts_List': return 'throughput_pool_accounts';
                case 'ThroughputPoolAccount_Get': return 'throughput_pool_accounts';
                case 'ThroughputPoolAccount_Create': return 'throughput_pool_accounts';
                case 'ThroughputPoolAccount_Delete': return 'throughput_pool_accounts'; 
                case 'CassandraClusters_GetBackup': return 'cassandra_clusters_backups'; 
                case 'SqlResources_GetSqlDatabaseThroughput': return 'sql_database_throughput'; 
                case 'SqlResources_ListSqlContainerPartitionMerge': return 'sql_container_partition_merge'; 
                case 'SqlResources_GetSqlContainerThroughput': return 'sql_container_throughput'; 
                case 'MongoDBResources_GetMongoDBDatabaseThroughput': return 'mongodb_database_throughput'; 
                case 'MongoDBResources_ListMongoDBCollectionPartitionMerge': return 'mongodb_collection_partition_merge'; 
                case 'MongoDBResources_GetMongoDBCollectionThroughput': return 'mongodb_collection_throughput'; 
                case 'TableResources_GetTableThroughput': return 'table_throughput'; 
                case 'CassandraResources_GetCassandraKeyspaceThroughput': return 'cassandra_keyspace_throughput'; 
                case 'CassandraResources_GetCassandraTableThroughput': return 'cassandra_table_throughput'; 
                case 'GremlinResources_GetGremlinDatabaseThroughput': return 'gremlin_database_throughput'; 
                case 'GremlinResources_GetGremlinGraphThroughput': return 'gremlin_graph_throughput'; 
                case 'CassandraResources_GetCassandraViewThroughput': return 'cassandra_view_throughput'; 
                default:
                    return false;
            }   
        case 'desktop_virtualization':
            switch (opId) {
                case 'SessionHostManagements_ListByHostPool':
                    return 'session_host_management_list';
                case 'SessionHostConfigurations_ListByHostPool':
                    return 'session_host_configurations_list';
                case 'ActiveSessionHostConfigurations_ListByHostPool':
                    return 'active_session_host_configurations_list';
                default:
                    return false;
            }
        case 'dev_center':
            switch (opId) {
                case 'NetworkConnections_ListHealthDetails':
                    return 'network_connections_health_details_list';
                default:
                    return false;
            }                                                                                                                               
        default:
            return false;
    }
}


export function getSQLVerbFromMethod(s, r, m, o){

    if(getSqlVerbFromOpId(s, o)){
        return getSqlVerbFromOpId(s, o);
    }

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
    storage_admin: [
        'storage_services_rg',
        'storage_services_sub'
    ],
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

export function getObjectKey(service, resource, verbKey, method){
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
                'storage_admin',
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

export function camelToSnake(inStr){
    let str = inStr.replace(/-/g, '_').replace(/ /g, '_');
    return str.replace(/\.?([A-Z])/g, function (x,y){
        return "_" + y.toLowerCase()
    }).replace(/^_/, "");
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
  