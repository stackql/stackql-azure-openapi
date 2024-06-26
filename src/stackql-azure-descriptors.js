import { ConsoleLogger } from '@autorest/common';

const logger = new ConsoleLogger();

/* --------------------------------------------- */
/* needed to avoid unreachable routes in stackQL */
/* --------------------------------------------- */

export function checkForOpIdUpdates(serviceName, opId){
    switch (serviceName) {
        case 'cloud_shell':
            switch (opId) {
                case 'DeleteConsole':
                    return 'Console_Delete';
                case 'DeleteConsoleWithLocation':
                    return 'Console_DeleteByLocation';
                case 'DeleteUserSettings':
                    return 'UserSettings_Delete';
                case 'DeleteUserSettingsWithLocation':
                    return 'UserSettings_DeleteByLocation';
                case 'GetUserSettings':
                    return 'UserSettings_Get';
                case 'GetUserSettingsWithLocation':
                    return 'UserSettings_GetByLocation';
                case 'GetConsole':
                    return 'Console_Get';
                case 'GetConsoleWithLocation':
                    return 'Console_GetByLocation';
                case 'KeepAlive':
                    return 'Console_KeepAlive';
                case 'KeepAliveWithLocation':
                    return 'Console_KeepAliveByLocation';
                case 'PatchUserSettings':
                    return 'UserSettings_Patch';
                case 'PatchUserSettingsWithLocation':
                    return 'UserSettings_PatchByLocation';
                case 'PutConsole':
                    return 'Console_Put';
                case 'PutConsoleWithLocation':
                    return 'Console_PutByLocation';
                case 'PutUserSettings':
                    return 'UserSettings_Put';
                case 'PutUserSettingsWithLocation':
                    return 'UserSettings_PutByLocation';                
                default:
                    return false;
            }
        case 'app_service':
            switch (opId) {
                case 'ListSkus':
                    return 'Skus_List';
                case 'GetPublishingUser':
                    return 'PublishingUser_Get';
                case 'GetSourceControl':
                    return 'SourceControl_Get';
                case 'ListSourceControls':
                    return 'SourceControls_List';
                case 'ListSiteIdentifiersAssignedToHostName':
                    return 'SiteIdentifiersAssignedToHostName_List';
                case 'ListPremierAddOnOffers':
                    return 'PremierAddOnOffers_List';
                case 'ListGeoRegions':
                    return 'GeoRegions_List';
                case 'ListCustomHostNameSites':
                    return 'CustomHostNameSites_List';
                case 'ListBillingMeters':
                    return 'BillingMeters_List';
                case 'GetSubscriptionDeploymentLocations':
                    return 'SubscriptionDeploymentLocations_Get';
                case 'ListAseRegions':
                    return 'AseRegions_List';
                default:
                    return false;
            }
        case 'elastic':
            switch (opId) {
                case 'createAndAssociatePLFilter_Create':
                    return 'TrafficFilters_CreateAndAssociatePlFilter';
                    // traffic_filters
                    //return 'create_and_associate_pl_filter';
                case 'createAndAssociateIPFilter_Create':
                    return 'TrafficFilters_CreateAndAssociateIpFilter';
                    // return 'create_and_associate_ip_filter';  
                case 'DetachAndDeleteTrafficFilter_Delete':
                    return 'TrafficFilters_DetachAndDelete';                    
                default:
                    return false;
            }
        case 'deployment_admin':
            switch (opId) {
                case 'BootstrapAction_Product':
                    return 'Actions_ProductBootstrapAction';
                case 'DeployAction_Product':
                    return 'Actions_ProductDeployAction';
                case 'ExecuteRunnerAction_Product':
                    return 'Actions_ProductExecuteRunnerAction';
                case 'RemoveAction_Product':
                    return 'Actions_ProductRemoveAction';
                case 'RotateSecretsAction_Product':
                    return 'Actions_ProductRotateSecretsAction';                                            
                default:
                    return false;
            }            
        case 'azure_stack':
            switch (opId) {
                case 'Products_ListProducts':
                    return 'Products_ListByProductName';
                case 'Products_GetProducts':
                    return 'Products_ExecGet';
                case 'Products_GetProduct':
                    return 'Product_ExecGet';
                case 'Products_Get':
                    return 'Product_Get';                                                            
                default:
                    return false;
            }
        case 'compute':
            switch (opId) {
                case 'VirtualMachines_InstanceView':
                    return 'VirtualMachine_Get';
                default:
                    return false;
            }                        
        default:
            return false;
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
        case 'api_management':
            switch (opId) {
                case 'OperationsResults_Get':
                    return 'exec';
                default:
                    return false;
            }
        case 'resource_graph':
            switch (opId) {
                case 'Resources':
                    return 'select';
                case 'ResourcesHistory':
                    return 'select';
                case 'ResourceChangeDetails':
                    return 'select';                                            
                default:
                    return false;
            }
        // case 'elastic':
        //     switch (opId) {
        //         // case 'createAndAssociateIPFilter_Create':
        //         //     return 'exec';
        //         // case 'createAndAssociatePLFilter_Create':
        //         //     return 'exec';                    
        //         // case 'DetachAndDeleteTrafficFilter_Delete':
        //         //     return 'exec';                    
        //         default:
        //             return false;
        //     }
        case 'netapp':
            switch (opId) {
                case 'NetAppResource_QueryNetworkSiblingSet':
                    return 'select';
                case 'NetAppResource_QueryRegionInfo':
                    return 'select';
                case 'Accounts_GetChangeKeyVaultInformation':
                    return 'exec';        
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
        case 'automation':
            switch (opId) {
                case 'DscConfiguration_GetContent':
                    return 'exec';
                case 'Job_GetOutput':
                    return 'exec';
                case 'Job_GetRunbookContent':
                    return 'exec';
                case 'NodeReports_GetContent':
                    return 'exec';
                case 'RunbookDraft_GetContent':
                    return 'exec';
                case 'Runbook_GetContent':
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
                case 'TrafficFilters_Delete':
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
        case 'dns':
            switch (opId) {
                case 'DnssecConfigs_ListByDnsZone':
                    return 'dnssec_configs_list';
                case 'DnssecConfigs_Get':
                    return 'dnssec_configs';
                case 'DnssecConfigs_CreateOrUpdate':
                    return 'dnssec_configs';
                case 'DnssecConfigs_Delete':
                    return 'dnssec_configs';                                                                        
                default:
                    return false;
            }
        case 'event_hubs':
            switch (opId) {
                case 'Namespaces_ListNetworkRuleSet':
                    return 'namespaces_network_rule_set_list';
                default:
                    return false;
            }
        case 'hybrid_aks':
            switch (opId) {
                case 'provisionedClusterInstances_List':
                    return 'provisioned_cluster_instances_list';
                case 'HybridIdentityMetadata_ListByCluster':
                    return 'hybrid_identity_metadata_list';                    
                default:
                    return false;
            }
        case 'media_services':
            switch (opId) {
                case 'OperationStatuses_Get':
                    return 'asset_track_operation_statuses';
                case 'OperationResults_Get':
                    return 'asset_track_operation_results';                    
                default:
                    return false;
            }
        case 'monitor':
            switch (opId) {
                case 'MonitorOperations_List':
                    return 'operations_list';
                default:
                    return false;
            }
        case 'network_analytics':
            switch (opId) {
                case 'DataProductsCatalogs_Get':
                    return 'data_products_catalog';
                default:
                    return false;
            }
        case 'security':
            switch (opId) {
                case 'Pricings_Get':
                    return 'skip_this_resource';
                case 'Pricings_List':
                    return 'skip_this_resource';
                case 'Pricings_Delete':
                    return 'skip_this_resource';
                case 'DevOpsConfigurations_List':
                    return 'dev_ops_configurations_list';                                                            
                default:
                    return false;
            }
        case 'system_center_vm_manager':
            switch (opId) {
                case 'VMInstanceGuestAgents_List':
                    return 'vm_instance_guest_agents_list';
                case 'VirtualMachineInstanceHybridIdentityMetadata_List':
                    return 'virtual_machine_instance_hybrid_identity_metadata_list';
                case 'VirtualMachineInstances_List':
                    return 'virtual_machine_instances_list';                
                default:
                    return false;
            }
        case 'video_analyzer':
            switch (opId) {
                case 'OperationStatuses_Get':
                    return 'private_endpoint_connection_operation_statuses';
                case 'OperationResults_Get':
                    return 'private_endpoint_connection_operation_results';        
                default:
                    return false;
            }
        case 'api_management':
            switch (opId) {
                case 'Tag_GetEntityStateByOperation': return 'skip_this_resource';
                case 'Tag_GetEntityStateByProduct': return 'skip_this_resource';
                case 'Tag_GetEntityStateByApi': return 'skip_this_resource';
                case 'Tag_GetEntityState': return 'skip_this_resource';
                case 'Gateway_ListTrace': return 'skip_this_resource';
                case 'ApiIssueAttachment_GetEntityTag': return 'skip_this_resource';
                case 'Api_GetEntityTag': return 'skip_this_resource';
                case 'ApiDiagnostic_GetEntityTag': return 'skip_this_resource';
                case 'Logger_GetEntityTag': return 'skip_this_resource';
                case 'Backend_GetEntityTag': return 'skip_this_resource';
                case 'ContentItem_GetEntityTag': return 'skip_this_resource';
                case 'PortalConfig_GetEntityTag': return 'skip_this_resource';
                case 'OpenIdConnectProvider_GetEntityTag': return 'skip_this_resource';
                case 'Documentation_GetEntityTag': return 'skip_this_resource';
                case 'IdentityProvider_GetEntityTag': return 'skip_this_resource';
                case 'ApiRelease_GetEntityTag': return 'skip_this_resource';
                case 'ApiOperation_GetEntityTag': return 'skip_this_resource';
                case 'ApiOperationPolicy_GetEntityTag': return 'skip_this_resource';
                case 'GraphQLApiResolver_GetEntityTag': return 'skip_this_resource';
                case 'GraphQLApiResolverPolicy_GetEntityTag': return 'skip_this_resource';
                case 'ApiPolicy_GetEntityTag': return 'skip_this_resource';
                case 'ApiSchema_GetEntityTag': return 'skip_this_resource';
                case 'ApiIssue_GetEntityTag': return 'skip_this_resource';
                case 'ApiIssueComment_GetEntityTag': return 'skip_this_resource';
                case 'ApiTagDescription_GetEntityTag': return 'skip_this_resource';
                case 'ApiWiki_GetEntityTag': return 'skip_this_resource';
                case 'PolicyRestriction_GetEntityTag': return 'skip_this_resource';
                case 'AuthorizationServer_GetEntityTag': return 'skip_this_resource';
                case 'EmailTemplate_GetEntityTag': return 'skip_this_resource';
                case 'PolicyFragment_GetEntityTag': return 'skip_this_resource';
                case 'Policy_GetEntityTag': return 'skip_this_resource';
                case 'User_GetEntityTag': return 'skip_this_resource';
                case 'Diagnostic_GetEntityTag': return 'skip_this_resource';
                case 'ApiVersionSet_GetEntityTag': return 'skip_this_resource';
                case 'Certificate_GetEntityTag': return 'skip_this_resource';
                case 'Subscription_GetEntityTag': return 'skip_this_resource';
                case 'Group_GetEntityTag': return 'skip_this_resource';
                case 'NamedValue_GetEntityTag': return 'skip_this_resource';
                case 'PortalRevision_GetEntityTag': return 'skip_this_resource';
                case 'Product_GetEntityTag': return 'skip_this_resource';
                case 'ProductPolicy_GetEntityTag': return 'skip_this_resource';
                case 'ProductWiki_GetEntityTag': return 'skip_this_resource';
                case 'SignInSettings_GetEntityTag': return 'skip_this_resource';
                case 'SignUpSettings_GetEntityTag': return 'skip_this_resource';
                case 'DelegationSettings_GetEntityTag': return 'skip_this_resource';
                case 'GlobalSchema_GetEntityTag': return 'skip_this_resource';
                case 'Gateway_GetEntityTag': return 'skip_this_resource';
                case 'GatewayHostnameConfiguration_GetEntityTag': return 'skip_this_resource';
                case 'GatewayApi_GetEntityTag': return 'skip_this_resource';
                case 'GatewayCertificateAuthority_GetEntityTag': return 'skip_this_resource';
                case 'TenantAccess_GetEntityTag': return 'skip_this_resource';
                case 'Cache_GetEntityTag': return 'skip_this_resource';
                case 'Workspace_GetEntityTag': return 'skip_this_resource';
                case 'WorkspacePolicy_GetEntityTag': return 'skip_this_resource';
                case 'WorkspaceNamedValue_GetEntityTag': return 'skip_this_resource';
                case 'WorkspaceGlobalSchema_GetEntityTag': return 'skip_this_resource';
                case 'WorkspacePolicyFragment_GetEntityTag': return 'skip_this_resource';
                case 'WorkspaceGroup_GetEntityTag': return 'skip_this_resource';
                case 'WorkspaceSubscription_GetEntityTag': return 'skip_this_resource';
                case 'WorkspaceApiVersionSet_GetEntityTag': return 'skip_this_resource';
                case 'WorkspaceApi_GetEntityTag': return 'skip_this_resource';
                case 'WorkspaceApiRelease_GetEntityTag': return 'skip_this_resource';
                case 'WorkspaceApiOperation_GetEntityTag': return 'skip_this_resource';
                case 'WorkspaceApiOperationPolicy_GetEntityTag': return 'skip_this_resource';
                case 'WorkspaceApiPolicy_GetEntityTag': return 'skip_this_resource';
                case 'WorkspaceApiSchema_GetEntityTag': return 'skip_this_resource';
                case 'WorkspaceProduct_GetEntityTag': return 'skip_this_resource';
                case 'WorkspaceProductPolicy_GetEntityTag': return 'skip_this_resource';
                case 'WorkspaceTag_GetEntityState': return 'skip_this_resource';
                default: return false;
            }            
        case 'advisor':
            switch (opId) {
                case 'Recommendations_GetGenerateStatus':
                    return 'skip_this_resource';
                default:
                    return false;
            }
        case 'analysis_services':
            switch (opId) {
                case 'Servers_ListOperationResults':
                    return 'skip_this_resource';
                default:
                    return false;
            }
        case 'app_service':
            switch (opId) {
                case 'Global_GetSubscriptionOperationWithAsyncResponse': return 'skip_this_resource';
                case 'AppServicePlans_GetServerFarmSkus': return 'skip_this_resource';
                case 'WebApps_GetContainerLogsZip': return 'skip_this_resource';
                case 'WebApps_GetWebSiteContainerLogs': return 'skip_this_resource';
                case 'WebApps_GetOneDeployStatus': return 'skip_this_resource';
                case 'WebApps_GetFunctionsAdminToken': return 'skip_this_resource';
                case 'WebApps_ListSyncStatus': return 'skip_this_resource';
                case 'WebApps_GetInstanceProcessDump': return 'skip_this_resource';
                case 'WebApps_GetProcessDump': return 'skip_this_resource';
                case 'WebApps_ListPublishingProfileXmlWithSecrets': return 'skip_this_resource';
                case 'WebApps_GetWebSiteContainerLogsSlot': return 'skip_this_resource';
                case 'WebApps_GetContainerLogsZipSlot': return 'skip_this_resource';
                case 'WebApps_GetFunctionsAdminTokenSlot': return 'skip_this_resource';
                case 'WebApps_ListSyncStatusSlot': return 'skip_this_resource';
                case 'WebApps_GetInstanceProcessDumpSlot': return 'skip_this_resource';
                case 'WebApps_GetProcessDumpSlot': return 'skip_this_resource';
                case 'WebApps_ListPublishingProfileXmlWithSecretsSlot': return 'skip_this_resource';
                default: return false;
            }
        case 'compute':
            switch (opId) {
                case 'CloudServiceRoleInstances_GetRemoteDesktopFile': return 'skip_this_resource';
                case 'VirtualMachines_RunCommand': return 'virtual_machine';
                case 'VirtualMachines_Capture': return 'virtual_machine';
                case 'VirtualMachines_Update': return 'virtual_machine';
                case 'VirtualMachines_ConvertToManagedDisks': return 'virtual_machine';
                case 'VirtualMachines_Deallocate': return 'virtual_machine';
                case 'VirtualMachines_Generalize': return 'virtual_machine';
                case 'VirtualMachines_PowerOff': return 'virtual_machine';
                case 'VirtualMachines_Reapply': return 'virtual_machine';
                case 'VirtualMachines_Restart': return 'virtual_machine';
                case 'VirtualMachines_Start': return 'virtual_machine';
                case 'VirtualMachines_Redeploy': return 'virtual_machine';
                case 'VirtualMachines_Reimage': return 'virtual_machine';
                case 'VirtualMachines_RetrieveBootDiagnosticsData': return 'virtual_machine';
                case 'VirtualMachines_PerformMaintenance': return 'virtual_machine';
                case 'VirtualMachines_SimulateEviction': return 'virtual_machine';
                case 'VirtualMachines_AssessPatches': return 'virtual_machine';
                case 'VirtualMachines_InstallPatches': return 'virtual_machine';
                case 'VirtualMachines_AttachDetachDataDisks': return 'virtual_machine';
                default: return false;
            }
        case 'hybrid_network':
            switch (opId) {
                case 'ProxyArtifact_List': return 'skip_this_resource';
                default: return false;
            }
        case 'logic_apps':
            switch (opId) {
                case 'Workflows_ListSwagger': return 'skip_this_resource';
                default: return false;
            }
        case 'network':
            switch (opId) {
                case 'VirtualHubBgpConnections_ListAdvertisedRoutes': return 'skip_this_resource';
                case 'VirtualHubBgpConnections_ListLearnedRoutes': return 'skip_this_resource';
                case 'VirtualNetworkGatewayConnections_GetIkeSas': return 'skip_this_resource';
                case 'VirtualNetworkGateways_GetVpnProfilePackageUrl': return 'skip_this_resource';
                case 'VpnLinkConnections_GetIkeSas': return 'skip_this_resource';
                case 'VpnGateways_StartPacketCapture': return 'skip_this_resource';
                case 'VpnGateways_StopPacketCapture': return 'skip_this_resource';
                case 'VpnConnections_StartPacketCapture': return 'skip_this_resource';
                case 'VpnConnections_StopPacketCapture': return 'skip_this_resource';
                case 'VirtualNetworkGateways_Generatevpnclientpackage': return 'skip_this_resource';
                case 'VirtualNetworkGateways_GenerateVpnProfile': return 'skip_this_resource';
                case 'VirtualNetworkGateways_GetVpnProfilePackageUrl': return 'skip_this_resource';
                case 'VirtualNetworkGateways_SupportedVpnDevices': return 'skip_this_resource';
                case 'VirtualNetworkGateways_VpnDeviceConfigurationScript': return 'skip_this_resource';
                case 'VirtualNetworkGateways_StartPacketCapture': return 'skip_this_resource';
                case 'VirtualNetworkGateways_StopPacketCapture': return 'skip_this_resource';
                case 'VirtualNetworkGatewayConnections_StartPacketCapture': return 'skip_this_resource';
                case 'VirtualNetworkGatewayConnections_StopPacketCapture': return 'skip_this_resource';
                case 'VirtualNetworkGatewayConnections_GetIkeSas': return 'skip_this_resource';
                default: return false;
                }
        case 'spring_apps':
            switch (opId) {
                case 'Gateways_ListEnvSecrets': return 'skip_this_resource';
                default: return false;
            }
        case 'synapse':
            switch (opId) {
                case 'Operations_GetLocationHeaderResult': return 'skip_this_resource';
                default: return false;
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
  