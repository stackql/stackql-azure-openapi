export const contactInfo = {
    name: 'StackQL Studios',
    url: 'https://stackql.io/',
    email: 'info@stackql.io'
};

export const serviceInfo = {
    //
    // Azure Stack
    //
    'azsadmin_user-subscriptions': {
        provider: 'azure_stack',
        service: 'user_subscriptions',
        title: 'AzureStack User Subscriptions',
        description: 'The AzureStack subscriptions module for the tenant users. This provides functianality view and subscribe to public offers and to manage subscriptions.'
    },
    azsadmin_backup: {
        provider: 'azure_stack',
        service: 'backup_admin',
        title: 'AzureStack Backup Management Client',
        description: 'The AzureStack Admin Backup Management Client.'
    },
    azsadmin_compute: {
        provider: 'azure_stack',
        service: 'compute_admin',
        title: 'AzureStack Compute Admin Client',
        description: 'the AzureStack Compute administrator module which provides functionality to manage compute quotas, platform images, and virtual machine extensions, as well as managed disks migration jobs to rebalance storage.'
    },
    azsadmin_containerregistry: {
        provider: 'azure_stack',
        service: 'container_registry_admin',
        title: 'AzureStack Container Registry Management Client',
        description: 'The AzureStack Admin Container Registry Management Client.'
    },
    azsadmin_containerservice: {
        provider: 'azure_stack',
        service: 'container_service_admin',
        title: 'AzureStack Container Service Admin Client',
        description: 'The AzureStack Admin Container Service Management Client.'
    },
    azsadmin_deployment: {
        provider: 'azure_stack',
        service: 'deployment_admin',
        title: 'AzureStack Deployment Admin Client',
        description: 'The AzureStack Deployment Admin Client.'
    },
    azsadmin_infrastructureinsights: {
        provider: 'azure_stack',
        service: 'infrastructure_insights_admin',
        title: 'AzureStack Infrastructure Insights Management Client',
        description: 'The AzureStack Admin Infrastructure Insights Management Client.'
    },
    azsadmin_keyvault: {
        provider: 'azure_stack',
        service: 'key_vault_admin',
        title: 'AzureStack Key Vault Management Client',
        description: 'The AzureStack KeyVault administrator module which allows administrator to view KeyVault quotas.'
    },
    azsadmin_network: {
        provider: 'azure_stack',
        service: 'network_admin',
        title: 'AzureStack Network Admin Management Client',
        description: 'The AzureStack Admin Network Management Client'
    },
    azsadmin_storage: {
        provider: 'azure_stack',
        service: 'storage_admin',
        title: 'AzureStack Storage Admin Management Client',
        description: 'The AzureStack Admin Storage Management Client.'
    },
    azsadmin_subscriptions: {
        provider: 'azure_stack',
        service: 'subscriptions_admin',
        title: 'AzureStack Subscriptions Management Client',
        description: 'The AzureStack Subscription administrator module. This module provides functionality for administrators to manage plans, offers and subscriptions'
    },
    azsadmin_azurebridge: {
        provider: 'azure_stack',
        service: 'azure_bridge_admin',
        title: 'AzureStack Azure Bridge Admin Client',
        description: 'The AzureStack AzureBridge administrator module which allows you to manage your AzureStack marketplace items.'
    },
    azsadmin_commerce: {
        provider: 'azure_stack',
        service: 'commerce_admin',
        title: 'AzureStack Commerce Management Client',
        description: 'The AzureStack Commerce administrator module which provides a way to view aggregate data usage across your AzureStack stamp.'
    },
    azsadmin_fabric: {
        provider: 'azure_stack',
        service: 'fabric_admin',
        title: 'AzureStack Fabric Admin Client',
        description: 'The AzureStack Fabric administrator module which allows administrators to view and manage infrastructure components.'
    },
    azsadmin_gallery: {
        provider: 'azure_stack',
        service: 'gallery_admin',
        title: 'AzureStack Gallery Management Client',
        description: 'The AzureStack Gallery administrator module which provides functionality to manage gallery items in the marketplace.'
    },
    azsadmin_update: {
        provider: 'azure_stack',
        service: 'update_admin',
        title: 'AzureStack Update Admin Client',
        description: 'The Azure Stack Update administrator module. In this module administrators can : List and install available updates, Resume interrupted updates, View installed updates'
    },
    azurestackhci: {
        provider: 'azure_stack',
        service: 'azure_stack_hci',
        title: 'AzureStack HCI Client',
        description: 'Run virtual machines and containers on-premises with an Azure Arc–enabled infrastructure.'
    },
    azurestack: {
        provider: 'azure_stack',
        service: 'azure_stack',
        title: 'AzureStack Client',
        description: 'Build and run hybrid apps across datacenters, edge locations, remote offices, and the cloud.'
    },
    //
    // Azure ISV
    //
    splitio: {
        provider: 'azure_isv',
        service: 'splitio',
        title: 'Split Software (Azure Native ISV Service)',
        description: 'Switch on the Split Feature Data Platform and deliver software features that matter, fast.'
    },
    'redhatopenshift_Microsoft.RedHatOpenShift_openshiftclusters': {
        provider: 'azure_isv',
        service: 'openshift_clusters',
        title: 'Azure Red Hat OpenShift (Azure Native ISV Service)',
        description: 'Deploy and scale containers on managed Red Hat OpenShift.'
    },
    oracle: {
        provider: 'azure_isv',
        service: 'oracle',
        title: 'Oracle Database Service for Azure (Azure Native ISV Service)',
        description: 'Oracle Database Service for Microsoft Azure is an Oracle-managed service for Azure customers to easily provision, access, and operate enterprise-grade Oracle Database services in Oracle Cloud Infrastructure (OCI) with a familiar Azure-like experience.'
    },
    mongocluster: {
        provider: 'azure_isv',
        service: 'mongocluster',
        title: 'MongoDB Atlas on Azure (Azure Native ISV Service)',
        description: 'Run your fully managed MongoDB workloads on Azure with MongoDB Atlas, a global developer data platform with the versatility you need to build modern and scalable applications.'
    },
    informatica: {
        provider: 'azure_isv',
        service: 'informatica',
        title: 'Informatica Intelligent Data Management Cloud (Azure Native ISV Service)',
        description: 'Empowering users to deliver value from data with the Intelligent Data Management Cloud on Microsoft.'
    },
    liftrastronomer: {
        provider: 'azure_isv',
        service: 'astro',
        title: 'Apache Airflow on Astro (Azure Native ISV Service)',
        description: 'Deploy a fully managed and seamless Apache Airflow on Astro on Azure.'
    },
    liftrqumulo: {
        provider: 'azure_isv',
        service: 'qumulo',
        title: 'Qumulo (Azure Native ISV Service)',
        description: 'Use a multi-petabyte scale, single namespace, multi-protocol file data platform with the performance, security, and simplicity to meet the most demanding enterprise workloads.'
    },
    elastic: {
        provider: 'azure_isv',
        service: 'elastic',
        title: 'Elastic (Azure Native ISV Service)',
        description: 'Build modern search experiences and maximize visibility into the health, performance, and security of your infrastructure, applications, and data.'
    },
    datadog: {
        provider: 'azure_isv',
        service: 'datadog',
        title: 'Datadog Azure Integration (Azure Native ISV Service)',
        description: 'Cloud-scale observability and security for your Azure, hybrid, or multi-cloud environment to troubleshoot quickly, increase uptime, and control costs.'
    },
    logz: {
        provider: 'azure_isv',
        service: 'logz',
        title: 'Logz.io (Azure Native ISV Service)',
        description: 'Centralize log, metric, and tracing analytics in one observability platform.'
    },
    dynatrace: {
        provider: 'azure_isv',
        service: 'dynatrace',
        title: 'Dynatrace (Azure Native ISV Service)',
        description: 'Get deep cloud observability, advanced AIOps, and continuous runtime application security.'
    },
    confluent: {
        provider: 'azure_isv',
        service: 'confluent',
        title: 'Apache Kafka® by Confluent (Azure Native ISV Service)',
        description: 'Deploy a fully managed, cloud-native Apache Kafka service.'
    },
    nginx: {
        provider: 'azure_isv',
        service: 'nginx',
        title: 'Nginx Plus (Azure Native ISV Service)',
        description: 'Deliver secure, high-performance applications by using familiar and trusted load-balancing solutions.'
    },
    newrelic: {
        provider: 'azure_isv',
        service: 'newrelic',
        title: 'NewRelic Observability (Azure Native ISV Service)',
        description: 'Get end-to-end cloud observability to analyze and troubleshoot performance of applications, infrastructure, logs, real-user monitoring and more.'
    },
    paloaltonetworks: {
        provider: 'azure_isv',
        service: 'paloaltonetworks',
        title: 'Palo Alto Networks (Azure Native ISV Service)',
        description: 'Get a next generation firewall solution integrated with Azure that you can use to protect your organization.'
    },
    databricks: {
        provider: 'azure_isv',
        service: 'databricks',
        title: 'Azure Databricks',
        description: 'Azure Databricks is an interactive workspace that integrates effortlessly with a wide variety of data stores and services.'
    },
    redhatopenshift: {
        provider: 'azure_isv',
        service: 'redhat_openshift',
        title: 'Azure Red Hat OpenShift',
        description: 'Microsoft Azure Red Hat OpenShift enables you to deploy fully managed OpenShift clusters, allowing you to maintain regulatory compliance while you stay focused on application development.'
    },
    redis: {
        provider: 'azure_isv',
        service: 'redis',
        title: 'Azure Cache for Redis',
        description: 'Azure Cache for Redis is based on the popular open-source Redis cache. It gives you access to a secure, dedicated Redis server, managed by Microsoft and accessible from any application within Azure.'
    },
    redisenterprise: {
        provider: 'azure_isv',
        service: 'redis_enterprise',
        title: 'Azure Cache for Redis Enterprise',
        description: 'Azure Cache for Redis is based on the popular open-source Redis cache. It gives you access to a secure, dedicated Redis server, managed by Microsoft and accessible from any application within Azure.'
    },
    hanaonazure: {
        provider: 'azure_isv',
        service: 'hana_on_azure',
        title: 'SAP Hana on Azure',
        description: 'SAP on Azure solutions help you optimize your enterprise resource planning (ERP) in the cloud using the security features, reliability, and scalable SAP-certified infrastructure of Azure.'
    },
    workloads: {
        provider: 'azure_isv',
        service: 'sap_workloads',
        title: 'Azure Center for SAP Solutions',
        description: 'Azure Center for SAP solutions (ACSS) is an Azure offering that makes SAP a top-level workload on Azure. You can use ACSS to deploy or manage SAP systems on Azure seamlessly. The deployment experience sets up and connects the individual SAP components on your behalf. ACSS simplifies the management of SAP systems and provides quality checks to increase the reliability of these systems on Azure.'
    },
    vmwarecloudsimple: {
        provider: 'azure_isv',
        service: 'vmware_cloud_simple',
        title: 'Azure VMware Solution by CloudSimple',
        description: 'Azure VMware Solution by CloudSimple transforms and extends VMware workloads to private, dedicated clouds on Azure in minutes. CloudSimple takes care of provisioning, managing the infrastructure, and orchestrating workloads between on-premises and Azure.'
    },
    connectedvmware: {
        provider: 'azure_isv',
        service: 'connected_vsphere',
        title: 'Azure Arc VMware Management Service API',
        description: 'Self service experience for VMware.'
    },
    vmware: {
        provider: 'azure_isv',
        service: 'vmware',
        title: 'Azure VMware Solution (AVS)',
        description: 'The Azure VMware Solution REST API allows you to manage private clouds.'
    },
    netapp: {
        provider: 'azure_isv',
        service: 'netapp',
        title: 'Azure NetApp Files',
        description: 'The Azure NetApp Files service is an enterprise-class, high-performant, metered file storage service. Besides using the Azure portal, you can also manage resources by using REST API. The REST API for the Azure NetApp Files service defines HTTP operations against the supported resources.'
    },
    //
    // Azure
    //
    verifiedid: {
        provider: 'azure',
        service: 'verifiedid',
        title: 'Microsoft Entra Verified ID',
        description: 'Start your decentralized identity journey with Microsoft Entra Verified ID—included free with any Microsoft Entra ID subscription.'
    },
    standbypool: {
        provider: 'azure',
        service: 'standbypool',
        title: 'Azure Standby Pools',
        description: 'Azure standby pools is a feature for Virtual Machine Scale Sets with Flexible Orchestration that enables faster scaling out of resources by creating a pool of pre-provisioned virtual machines ready to service your workload.'
    },
    kubernetesruntime: {
        provider: 'azure',
        service: 'kubernetesruntime',
        title: 'Microsoft Kubernetes Runtime',
        description: 'Microsoft Kubernetes Runtime.'
    },
    edgezones: {
        provider: 'azure',
        service: 'edgezones',
        title: 'Azure Edge Zones',
        description: 'Azure Edge Zones are part of the Microsoft global network and offer secure, reliable, and high-bandwidth connectivity between apps—running at the Azure Edge Zone (close to the user), and the full set of Azure services running across the larger Azure regions.'
    },
    databasewatcher: {
        provider: 'azure',
        service: 'databasewatcher',
        title: 'Database Watcher',
        description: 'Database watcher is a managed monitoring solution for database services in the Azure SQL family. It supports Azure SQL Database and Azure SQL Managed Instance.'
    },
    azurefleet: {
        provider: 'azure',
        service: 'azurefleet',
        title: 'Azure Fleet',
        description: 'Fleet cluster enables centralized management of all your clusters at scale.'
    },
    advisor: {
        provider: 'azure',
        service: 'advisor',
        title: 'Azure Advisor',
        description: 'Azure Advisor is a personalized cloud consultant that helps you follow best practices to optimize your Azure deployments.'
    },
    'containerservice_Microsoft.ContainerService_aks': {
        provider: 'azure',
        service: 'aks',
        title: 'Azure Kubernetes Service (AKS)',
        description: 'AKS manages your hosted Kubernetes environment, making it quick and easy to deploy and manage containerized applications without container orchestration expertise. It also eliminates the burden of ongoing operations and maintenance by provisioning, upgrading, and scaling resources on demand, without taking your applications offline.'
    },
    analysisservices: {
        provider: 'azure',
        service: 'analysis_services',
        title: 'Azure Analysis Services',
        description: 'Built on the proven analytics engine in Microsoft SQL Server Analysis Services, Azure Analysis Services provides enterprise-grade data modeling in the cloud.'
    },
    apicenter: {
        provider: 'azure',
        service: 'api_center',
        title: 'Azure API Center',
        description: 'Azure API Center helps you develop and maintain a structured inventory of your organizations APIs. API Center enables API discovery, reuse, and governance at scale.'
    },
    apimanagement: {
        provider: 'azure',
        service: 'api_management',
        title: 'Azure API Management',
        description: 'Azure API Management provides a REST API for performing operations on selected entities, such as users, groups, products, and subscriptions. This reference provides a guide for working with the API Management REST API, and specific reference information for each available operation, grouped by entity.'
    },
    appconfiguration: {
        provider: 'azure',
        service: 'app_configuration',
        title: 'Azure App Configuration',
        description: 'Azure App Configuration provides a service to centrally manage application settings and feature flags. Modern programs, especially programs running in a cloud, generally have many components that are distributed in nature. Spreading configuration settings across these components can lead to hard-to-troubleshoot errors during an application deployment. Use App Configuration to store all the settings for your application and secure their accesses in one place.'
    },
    web: {
        provider: 'azure',
        service: 'app_service',
        title: 'Azure App Service (Web Apps)',
        description: 'Azure App Service lets you run web apps, mobile app back ends, and API apps in Azure.'
    },
    servicenetworking: {
        provider: 'azure',
        service: 'service_networking',
        title: 'Service Networking (Application Gateway for Containers)',
        description: 'Application Gateway for Containers is an application (layer 7) load balancing and dynamic traffic management product for workloads running in a Kubernetes cluster. It extends Azures Application Load Balancing portfolio and is an offering under the Application Gateway product family.'
    },
    applicationinsights: {
        provider: 'azure',
        service: 'application_insights',
        title: 'Application Insights',
        description: 'Azure Monitor Application Insights, a feature of Azure Monitor, excels in Application Performance Management (APM) for live web applications.'
    },
    attestation: {
        provider: 'azure',
        service: 'attestation',
        title: 'Azure Attestation',
        description: 'A unified solution for remotely verifying the trustworthiness of a platform and integrity of the binaries running inside it.'
    },
    authorization: {
        provider: 'azure',
        service: 'authorization',
        title: 'Authorization',
        description: 'You use role-based access control to manage the actions users in your organization can take on resources. This set of operations enables you to define roles, assign roles to users or groups, and get information about permissions.'
    },
    automation: {
        provider: 'azure',
        service: 'automation',
        title: 'Automation',
        description: 'The Azure Automation service provides a highly reliable and scalable workflow execution engine to automate frequently repeated management tasks. The processes are automated through runbooks, which are Windows PowerShell Workflows run in the Azure Automation execution engine. You can use this API to create, update, read, and delete automation resources, including runbooks and runbook jobs. In addition you can manage assets such as variables, schedules, Windows PowerShell modules, credentials, and certificates.'
    },
    cpim: {
        provider: 'azure',
        service: 'aad_b2c',
        title: 'Azure Active Directory B2C',
        description: 'Manage the Azure resource for an Azure Active Directory B2C tenant and guestUsages resource for External Identities in Azure AD'
    },
    confidentialledger: {
        provider: 'azure',
        service: 'confidential_ledger',
        title: 'Azure Confidential Ledger',
        description: 'Microsoft Azure confidential ledger (ACL) uses the Azure Confidential Computing platform and the Confidential Consortium Framework to provide a highly secure service for managing sensitive data records.'
    },
    app: {
        provider: 'azure',
        service: 'container_apps',
        title: 'Azure Container Apps',
        description: 'Azure Container Apps allows you to run containerized applications without worrying about orchestration or infrastructure.'
    },
    'azure-kusto': {
        provider: 'azure',
        service: 'data_explorer',
        title: 'Azure Data Explorer',
        description: 'Azure Data Explorer is a fully managed data analytics service for real-time analysis on large volumes of data streaming from many sources. Azure Data Explorer REST API helps you query and manage your data in Azure Data Explorer. REST API supports the Kusto query language for queries and control commands.'
    },
    loadtestservice: {
        provider: 'azure',
        service: 'load_testing',
        title: 'Azure Load Testing',
        description: 'Azure Load Testing Preview is a fully managed load-testing service that enables you to generate high-scale load. The service simulates traffic for your applications, regardless of where theyre hosted. Developers, testers, and quality assurance (QA) engineers can use it to optimize application performance, scalability, or capacity.'
    },
    migrate: {
        provider: 'azure',
        service: 'migrate',
        title: 'Azure Migrate',
        description: 'Azure Migrate helps you to migrate to Azure. Azure Migrate provides a centralized hub to track discovery, assessment, and migration of on-premises infrastructure, applications, and data to Azure. The hub provides Azure tools for assessment and migration, as well as third-party independent software vendor (ISV) offerings.'
    },
    migrateprojects: {
        provider: 'azure',
        service: 'migrate_projects',
        title: 'Azure Migrate Projects',
        description: 'Azure Migrate helps you to migrate to Azure. Azure Migrate provides a centralized hub to track discovery, assessment, and migration of on-premises infrastructure, applications, and data to Azure. The hub provides Azure tools for assessment and migration, as well as third-party independent software vendor (ISV) offerings.'
    },
    azureintegrationspaces: {
        provider: 'azure',
        service: 'integration_environment',
        title: 'Azure Integration Environment',
        description: 'The Azure Integration Environment REST API includes operations for managing an Integration Environment resource in your Azure subscription. The Azure Integration Environment is part of Azure Integration Services unified experience, a platform that helps developers effectively manage and monitor integration resources in Azure.'
    },
    quantum: {
        provider: 'azure',
        service: 'quantum',
        title: 'Azure Quantum',
        description: 'Use Python and Q#, a language for quantum programming, to create and submit quantum programs in the Azure portal, or set up your own local development environment with the Quantum Development Kit (QDK) to write quantum programs.'
    },
    resourcegraph: {
        provider: 'azure',
        service: 'resource_graph',
        title: 'Azure Resource Graph',
        description: 'Azure Resource Graph enables you to get full visibility into your environments by providing high performance and powerful querying capability across all your resources.'
    },
    appplatform: {
        provider: 'azure',
        service: 'spring_apps',
        title: 'Azure Spring Apps',
        description: 'Azure Spring Apps provides a managed service that enables Java developers to build and run Spring-boot based microservices on Azure with no code changes.'
    },
    webpubsub: {
        provider: 'azure',
        service: 'web_pubsub',
        title: 'Azure Web PubSub',
        description: 'Azure Web PubSub is a service that enables you to build real-time messaging web applications using WebSockets and the publish-subscribe pattern. Any platform supporting WebSocket APIs can connect to the service easily, for example. web pages, mobile applications, edge devices, and so on. The service manages the WebSocket connections for you and allows up to 100K concurrent connections. It provides powerful APIs for you to manage these clients and deliver real-time messages.'
    },
    batch: {
        provider: 'azure',
        service: 'batch',
        title: 'Batch Management',
        description: 'Azure Batch enables you to run large-scale parallel and high-performance computing (HPC) applications efficiently in the cloud. Its a platform service that schedules compute-intensive work to run on a managed collection of virtual machines, and can automatically scale compute resources to meet the needs of your jobs.'
    },
    billing: {
        provider: 'azure',
        service: 'billing',
        title: 'Azure Billing',
        description: 'The Azure Billing APIs allow you to view and manage your billing details programmatically. Operation groups listed below do not support all billing accounts. Supported billing accounts are specified in the table.'
    },
    billingbenefits: {
        provider: 'azure',
        service: 'billing_benefits',
        title: 'Azure Billing Benefits',
        description: 'The Billing Benefits API gives you access to billing benefits (savings plan) operations.'
    },
    blueprint: {
        provider: 'azure',
        service: 'blueprints',
        title: 'Blueprints',
        description: 'Azure Blueprints enables the creation of an Azure native package of artifacts (resource groups, policies, role assignments, Resource Manager templates and more) that can be dynamically deployed to subscriptions to create consistent, repeatable environments.'
    },
    cdn: {
        provider: 'azure',
        service: 'cdn',
        title: 'Azure CDN',
        description: 'The Azure Content Delivery Network (CDN) caches static web content at strategically placed locations to provide maximum throughput for delivering content to users. The CDN offers developers a global solution for delivering high-bandwidth content by caching the content at physical nodes across the world.'
    },
    cognitiveservices: {
        provider: 'azure',
        service: 'cognitive_services',
        title: 'Azure Cognitive Services',
        description: 'Azure Cognitive Services enables natural and contextual interaction with tools that augment the users experiences using the power of machine-based intelligence. The operations in the Azure Cognitive Services REST API provide operations for managing your Cognitive Services accounts.'
    },
    communication: {
        provider: 'azure',
        service: 'communication',
        title: 'Azure Communication Services',
        description: 'Azure Communication Services allows you to easily add real-time multimedia voice, video, and telephony-over-IP communications features to your applications. The Communication Services client libraries also allow you to add chat and SMS functionality to your communications solutions.'
    },
    compute: {
        provider: 'azure',
        service: 'compute',
        title: 'Azure Compute',
        description: 'The Azure Compute APIs give you programmatic access to virtual machines and their supporting resources.'
    },
    consumption: {
        provider: 'azure',
        service: 'consumption',
        title: 'Azure Consumption',
        description: 'The Azure Consumption APIs give you programmatic access to cost and usage data for your Azure resources. The APIs currently only support Enterprise Enrollments, Web Direct subscriptions (with a few exceptions), and CSP Azure plan subscriptions.'
    },
    containerinstance: {
        provider: 'azure',
        service: 'container_instances',
        title: 'Azure Container Instances',
        description: 'Azure Container Instances offers the fastest and simplest way to run a container in Azure, without having to provision any virtual machines and without having to adopt a higher-level service. '
    },
    containerregistry: {
        provider: 'azure',
        service: 'container_registry',
        title: 'Azure Container Registry',
        description: 'Azure Container Registry is a managed Docker registry service for storing and managing your private Docker container images and other artifacts. Push Docker container images to a private registry as part of your development workflows. Pull images from a registry to your container deployments with orchestration tools or other Azure services.'
    },
    'cosmos-db': {
        provider: 'azure',
        service: 'cosmos_db',
        title: 'Azure Cosmos DB',
        description: 'Azure Cosmos DB is a globally distributed multi-model database that supports the document, graph, and key-value data models.'
    },
    'cost-management': {
        provider: 'azure',
        service: 'cost_management',
        title: 'Microsoft Cost Management',
        description: 'The Cost Management APIs provide the ability to explore cost and usage data via multidimensional analysis, where creating customized filters and expressions allow you to answer consumption-related questions for your Azure resources. These APIs are currently available for Azure Enterprise customers.'
    },
    customproviders: {
        provider: 'azure',
        service: 'custom_providers',
        title: 'Azure Custom Providers',
        description: 'Azure Custom Providers enable you define to custom APIs that can be used to enrich the default Azure experience.'
    },
    databox: {
        provider: 'azure',
        service: 'data_box',
        title: 'Data Box',
        description: 'Data Box data transfer products help you move data to Azure when busy networks aren’t an option. Use Data Box family of products such as Data Box, Data Box Disk, and Data Box Heavy to move large amounts of data to Azure when you’re limited by time, network availability, or costs. Move your data to Azure using common copy tools such as Robocopy. All data is AES-encrypted, and the devices are wiped clean after upload in accordance with NIST Special Publication 800-88 revision 1 standards.'
    },
    databoxedge: {
        provider: 'azure',
        service: 'data_box_edge',
        title: 'Azure Data Box Edge and Azure Data Box Gateway',
        description: 'Azure Data Box Edge and Azure Data Box Gateway are on-premises storage solutions that allow you to send the data over the network to Azure. Data Box Gateway is a virtual device based on a virtual machine provisioned in your virtualized environment or hypervisor. Data Box Edge uses a physical device supplied by Microsoft to accelerate the secure data transfer. Data Box Edge has all the capabilities of Data Box Gateway and is additionally equipped with AI-enabled edge computing capabilities that help analyze, process, or filter data as it moves to Azure.'
    },
    datacatalog: {
        provider: 'azure',
        service: 'data_catalog',
        title: 'Azure Data Catalog',
        description: 'The Data Catalog REST API is a REST-based API that provides programmatic access to Data Catalog resources to register, annotate, and search data assets programmatically. Azure Data Catalog is a cloud-based service that you can use to register and discover enterprise data assets. The service gives you capabilities that enable any user, from analysts to data scientists to developers, to register, discover, understand, and consume data assets.'
    },
    datafactory: {
        provider: 'azure',
        service: 'data_factory',
        title: 'Azure Data Factory',
        description: 'Azure Data Factory is a cloud-based data integration service that orchestrates and automates the movement and transformation of data. You can create data integration solutions using the Data Factory service that can ingest data from various data stores, transform/process the data, and publish the result data to the data stores.'
    },
    'datalake-analytics': {
        provider: 'azure',
        service: 'data_lake_analytics',
        title: 'Azure Data Lake Analytics',
        description: 'Use the Azure Data Lake Analytics REST APIs to create and manage Data Lake Analytics resources through Azure Resource Manager.'
    },
    'datalake-store': {
        provider: 'azure',
        service: 'data_lake_store',
        title: 'Azure Data Lake Storage Gen1',
        description: 'Use the Azure Data Lake Store REST APIs to create and manage Data Lake Store resources through Azure Resource Manager.'
    },
    datamigration: {
        provider: 'azure',
        service: 'data_migration',
        title: 'Azure Database Migration Service',
        description: 'Azure Database Migration Service is a fully managed service designed to enable seamless migrations from multiple database sources to Azure Data platforms with minimal downtime (online migrations).'
    },
    dataprotection: {
        provider: 'azure',
        service: 'data_protection',
        title: 'Azure Backup Data Protection Platform',
        description: 'A Backup vault, created under the Data Protection Platform of Azure Backup, is a storage entity in Azure that holds backup data for various newer workloads that Azure Backup supports, such as Azure Database for PostgreSQL servers and Azure Disks. Backup vaults make it easy to organize your backup data, while minimizing management overhead. Backup vaults are based on the Azure Resource Manager model of Azure, which provides enhanced capabilities to help secure backup data.'
    },
    recoveryservicesdatareplication: {
        provider: 'azure',
        service: 'data_replication',
        title: 'Azure Recovery Services Data Replication',
        description: 'Azure Recovery Services Data Replication provides your business with the capabilities to replicate and migrate from supported platforms (i.e., Hyper-V and VMware) to Azure Stack HCI. The data movement stays entirely on-premises and Azure Migrate is utilized as the management plane.'
    },
    datashare: {
        provider: 'azure',
        service: 'data_share',
        title: 'Azure Data Share',
        description: 'Azure Data Share is a cloud-based service that helps customers share data with other organizations. Azure Data Share provides centralized management, monitoring, and governance for sharing data from multiple Azure data sources. Using this service, you can quickly create shares that consist of multiple datasets from a variety of Azure data stores. You can invite your customers and external partners to access these shares through incremental snapshots of your data and revoke access as needed.'
    },
    riskiq: {
        provider: 'azure',
        service: 'defender',
        title: 'Microsoft Defender External Attack Surface Management',
        description: 'Microsoft Defender External Attack Surface Management (Defender EASM) continuously discovers and maps your digital attack surface to provide an external view of your online infrastructure. This visibility enables security and IT teams to identify unknowns, prioritize risk, eliminate threats, and extend vulnerability and exposure control beyond the firewall. Defender EASM leverages Microsoft’s crawling technology to discover assets that are related to your known online infrastructure, and actively scans these assets to discover new connections over time. Attack Surface Insights are generated by leveraging vulnerability and infrastructure data to showcase the key areas of concern for your organization.'
    },
    desktopvirtualization: {
        provider: 'azure',
        service: 'desktop_virtualization',
        title: 'Azure Virtual Desktop',
        description: 'Azure Virtual Desktop is a comprehensive desktop and app virtualization service running in the cloud. It is the only virtual desktop infrastructure (VDI) that delivers simplified management, multi-session Windows 10, optimizations for Microsoft 365 Apps for enterprise. Deploy and scale your Windows desktops and apps on Azure in minutes, and get built-in security and compliance features. The Desktop Virtualization APIs allow you to create and manage your Azure Virtual Desktop environment programmatically.'
    },
    devcenter: {
        provider: 'azure',
        service: 'dev_center',
        title: 'Dev Center',
        description: 'Microsoft Dev Box is a service that enables you to provide preconfigured cloud-based workstations to your users through dev centers. Developers, testers, QA professionals, and others who need to get productive quickly on new projects can self-serve multiple dev boxes customized for their workloads.'
    },
    devtestlabs: {
        provider: 'azure',
        service: 'dev_test_labs',
        title: 'Azure DevTest Labs',
        description: 'Azure DevTest Labs is a service that helps developers and testers quickly create environments in Azure while minimizing waste and controlling cost. You can test the latest version of your application by quickly provisioning Windows and Linux environments using reusable templates and artifacts. Easily integrate your deployment pipeline with DevTest Labs to provision on-demand environments. Scale up your load testing by provisioning multiple test agents, and create pre-provisioned environments for training and demos.'
    },
    deviceupdate: {
        provider: 'azure',
        service: 'device_update',
        title: 'Device Update for IoT Hub',
        description: 'Device Update for IoT Hub is a service that enables you to deploy over-the-air updates (OTA) for your IoT devices.'
    },
    dns: {
        provider: 'azure',
        service: 'dns',
        title: 'Azure DNS',
        description: 'The Microsoft Azure DNS Resource Provider REST API allows you to create and modify DNS zones and records hosted within Azure. Zones and records are managed as Azure Resources.'
    },
    elasticsan: {
        provider: 'azure',
        service: 'elastic_san',
        title: 'Elastic San',
        description: 'Azure Elastic storage area network (SAN) is Microsofts answer to the problem of workload optimization and integration between your large scale databases and performance-intensive mission-critical applications. Elastic SAN Preview is a fully integrated solution that simplifies deploying, scaling, managing, and configuring a SAN, while also offering built-in cloud capabilities like high availability.'
    },
    eventgrid: {
        provider: 'azure',
        service: 'event_grid',
        title: 'Event Grid',
        description: 'Azure Event Grid enables you to easily build applications with event-based architectures. You can publish topics to Event Grid, and subscribe to topics through Event Grid. When subscribing, you provide an endpoint to respond to the event.'
    },
    eventhub: {
        provider: 'azure',
        service: 'event_hubs',
        title: 'Azure Event Hubs',
        description: 'Azure Event Hubs is a highly scalable data ingress service that ingests millions of events per second so that you can process and analyze the massive amounts of data produced by your connected devices and applications. Once data is collected into an event hub, it can be transformed and stored using any real-time analytics provider or batching/storage adapters.'
    },
    extendedlocation: {
        provider: 'azure',
        service: 'custom_locations',
        title: 'Custom Location Service',
        description: 'As an entension of Azure location, Custom Locations provides a way for tenant administrators to use their Azure Arc enabled Kubernetes clusters as target locations for deploying Azure services instances.'
    },
    'containerservice_Microsoft.ContainerService_fleet': {
        provider: 'azure',
        service: 'fleet',
        title: 'Azure Kubernetes Fleet Manager',
        description: 'Azure Kubernetes Fleet Manager (Fleet) enables at-scale management of multiple Azure Kubernetes Service (AKS) clusters'
    },
    frontdoor: {
        provider: 'azure',
        service: 'front_door',
        title: 'Azure Front Door Service',
        description: 'Azure Front Door Service enables you to define, manage, and monitor the global routing for your web traffic by optimizing for best performance and instant global failover for high availability. With Front Door, you can transform your global (multi-region) consumer and enterprise applications into robust, high-performance personalized modern applications, APIs, and content that reach a global audience with Azure.'
    },
    graphservicesprod: {
        provider: 'azure',
        service: 'graph_services',
        title: 'Microsoft Graph Services',
        description: 'The Microsoft Graph Services API operations enable you to programmatically set up billing for metered APIs and services in Microsoft Graph.'
    },
    guestconfiguration: {
        provider: 'azure',
        service: 'guest_configuration',
        title: 'Azure Policy Guest Configuration',
        description: 'Guest Configuration definitions in Azure Policy allow you to validate settings inside virtual machines. This validation includes the configuration of the operating system, applications, or even environmental data. You can use this API to create or update a Guest Configuration, and get information about the compliance details of a virtual machine. The details include specific settings that arent compliant with the assigned configuration.'
    },
    hdinsight: {
        provider: 'azure',
        service: 'hdinsight',
        title: 'Azure HDInsight',
        description: 'Azure HDInsight is a managed, full-spectrum, open-source analytics service in the cloud for enterprises. You can use open-source frameworks such as Hadoop, Apache Spark, Apache Hive, LLAP, Apache Kafka, Apache Storm, R, and more. You can use these open-source frameworks to enable a broad range of scenarios such as extract, transform, and load (ETL), data warehousing, machine learning, and IoT.'
    },
    hybridcompute: {
        provider: 'azure',
        service: 'hybrid_compute',
        title: 'Hybrid Compute',
        description: 'Azure Arc enables you to manage servers running outside of Azure using Azure Resource Manager. Each server is represented in Azure as a hybrid compute machine resource. Once a server is managed with Azure Arc, you can deploy agents, scripts, or configurations to the machine using extensions. The Hybrid Compute API allows you to create, list, update and delete your Azure Arc enabled servers and any extensions associated with them.'
    },
    hybridkubernetes: {
        provider: 'azure',
        service: 'hybrid_kubernetes',
        title: 'Hybrid Kubernetes API',
        description: 'Hybrid Kubernetes Service allows you to manage your on-premise kubernetes clusters from azure by onboarding them to Azure Arc. The Hybrid Kubernetes API allows you to create, list, update and delete your Arc enabled kubernetes clusters.'
    },
    hybridnetwork: {
        provider: 'azure',
        service: 'hybrid_network',
        title: 'Azure Hybrid Network',
        description: 'The Azure Hybrid Network REST APIs contain two services: Azure Operator Service Manager; and Azure Network Function Manager.  Azure Operator Service Manager is an Azure service designed to assist telecom operators in managing their network services.  Azure Network Function Manager is for deploying individual network functions to your on-premises environment.'
    },
    imagebuilder: {
        provider: 'azure',
        service: 'image_builder',
        title: 'Azure Image Builder',
        description: 'Azure Image Builder is a managed service from Microsoft Azure that simplifies building custom images (a snapshot of a disk or a server that can be used to create new servers that are pre-configured with those settings). It can be used to create images in a more streamlined and automated way, rather than manually configuring them.'
    },
    iotoperationsdataprocessor: {
        provider: 'azure',
        service: 'iot_data_processor',
        title: 'IoT Data Processor',
        description: 'Azure IoT Data Processor is a configurable data processing service that can manage the complexities and diversity of industrial data. Use Data Processor to make data from disparate sources more understandable, usable, and valuable.'
    },
    iotoperationsmq: {
        provider: 'azure',
        service: 'iot_mq',
        title: 'IoT MQ',
        description: 'Azure IoT MQ is an enterprise-grade, standards-compliant MQTT Broker that is scalable, highly available and Kubernetes-native. It provides the messaging plane for Azure IoT Operations, enables bi-directional edge/cloud communication and powers event-driven applications at the edge.'
    },
    iotoperationsorchestrator: {
        provider: 'azure',
        service: 'iot_orchestrator',
        title: 'IoT Orchestrator',
        description: 'Azure IoT Orchestrator is an orchestration service that manages application workloads on Kubernetes clusters that have been Azure Arc enabled. It uses solution, target, and instance constructs to describe the desired state of a specific cluster or group of clusters. The REST APIs for IoT Orchestrator offer programmatic access to the solution, target, and instance objects in IoT Orchestrator.'
    },
    iotcentral: {
        provider: 'azure',
        service: 'iot_central',
        title: 'Azure IoT Central',
        description: 'Azure IoT Central is an IoT application platform that is highly secure, scales with your business as it grows, ensures your investments are repeatable, and integrates with your existing business apps. It reduces the burden and cost of developing, managing, and maintaining enterprise-grade IoT solutions.'
    },
    iothub: {
        provider: 'azure',
        service: 'iot_hub',
        title: 'IoT Hub',
        description: 'The REST APIs for IoT Hub offer programmatic access to the device, messaging, and job services, as well as the resource provider, in IoT Hub. You can access messaging services from within an IoT service running in Azure, or directly over the Internet from any application that can send an HTTPS request and receive an HTTPS response.'
    },
    deviceprovisioningservices: {
        provider: 'azure',
        service: 'iot_hub_device_provisioning',
        title: 'Azure IoT Hub Device Provisioning Service',
        description: 'The IoT Hub Device Provisioning Service is a helper service for IoT Hub that enables automatic device provisioning to a specified IoT hub without requiring human intervention. You can use the Device Provisioning Service to provision millions of devices in a secure and scalable manner.'
    },
    keyvault: {
        provider: 'azure',
        service: 'key_vault',
        title: 'Azure Key Vault',
        description: 'Use Key Vault to safeguard and manage cryptographic keys, certificates and secrets used by cloud applications and services.'
    },
    kubernetesconfiguration: {
        provider: 'azure',
        service: 'kubernetes_configuration',
        title: 'Azure Arc Kubernetes Configuration and Cluster Extensionsource Control Configuration Client (Microsoft.KubernetesConfiguration)',
        description: 'GitOps is the practice of declaring the desired state of Kubernetes cluster configuration (deployments, etc.) in a Git repository. GitOps Configurations enable you to declare these for Kubernetes clusters. Cluster extensions allow you to add management services like Azure Monitor, Azure Data services to your Kubernetes clusters.'
    },
    labservices: {
        provider: 'azure',
        service: 'lab_services',
        title: 'Azure Lab Services REST API.',
        description: 'Azure Lab Services enables you to easily set up and provide on-demand access to preconfigured virtual machines for your workloads: teaching a class, training professionals, or running hackathons or hands-on labs, and more. Simply input what you need in a lab and let the service automatically roll it out to your audience. Your users go to a single place to access all the VMs they are given across labs, and connect from there to learn, explore, and innovate.'
    },
    operationalinsights: {
        provider: 'azure',
        service: 'log_analytics',
        title: 'Azure Log Analytics',
        description: 'Log Analytics is a service that helps you collect and analyze data generated by resources in your cloud and on-premises environments.'
    },
    logic: {
        provider: 'azure',
        service: 'logic_apps',
        title: 'Azure Logic Apps',
        description: 'Azure Logic Apps helps you simplify and implement scalable integrations and workflows in the cloud. You can model and automate your process visually as a series of steps known as a workflow in the Logic App Designer. There are also many connectors that you can add to your logic app so you can quickly integrate across services and protocols across the cloud and on-premises. A logic app begins with a trigger, like when an account is added to Dynamics CRM, and after firing, can begin many combinations actions, conversions, and condition logic.'
    },
    machinelearning: {
        provider: 'azure',
        service: 'machine_learning',
        title: 'Machine Learning',
        description: 'Train and deploy models and manage the ML lifecycle (MLOps) with Azure Machine Learning. Tutorials, code examples, API references, and more.'
    },
    machinelearningcompute: {
        provider: 'azure',
        service: 'ml_compute',
        title: 'Machine Learning Compute',
        description: 'Train and deploy models and manage the ML lifecycle (MLOps) with Azure Machine Learning. Tutorials, code examples, API references, and more.'
    },
    machinelearningexperimentation: {
        provider: 'azure',
        service: 'ml_experimentation',
        title: 'Machine Learning Experimentation',
        description: 'Train and deploy models and manage the ML lifecycle (MLOps) with Azure Machine Learning. Tutorials, code examples, API references, and more.'
    },
    machinelearningservices: {
        provider: 'azure',
        service: 'ml_services',
        title: 'Machine Learning Services (Microsoft.MachineLearningServices)',
        description: 'Train and deploy models and manage the ML lifecycle (MLOps) with Azure Machine Learning. Tutorials, code examples, API references, and more.'
    },
    maintenance: {
        provider: 'azure',
        service: 'maintenance',
        title: 'Azure Maintenance',
        description: 'Azure frequently updates its infrastructure to improve reliability, performance, and security, or to launch new features. Most updates have zero impact on virtual machines.'
    },
    solutions: {
        provider: 'azure',
        service: 'managed_applications',
        title: 'Managed Applications',
        description: 'Azure Managed Applications enable you to offer cloud solutions that are easy for consumers to deploy and operate. The publisher implements the infrastructure and provides ongoing support. The resources are deployed to a resource group thats managed by the publisher of the app.'
    },
    dashboard: {
        provider: 'azure',
        service: 'dashboard',
        title: 'Microsoft Dashboard (Azure Managed Grafana)',
        description: 'Azure Managed Grafana is a monitoring and data visualization service. Azure Managed Grafana is built as a fully managed Azure service operated and supported by Microsoft.'
    },
    msi: {
        provider: 'azure',
        service: 'managed_identity',
        title: 'Managed Service Identity',
        description: 'Managed identities for Azure resources provides Azure services with an automatically managed identity in Azure Active Directory. You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code.'
    },
    managedservices: {
        provider: 'azure',
        service: 'managed_services',
        title: 'Azure Managed Services (Azure Delegated Resource Management)',
        description: 'Azure Managed Services enables you to delegate resources for access through an Azure Active Directory tenant.'
    },
    managementgroups: {
        provider: 'azure',
        service: 'management_groups',
        title: 'Management Groups',
        description: 'Management groups enable you to manage access, policies, and compliance for your Azure subscriptions.'
    },
    maps: {
        provider: 'azure',
        service: 'maps',
        title: 'Azure Maps',
        description: 'Azure Maps is a set of mapping and geospatial services that enable developers and organizations to build intelligent location-based experiences for applications across many different industries and use cases. Use Azure Maps to bring maps, geocoding, location search, routing, real-time traffic, geolocation, time zone information and weather data into your web, mobile and server-side solutions.'
    },
    mariadb: {
        provider: 'azure',
        service: 'maria_db',
        title: 'Azure Database for MariaDB',
        description: 'Azure Database for MariaDB provides a managed database service for app development and deployment that allows you to stand up a MariaDB database in minutes and scale on the fly - on the cloud you trust most.'
    },
    mediaservices: {
        provider: 'azure',
        service: 'media_services',
        title: 'Azure Media Services',
        description: 'Azure Media Services includes: Account Filters, Asset Filters, Assets, Content Key Policies, Jobs, Live Events, Live Outputs, Streaming Endpoints, Streaming Locators, Streaming Policies and Transforms'
    },
    mixedreality: {
        provider: 'azure',
        service: 'mixed_reality',
        title: 'Azure Mixed Reality',
        description: 'The Azure Mixed Reality REST API provides programmatic access to create, query, and delete Azure Mixed Reality resources. To perform operations on Azure Mixed Reality resources, you send HTTPS requests with a supported method: GET, POST, PUT, PATCH or DELETE to an endpoint that targets a resource collection or a specific resource. This section explains how to work with resources by using the REST API.'
    },
    mobilenetwork: {
        provider: 'azure',
        service: 'mobile_network',
        title: 'Azure Private 5G Core Mobile Network',
        description: 'Azure Private 5G Core is an Azure cloud service for deploying and managing 5G core network functions on an Azure Stack Edge device, as part of an on-premises private mobile network for enterprises. The 5G core network functions connect with standard 4G and 5G standalone radio access networks (RANs) to provide high performance, low latency, and secure connectivity for 5G Internet of Things (IoT) devices. Azure Private 5G Core gives enterprises full control and visibility of their private mobile networks.'
    },
    monitor: {
        provider: 'azure',
        service: 'monitor',
        title: 'Azure Monitor',
        description: 'Use the Azure Monitor REST API to get insights into your Azure resources using the following groups of operations.'
    },
    mysql: {
        provider: 'azure',
        service: 'mysql',
        title: 'Azure Database for MySQL',
        description: 'Azure Database for MySQL provides a managed database service for app development and deployment that allows you to stand up a MySQL database in minutes and scale on the fly - on the cloud you trust most.'
    },
    managednetwork: {
        provider: 'azure',
        service: 'managed_network',
        title: 'Managed Network (Microsoft.ManagedNetwork)',
        description: 'Managed Network'
    },
    network: {
        provider: 'azure',
        service: 'network',
        title: 'Azure Network Management Client',
        description: 'The Microsoft Azure Network management API provides a RESTful set of web services that interact with Microsoft Azure Networks service to manage your network resources. The API has entities that capture the relationship between an end user and the Microsoft Azure Networks service.'
    },
    networkfunction: {
        provider: 'azure',
        service: 'network_function',
        title: 'Azure Traffic Collector (Network Function)',
        description: 'Azure Traffic Collector service'
    },
    notificationhubs: {
        provider: 'azure',
        service: 'notification_hubs',
        title: 'Azure Notification Hubs',
        description: 'Azure Notification Hubs provide an easy-to-use and scaled-out push engine that allows you to send notifications to any platform (iOS, Android, Windows, Kindle, Baidu, etc.) from any backend (cloud or on-premises).'
    },
    networkcloud: {
        provider: 'azure',
        service: 'nexus',
        title: 'Azure Operator Nexus - Network Cloud',
        description: 'Azure Operator Nexus - Network Cloud APIs provide management of the on-premises clusters and their resources, such as, racks, bare metal hosts, virtual machines, workload networks and more.'
    },
    orbital: {
        provider: 'azure',
        service: 'orbital',
        title: 'Azure Orbital Ground Station',
        description: 'Azure Orbital Ground Station allows you to schedule contacts with spacecrafts on a pay-as-you-go basis to ingest data from the spacecraft, monitor the spacecraft health and status, or transmit commands to the spacecraft. Incoming data is delivered to your private virtual network allowing it to be processed or stored in Azure.'
    },
    peering: {
        provider: 'azure',
        service: 'peering',
        title: 'Azure Peering Service',
        description: 'Azure Peering Service is a networking service that enhances the connectivity to Microsoft cloud services such as Microsoft 365, Dynamics 365, software as a service (SaaS) services, Azure, or any Microsoft services accessible via the public internet. Microsoft has partnered with internet service providers (ISPs), internet exchange partners (IXPs), and software-defined cloud interconnect (SDCI) providers worldwide to provide reliable and high-performing public connectivity with optimal routing from the customer to the Microsoft network.'
    },
    postgresql: {
        provider: 'azure',
        service: 'postgresql',
        title: 'Azure Database for PostgreSQL',
        description: 'Azure Database for PostgreSQL provides a managed database service for app development and deployment that allows you to stand up a PostgreSQL database in minutes and scale on the fly - on the cloud you trust most.'
    },
    postgresqlhsc: {
        provider: 'azure',
        service: 'postgresql_hsc',
        title: 'DB for PostgreSql HSC',
        description: 'DB for PostgreSql HSC'
    },
    powerbidedicated: {
        provider: 'azure',
        service: 'powerbi_dedicated',
        title: 'PowerBI Dedicated',
        description: 'PowerBI Dedicated'
    },
    powerbiembedded: {
        provider: 'azure',
        service: 'powerbi_embedded',
        title: 'Power BI Embedded Azure Resource Manager',
        description: 'This API provides a RESTful set of web services that enables you to create, retrieve, update, and delete Power BI dedicated capacities.'
    },
    powerbiprivatelinks: {
        provider: 'azure',
        service: 'powerbi_privatelinks',
        title: 'PowerBI Privatelinks',
        description: 'PowerBI Privatelinks'
    },
    purview: {
        provider: 'azure',
        service: 'purview',
        title: 'Microsoft Purview Resource Provider',
        description: 'Microsoft Purview Microsoft Purview is a unified data governance service that helps you manage and govern your on-premises, multi-cloud, and software-as-a-service (SaaS) data. Easily create a holistic, up-to-date map of your data landscape with automated data discovery, sensitive data classification, and end-to-end data lineage. Empower data consumers to find valuable, trustworthy data. Manage user access to data in your estate securely and at scale.'
    },
    purviewpolicy: {
        provider: 'azure',
        service: 'purview_policy',
        title: 'Microsoft Policy Client',
        description: 'Creates a Microsoft Purview management client.'
    },
    quota: {
        provider: 'azure',
        service: 'quota',
        title: 'Azure Quota Service',
        description: 'The Azure Quota Service REST API is designed for viewing and managing quotas for Azure resource providers. A quota is the service limit or allowance set on a resource in your Azure subscription. Each Azure service defines its quotas and determines its default values.'
    },
    recoveryservices: {
        provider: 'azure',
        service: 'recovery_services',
        title: 'Recovery Services',
        description: 'A Recovery Services vault is an Azure entity that stores, manages, and orchestrates data and information for the Azure Backup service, and the Azure Site Recovery service. These services contribute to your business continuity and disaster recovery (BCDR) strategy. Backup backs up data to Azure from on-premises and Azure VMs. Site Recovery replicates, fails over, and fails back workloads running on on-premises machines and Azure VMs.'
    },
    recoveryservicesbackup: {
        provider: 'azure',
        service: 'recovery_services_backup',
        title: 'Recovery Services (Azure Backup)',
        description: 'Azure Backup contributes to your business continuity and disaster recovery (BCDR) strategy by backing up data to the Azure clouds. Use Backup to back up data on virtual machines running on-premises, and on Azure VMs.'
    },
    recoveryservicessiterecovery: {
        provider: 'azure',
        service: 'recovery_services_site_recovery',
        title: 'Recovery Services Site Recovery',
        description: 'Azure Site Recovery contributes to your business continuity and disaster recovery (BCDR) strategy by keeping apps and workloads available during outages. Site Recovery replicates on-premises and Azure workloads to a secondary location. When an outage occurs, you fail over to the secondary location. You recover apps to the primary site when it’s up and running again.'
    },
    relay: {
        provider: 'azure',
        service: 'relay',
        title: 'Azure Relay',
        description: 'Azure Relay provides cloud-enabled communication with enterprise messaging and relayed communication that helps you connect on-premises solutions with the cloud.'
    },
    fluidrelay: {
        provider: 'azure',
        service: 'fluid_relay',
        title: 'Azure Fluid Relay',
        description: 'Easily add real-time collaborative experiences to your apps with Fluid Framework.'
    },
    reservations: {
        provider: 'azure',
        service: 'reservations',
        title: 'Azure Reserved Virtual Machine Instances',
        description: 'Lower your total cost of ownership by combining Azure Reserved VM Instances rates with a pay-as-you-go subscription to manage costs across predictable and variable workloads.'
    },
    resourcehealth: {
        provider: 'azure',
        service: 'resource_health',
        title: 'Azure Resource Health',
        description: 'Resource health helps you diagnose and get support when an Azure issue impacts your resources. It informs you about the current and past health of your resources and helps you mitigate issues.'
    },
    resourcemover: {
        provider: 'azure',
        service: 'resource_mover',
        title: 'Azure Resource Mover',
        description: 'Azure Resource Mover is a free service offering that enables customers to move multiple Azure resources across regions to support their business needs.'
    },
    resources: {
        provider: 'azure',
        service: 'resources',
        title: 'Azure Resource Manager',
        description: 'Azure Resource Manager enables you to deploy and manage the infrastructure for your Azure solutions. You organize related resources in resource groups, and deploy your resources with JSON templates.'
    },
    search: {
        provider: 'azure',
        service: 'search',
        title: 'Azure AI Search (formerly known as Azure Cognitive Search) ',
        description: 'Azure AI Search (formerly known as "Azure Cognitive Search") provides secure information retrieval at scale over user-owned content in traditional and conversational search applications.'
    },
    securityinsights: {
        provider: 'azure',
        service: 'sentinel',
        title: 'Microsoft Sentinel',
        description: 'Microsoft Sentinel is a scalable, cloud-native, security information event management (SIEM), and security orchestration automated response (SOAR) solution. Microsoft Sentinel delivers intelligent security analytics and threat intelligence across the enterprise, providing a single solution for alert detection, threat visibility, proactive hunting, and threat response.'
    },
    serialconsole: {
        provider: 'azure',
        service: 'serial_console',
        title: 'Azure Serial Console',
        description: 'The Azure Serial Console REST API is available for you to use with the Azure Serial Console Resource Provider to enable, disable, and get the disabled status of Serial Console for a subscription.'
    },
    servicebus: {
        provider: 'azure',
        service: 'service_bus',
        title: 'Azure Service Bus',
        description: 'Azure Service Bus provides cloud-enabled communication with enterprise messaging and relayed communication that helps you connect on-premises solutions with the cloud.'
    },
    servicefabric: {
        provider: 'azure',
        service: 'service_fabric',
        title: 'Service Fabric',
        description: 'Service Fabric Client APIs allow managing microservices applications in a Service Fabric cluster through its management endpoint. For example, mycluster.westus.cloudapp.azure.com.'
    },
    servicefabricmanagedclusters: {
        provider: 'azure',
        service: 'service_fabric_managed_clusters',
        title: 'Service Fabric Managed Clusters',
        description: 'Service Fabric is a distributed systems platform that makes it easy to package, deploy, and manage scalable and reliable microservices.'
    },
    servicefabricmesh: {
        provider: 'azure',
        service: 'service_fabric_mesh',
        title: 'Service Fabric Mesh',
        description: 'Service Fabric Mesh Resource Manager APIs allow managing microservices applications deployed in Azure Service Fabric Mesh environment through management.azure.com.'
    },
    'service-map': {
        provider: 'azure',
        service: 'service_map',
        title: 'Service Map',
        description: 'Service Map automatically discovers application components on Windows and Linux systems and maps the communication between services. It allows you to view your servers as you think of them – as interconnected systems that deliver critical services. Service Map shows connections between servers, processes, and ports across any TCP-connected architecture with no configuration required other than installation of an agent.'
    },
    signalr: {
        provider: 'azure',
        service: 'signalr',
        title: 'Azure SignalR Service',
        description: 'Azure SignalR Service is a fully-managed service that allows developers to focus on building real-time web experiences without worrying about capacity provisioning, reliable connections, scaling, encryption or authentication.'
    },
    sql: {
        provider: 'azure',
        service: 'sql',
        title: 'Azure SQL Database',
        description: 'Build limitless, trusted, AI-ready apps on a fully managed SQL database'
    },
    sqlvirtualmachine: {
        provider: 'azure',
        service: 'sql_vm',
        title: 'Azure SQL Virtual Machine',
        description: 'The Azure SQL Virtual Machine REST API includes operations for managing Azure SQL Virtual Machine resources.'
    },
    storagemover: {
        provider: 'azure',
        service: 'storage_mover',
        title: 'Azure Storage Mover',
        description: 'Azure Storage Mover is a fully managed migration service that enables you to migrate your files and folders to Azure Storage while minimizing downtime for your workload. You can use Storage Mover for different migration scenarios such as lift-and-shift, and for cloud migrations that youll have to repeat occasionally. Azure Storage Mover also helps maintain oversight and manage the migration of all your globally distributed file shares from a single storage mover resource. The Storage Mover API allows you to create, list, update and delete your migration projects and jobs associated with them.'
    },
    storage: {
        provider: 'azure',
        service: 'storage',
        title: 'Azure Storage Resource Provider',
        description: 'The Storage Resource Provider (SRP) enables you to manage your storage account and related resources programmatically.'
    },
    storagecache: {
        provider: 'azure',
        service: 'storage_cache',
        title: 'Azure HPC Cache',
        description: 'Use Azure HPC Cache to speed up NFS file access for read-intensive high-performance computing (HPC) workloads.  By caching files in Azure, Azure HPC Cache brings the scalability of cloud computing to your existing workflow. This service can be used even for workflows where your data is stored across WAN links, such as in your local data center network-attached storage (NAS) environment.'
    },
    storageimportexport: {
        provider: 'azure',
        service: 'storage_import_export',
        title: 'Azure Import/Export service',
        description: 'Azure Import/Export service is used to securely import large amounts of data to Azure Blob storage and Azure Files by shipping disk drives to an Azure datacenter. This service can also be used to transfer data from Azure Blob storage to disk drives and ship to your on-premises sites. Data from one or more disk drives can be imported either to Azure Blob storage or Azure Files.'
    },
    storagepool: {
        provider: 'azure',
        service: 'storage_pool',
        title: 'Azure Storage Pool',
        description: 'Microsoft Azure Storage Pool allows your applications and workloads to access a group of managed disks from a single endpoint.'
    },
    storagesync: {
        provider: 'azure',
        service: 'storage_sync',
        title: 'Azure File Sync',
        description: 'Azure File Sync enables you to centralize your organizations file shares in Azure Files, while keeping the flexibility, performance, and compatibility of a Windows file server. While some users might opt to keep a full copy of their data locally, Azure File Sync additionally has the ability to transform Windows Server into a quick cache of your Azure file share. You can use any protocol thats available on Windows Server to access your data locally, including SMB, NFS, and FTPS. You can have as many caches as you need across the world.'
    },
    streamanalytics: {
        provider: 'azure',
        service: 'stream_analytics',
        title: 'Stream Analytics',
        description: 'Use the operations described in this REST API to manage Azure Stream Analytics resources through Azure Resource Manager.  All task operations in this REST API conform to the HTTP/1.1 protocol specification, and each operation returns an x-ms-request-id header that can be used to obtain information about the request. You must make sure that requests made to these resources are secure.'
    },
    subscription: {
        provider: 'azure',
        service: 'subscription',
        title: 'Subscription',
        description: 'The Azure Subscription APIs allow you to create and manage your subscriptions programmatically. The APIs currently support subscriptions that are billed to an Enterprise Agreement or a Microsoft Customer Agreement billing account.'
    },
    support: {
        provider: 'azure',
        service: 'support',
        title: 'Azure Support',
        description: 'The Azure Support REST API enables you to create and manage Azure support tickets programmatically.'
    },
    synapse: {
        provider: 'azure',
        service: 'synapse',
        title: 'Azure Synapse Analytics',
        description: 'Use the Azure Synapse Analytics REST APIs to create and manage Azure Synapse resources through Azure Resource Manager and Azure Synapse endpoints. All task operations conform to the HTTP/1.1 protocol specification and most operations return an x-ms-request-id header that can be used to obtain information about the request.'
    },
    timeseriesinsights: {
        provider: 'azure',
        service: 'time_series_insights',
        title: 'Azure Time Series Insights',
        description: 'Azure Time Series Insights provides data exploration and telemetry tools to help you improve operational analysis. Its a fully managed analytics, storage, and visualization service where you can explore and analyze billions of Internet of Things (IoT) events simultaneously.  Azure Time Series Insights gives you a global view of your data, so you can quickly validate your IoT solution and avoid costly downtime to mission-critical devices. It can help you discover hidden trends, spot anomalies, and conduct root-cause analyses in near real time.'
    },
    trafficmanager: {
        provider: 'azure',
        service: 'traffic_manager',
        title: 'Traffic Manager',
        description: 'Microsoft Azure Traffic Manager allows you to control the distribution of user traffic for service endpoints in different datacenters. Service endpoints supported by Traffic Manager include Azure VMs, Web Apps, and cloud services. You can also use Traffic Manager with external, non-Azure endpoints.'
    },
    workloadmonitor: {
        provider: 'azure',
        service: 'workload_monitor',
        title: 'Azure Workload Monitor',
        description: 'Azure Workload Monitor'
    },
    playwrighttesting: {
        provider: 'azure',
        service: 'playwrighttesting',
        title: 'Microsoft Playwright Testing service',
        description: 'Scalable end-to-end modern web app testing service'
    },
    portal: {
        provider: 'azure',
        service: 'portal',
        title: 'Microsoft Portal',
        description: 'Microsoft Portal Resource Provider'
    },
    privatedns: {
        provider: 'azure',
        service: 'private_dns',
        title: 'Azure Private DNS',
        description: 'Azure Private DNS provides a reliable and secure DNS service for your virtual networks. Azure Private DNS manages and resolves domain names in the virtual network without the need to configure a custom DNS solution.'
    },
    azureactivedirectory: {
        provider: 'azure',
        service: 'azure_active_directory',
        title: 'Azure Active Directory Client',
        description: 'Azure Active Directory Client.'
    },
    baremetalinfrastructure: {
        provider: 'azure',
        service: 'bare_metal_infrastructure',
        title: 'BareMetal Infrastructure on Azure',
        description: 'Microsoft Azure offers a cloud infrastructure with a wide range of integrated cloud services to meet your business needs. In some cases, though, you may need to run services on bare metal servers without a virtualization layer. You may need root access and control over the operating system (OS). To meet this need, Azure offers BareMetal Infrastructure for several high-value, mission-critical applications.'
    },
    cloudshell: {
        provider: 'azure',
        service: 'cloud_shell',
        title: 'Cloud Shell Client',
        description: 'Cloud Shell Client'
    },
    containerservice: {
        provider: 'azure',
        service: 'container_services',
        title: 'Container Services',
        description: 'Accelerate your containerized application development without compromising security.'
    },
    deploymentmanager: {
        provider: 'azure',
        service: 'deployment_manager',
        title: 'Azure Deployment Manager',
        description: 'Deployment Manager enables you to use safe deployment practices when deploying your service across many regions.'
    },
    devops: {
        provider: 'azure',
        service: 'devops',
        title: 'Azure DevOps',
        description: 'Azure DevOps Resource Provider'
    },
    dnsresolver: {
        provider: 'azure',
        service: 'dns_resolver',
        title: 'Dns Resolver',
        description: 'The DNS Resolver Management Client.'
    },
    domainservices: {
        provider: 'azure',
        service: 'aad_domain_services',
        title: 'Domain Services Resource Provider',
        description: 'The AAD Domain Services API.'
    },
    hybridaks: {
        provider: 'azure',
        service: 'hybrid_aks',
        title: 'Hybrid Azure Kubernetes Service (AKS)',
        description: 'Hybrid Container Services'
    },
    azuredatatransfer: {
        provider: 'azure',
        service: 'data_transfer',
        title: 'Azure Data Transfer service resource provider',
        description: 'Azure Data Transfer service resource provider.'
    },
    azurelargeinstance: {
        provider: 'azure',
        service: 'large_instances',
        title: 'Azure Large Instances',
        description: 'Azure Large Instances provides specialized, certified, and tested infrastructure for enterprise workloads that are not suited for typical virtualized cloud environments due to their need for specific architecture, certified hardware, or very large servers, offering a leading solution in this niche.'
    },
    containerstorage: {
        provider: 'azure',
        service: 'container_storage',
        title: 'Azure Container Storage',
        description: 'Manage persistent storage volumes for stateful container applications.'
    },
    deviceregistry: {
        provider: 'azure',
        service: 'device_registry',
        title: 'Azure Device Registry',
        description: 'Azure Device Registry Resource Provider.'
    },
    devopsinfrastructure: {
        provider: 'azure',
        service: 'devops_infrastructure',
        title: 'Managed DevOps Infrastructure',
        description: 'Managed DevOps Infrastructure Resource Provider.'
    },
    fist: {
        provider: 'azure',
        service: 'iot_firmware_defense',
        title: 'IoT Firmware Defense',
        description: 'The Defender for Iot Firmware Analysis SDK is your comprehensive, feature-rich toolkit for firmware analysis.'
    },
    hybridcloud: {
        provider: 'azure',
        service: 'hybrid_cloud',
        title: 'Hybrid Cloud',
        description: 'Hybrid cloud connectivity Management.'
    },
    iotspaces: {
        provider: 'azure',
        service: 'iot_spaces',
        title: 'IoT Spaces Client',
        description: 'Use this API to manage the IoTSpaces service instances in your Azure subscription.'
    },
    managednetworkfabric: {
        provider: 'azure',
        service: 'managed_network_fabric',
        title: 'Azure Network Fabric Management Service API',
        description: 'Self service experience for Azure Network Fabric API.'
    },
    mpcnetworkfunction: {
        provider: 'azure',
        service: 'mpc_network_function',
        title: 'Microsoft Mobile Packet Core Network Function',
        description: 'Mobile Packet Core Network Function Management API'
    },
    networkanalytics: {
        provider: 'azure',
        service: 'network_analytics',
        title: 'Microsoft Network Analytics',
        description: 'Microsoft Network Analytics Management API'
    },
    voiceservices: {
        provider: 'azure',
        service: 'voice_services',
        title: 'Microsoft Voice Services',
        description: 'Microsoft Voice Services Management API'
    },
    resourceconnector: {
        provider: 'azure',
        service: 'resource_connector',
        title: 'Resource Connector',
        description: 'Defines a connector that connects other resources to a resource group. Implementations of this class can let users browse resources inside a specific resource group.'
    },
    scheduler: {
        provider: 'azure',
        service: 'scheduler',
        title: 'Microsoft Scheduler',
        description: 'Microsoft Scheduler Management Client'
    },
    scvmm: {
        provider: 'azure',
        service: 'system_center_vm_manager',
        title: 'System Center VM Manager',
        description: 'The System Center Virtual Machine Manager (VMM) is part of the System Center suite used to configure, manage, and transform traditional datacenters. It helps to provide a unified management experience across on-premises, service provider, and the Azure cloud.'
    },
    security: {
        provider: 'azure',
        service: 'security',
        title: 'Microsoft Security',
        description: 'Microsoft Security Management Client'
    },
    securityandcompliance: {
        provider: 'azure',
        service: 'security_and_compliance',
        title: 'Security and Compliance',
        description: 'Security and Compliance Management Client'
    },
    servicelinker: {
        provider: 'azure',
        service: 'service_connector',
        title: 'Service Connector',
        description: 'The Service Connector service is an extension resource provider that helps you connect Azure Compute service to backing services easily.'
    },
    hardwaresecuritymodules: {
        provider: 'azure',
        service: 'hardware_security_modules',
        title: 'Microsoft Azure Hardware Security Modules (HSM)',
        description: 'Azure Cloud HSM is a single-tenant HSM solution, granting customers administrative control over a highly available HSM cluster for various functionalities like PKCS#11, TDE, SSL/TLS processing, and custom applications, while Microsoft manages service provisioning, patching, and hosting.'
    },
    hybridconnectivity: {
        provider: 'azure',
        service: 'hybrid_connectivity',
        title: 'Hybrid Connectivity',
        description: 'Hybrid Connectivity Management Client'
    },
    hybriddatamanager: {
        provider: 'azure',
        service: 'hybrid_data_manager',
        title: 'Hybrid Data Manager',
        description: 'Microsoft Azure Hybrid Data management client'
    },
    iotsecurity: {
        provider: 'azure',
        service: 'iot_security',
        title: 'IoT Security',
        description: 'Microsoft IoTSecurity Management Client'
    },
    operationsmanagement: {
        provider: 'azure',
        service: 'operations_management',
        title: 'Operations Management',
        description: 'Operations Management Client'
    },
    storageactions: {
        provider: 'azure',
        service: 'storageactions',
        title: 'Storage Actions Management Client',
        description: 'The Azure Storage Actions Management API.'
    },
    portalservices: {
        provider: 'azure',
        service: 'portal_services',
        title: 'Portal Services',
        description: 'Allows creation and deletion of Azure portal extensions.'
    },
    scom: {
        provider: 'azure',
        service: 'scom',
        title: 'Azure API for managing SCOM managed instances and monitored resources.',
        description: 'Azure Monitor Operations Manager Managed Instance (SCOM MI) management APIs'
    },
    securitydevops: {
        provider: 'azure',
        service: 'security_devops',
        title: 'Microsoft Security DevOps',
        description: 'REST APIs for Defender for DevOps'
    },
    sphere: {
        provider: 'azure',
        service: 'sphere',
        title: 'Azure Sphere Provider Client',
        description: 'Azure Sphere resource management API.'
    },
    providerhub: {
        provider: 'azure',
        service: 'provider_hub',
        title: 'Microsoft Azure Provider Hub',
        description: 'Resource Provider as a Service management client.'
    },
    softwareplan: {
        provider: 'azure',
        service: 'software_plan',
        title: 'Software Plan',
        description: 'Software Plan Management Client'
    },
    adhybridhealthservice: {
        provider: 'azure',
        service: 'ad_hybrid_health_service',
        title: 'AD Hybrid Health Service',
        description: 'REST APIs for Azure Active Directory Connect Health'
    },
    adp: {
        provider: 'azure',
        service: 'autonomous_dev_platform',
        title: 'Autonomous Development Platform',
        description: 'Microsoft Autonomous Development Platform'
    },
    alertsmanagement: {
        provider: 'azure',
        service: 'alerts_management',
        title: 'Azure Alerts Management Service Resource Provider',
        description: 'APIs for Azure alert processing rules CRUD operations.'
    },
    automanage: {
        provider: 'azure',
        service: 'automanage',
        title: 'Azure Automanage',
        description: 'Effortless automation of cloud and on-premises infrastructure.'
    },
    azurearcdata: {
        provider: 'azure',
        service: 'azure_arc_data',
        title: 'AzureArcData Management Client',
        description: 'The AzureArcData management API provides a RESTful set of web APIs to manage Azure Data Services on Azure Arc Resources.'
    },
    azuredata: {
        provider: 'azure',
        service: 'azure_data',
        title: 'AzureData Management Client',
        description: 'The AzureData management API provides a RESTful set of web APIs to manage Azure Data Resources.'
    },
    blockchain: {
        provider: 'azure',
        service: 'blockchain',
        title: 'Blockchain Management Client',
        description: 'REST API for Azure Blockchain Service'
    },
    botservice: {
        provider: 'azure',
        service: 'bot_service',
        title: 'Azure Bot Service',
        description: 'Azure Bot Service is a platform for creating smart conversational agents.'
    },
    changeanalysis: {
        provider: 'azure',
        service: 'change_analysis',
        title: 'Azure Change Analysis Management Client',
        description: 'Azure Change Analysis Management Client'
    },
    customerlockbox: {
        provider: 'azure',
        service: 'customer_lockbox',
        title: 'Customer Lockbox for Microsoft Azure',
        description: 'Most operations, support, and troubleshooting performed by Microsoft personnel and sub-processors do not require access to customer data. In those rare circumstances where such access is required, Customer Lockbox for Microsoft Azure provides an interface for customers to review and approve or reject customer data access requests. It is used in cases where a Microsoft engineer needs to access customer data, whether in response to a customer-initiated support ticket or a problem identified by Microsoft.'
    },
    devspaces: {
        provider: 'azure_extras',
        service: 'dev_spaces',
        title: 'Dev Spaces Management',
        description: 'Dev Spaces REST API'
    },
    digitaltwins: {
        provider: 'azure',
        service: 'digital_twins',
        title: 'Azure Digital Twins Management Client',
        description: 'Azure Digital Twins Client for managing DigitalTwinsInstance.'
    },
    dnc: {
        provider: 'azure',
        service: 'delegated_network',
        title: 'Microsoft Delegated Network Controller (DNC)',
        description: 'DNC web api provides way to create, get and delete dnc controller'
    },
    engagementfabric: {
        provider: 'azure',
        service: 'engagement_fabric',
        title: 'Engagement Fabric',
        description: 'Engagement Fabric Management Client'
    },
    videoanalyzer: {
        provider: 'azure',
        service: 'video_analyzer',
        title: 'Azure Video Analyzer',
        description: 'Azure Video Analyzer resource provider API definition.'
    },
    //
    // Azure Extras
    //
    mobilepacketcore: {
        provider: 'azure_extras',
        service: 'mobilepacketcore',
        title: 'Azure Operator 5G Core',
        description: 'Modernize your network with a flexible, scalable 5G mobile packet core.'
    },
    codesigning: {
        provider: 'azure_extras',
        service: 'codesigning',
        title: 'Trusted Signing',
        description: 'Trusted Signing (formerly Azure Code Signing) is a fully managed service that facilitates app signing for developers.'
    },
    appcomplianceautomation: {
        provider: 'azure_extras',
        service: 'app_compliance_automation',
        title: 'App Compliance Automation Tool for Microsoft 365',
        description: 'App Compliance Automation Tool for Microsoft 365 (ACAT) is a service in Azure portal that helps simplify the compliance journey for any app that consumes Microsoft 365 customer data and is published via Partner Center. Its an application-centric compliance automation tool that helps you complete Microsoft 365 Certification with greater ease and convenience'
    },
    agrifood: {
        provider: 'azure_extras',
        service: 'ag_food_platform',
        title: 'Azure Data Manager for Agriculture',
        description: 'Azure Data Manager for Agriculture helps enable a more sustainable future and a more productive agriculture industry by empowering organizations to drive innovation through insight, reduce their environmental impact, optimize agriculture operations, and build that trust rooted in transparency.'
    },
    vi: {
        provider: 'azure_extras',
        service: 'video_indexer',
        title: 'Azure Video Indexer',
        description: 'Azure Video Indexer (formerly Azure Video Analyzer for Media) is a cloud application, part of Azure Applied AI Services, built on Azure Media Services and Azure Cognitive Services (such as the Face, Translator, Computer Vision, and Speech). It enables you to extract the insights from your videos using Azure Video Indexer video and audio models.'
    },
    chaos: {
        provider: 'azure_extras',
        service: 'chaos',
        title: 'Azure Chaos Studio',
        description: 'Azure Chaos Studio is a managed service for improving resilience by injecting faults into your Azure applications. Running controlled fault injection experiments against your applications, a practice known as chaos engineering, helps you to measure, understand, and improve resilience against real-world incidents, such as a region outages or application failures causing high CPU utilization on a VM.'
    },
    edgeorder: {
        provider: 'azure_extras',
        service: 'edge_order',
        title: 'Azure Edge Hardware Center',
        description: 'Azure Edge Hardware Center is an Azure service that lets you order a variety of first party Azure hardware and discover third party hardware offered by our partners. Edge Hardware Center lets you see and track all your order related information at one place.'
    },
    edgeorderpartner: {
        provider: 'azure_extras',
        service: 'edge_order_partner',
        title: 'Azure Edge Order Partner',
        description: 'Azure Edge Hardware Center is an Azure service that lets you order a variety of first party Azure hardware and discover third party hardware offered by our partners. Edge Hardware Center lets you see and track all your order related information at one place.'
    },
    education: {
        provider: 'azure_extras',
        service: 'education',
        title: 'Education',
        description: 'The Education API includes operations to manage Labs deployed through the Education Hub. These Labs are designed to allow for distribution of credit and limiting of spend for individual subscriptions in a classroom environment.'
    },
    healthcareapis: {
        provider: 'azure_extras',
        service: 'healthcare',
        title: 'Azure Health Data Services & API for FHIR',
        description: 'Azure Health Data Services is a set of managed API services based on open standards and frameworks that enable workflows to improve healthcare and offer scalable and secure healthcare solutions.'
    },
    help: {
        provider: 'azure_extras',
        service: 'help',
        title: 'Azure Help API',
        description: 'By using Help API, you can get access to insight diagnostics, Troubleshooters, and other powerful solutions for your Azure resource and subscription. These solutions are curated by Azure engineers that will expedite your troubleshooting experiences across Billing, Subscription Management and technical issues.'
    },
    recommendationsservice: {
        provider: 'azure_extras',
        service: 'intelligent_recommendations',
        title: 'Azure Intelligent Recommendations',
        description: 'Azure Intelligent Recommendations democratizes AI and machine learning recommendations through a codeless and powerful experience powered by the same technology that fuels Xbox, Microsoft 365, and Microsoft Azure. Businesses can now provide relevant discovery for customers with this new, innovative AI for personalization and recommendations.'
    },
    intune: {
        provider: 'azure_extras',
        service: 'intune',
        title: 'Azure Intune',
        description: 'Azure Intune provides mobile device management, mobile application management, and PC management capabilities from the cloud.'
    },
    edgemarketplace: {
        provider: 'azure_extras',
        service: 'edge_marketplace',
        title: 'Edge Market Place',
        description: 'Edge Market Place Resource Provider management.'
    },
    professionalservice: {
        provider: 'azure_extras',
        service: 'professional_services',
        title: 'Professional Services',
        description: 'Marketplace Professional Service Offers'
    },
    marketplace: {
        provider: 'azure_extras',
        service: 'marketplace',
        title: 'Azure Marketplace',
        description: 'Microsoft Azure Marketplace Catalog provides REST APIs to browse, view and search Azure Marketplace and AppSource offerings.'
    },
    marketplacecatalog: {
        provider: 'azure_extras',
        service: 'marketplace_catalog',
        title: 'Azure Marketplace Catalog',
        description: 'Marketplace Catalog'
    },
    marketplacenotifications: {
        provider: 'azure_extras',
        service: 'marketplace_notifications',
        title: 'Marketplace Notifications',
        description: 'Marketplace Notifications'
    },
    marketplaceordering: {
        provider: 'azure_extras',
        service: 'marketplace_ordering',
        title: 'Marketplace Ordering',
        description: 'The MarketplaceCommerce API (MPC, also known as StoreApi) is used for purchases of third-party Virtual Machines (VM), Managed Applications (MA), and Developer Services.'
    },
    testbase: {
        provider: 'azure_extras',
        service: 'test_base',
        title: 'Test Base for Microsoft 365',
        description: 'Intelligent application testing from anywhere.'
    },
    visualstudio: {
        provider: 'azure_extras',
        service: 'visual_studio',
        title: 'Visual Studio Resource Provider Client',
        description: 'Use these APIs to manage Visual Studio Team Services resources through the Azure Resource Manager. All task operations conform to the HTTP/1.1 protocol specification and each operation returns an x-ms-request-id header that can be used to obtain information about the request. You must make sure that requests made to these resources are secure. For more information, see https://docs.microsoft.com/en-us/rest/api/index.'
    },
    m365securityandcompliance: {
        provider: 'azure_extras',
        service: 'm365_security_and_compliance',
        title: 'M365 Security and Compliance',
        description: 'Microsoft 365 Security and Compliance Assessment secures your business operation by providing key insights to help you establish the right processes'
    },
    managementpartner: {
        provider: 'azure_extras',
        service: 'management_partner',
        title: 'Management Partner',
        description: 'The Azure Ace Provisioning ManagementPartner Api is a service used for managing Azure Compute Environment (ACE) provisioning, enabling efficient and advanced management of Azure cloud resources.'
    },
    storSimple1200Series: {
        provider: 'azure_extras',
        service: 'storsimple_1200_series',
        title: 'Azure StorSimple 8000/1200 Series',
        description: 'Azure StorSimple 8000/1200 Series'
    },
    storsimple8000series: {
        provider: 'azure_extras',
        service: 'storsimple_8000_series',
        title: 'Azure StorSimple 8000 Series',
        description: 'Azure StorSimple 8000 Series'
    },
    communitytraining: {
        provider: 'azure_extras',
        service: 'community_training',
        title: 'Community Training',
        description: 'An Azure powered platform to enable learning for everyone, everywhere'
    },
    addons: {
        provider: 'azure_extras',
        service: 'addons',
        title: 'Microsoft Addons',
        description: 'The service for managing third party addons.'
    },
    oep: {
        provider: 'azure_extras',
        service: 'open_energy_platform',
        title: 'Open Energy Platform Management Service',
        description: 'Open Energy Platform Management Service APIs'
    },
    offazurespringboot: {
        provider: 'azure_extras',
        service: 'off_azure_springboot',
        title: 'Off Azure Spring Boot',
        description: 'The Microsoft.OffAzureSpringBoot Rest API spec.'
    },
    syntex: {
        provider: 'azure_extras',
        service: 'syntex',
        title: 'Microsoft Syntex',
        description: 'Microsoft Syntex is a content understanding, processing, and compliance service that uses intelligent document processing, content artificial intelligence (AI), and advanced machine learning to automatically and thoughtfully find, organize, and classify documents in your SharePoint libraries, Microsoft Teams, OneDrive for Business, and Exchange.'
    },
    EnterpriseKnowledgeGraph: {
        provider: 'azure_extras',
        service: 'enterprise_knowledge_graph',
        title: 'Azure Enterprise Knowledge Graph Service',
        description: 'Azure Enterprise Knowledge Graph Service is a platform for creating knowledge graphs at scale.'
    },
    powerplatform: {
        provider: 'azure_extras',
        service: 'power_platform',
        title: 'Microsoft Power Platform',
        description: 'Microsoft Power Platform is a line of business intelligence, app development, and app connectivity software applications. Microsoft developed the Power Fx low-code programming language for expressing logic across the Power Platform. It also provides integrations with GitHub and Teams among other apps.'
    },
    commerce: {
        provider: 'azure_extras',
        service: 'commerce',
        title: 'Dynamics 365 Commerce',
        description: 'Dynamics 365 Commerce Management Client'
    },
    'customer-insights': {
        provider: 'azure_extras',
        service: 'customer_insights',
        title: 'Customer Insights Management Client',
        description: 'The Azure Customer Insights management API provides a RESTful set of web services that interact with Azure Customer Insights service to manage your resources. The API has entities that capture the relationship between an end user and the Azure Customer Insights service.'
    },
    developerhub: {
        provider: 'azure_extras',
        service: 'developer_hub',
        title: 'Developer Hub Service Client',
        description: 'The AKS Developer Hub Service Client'
    },
    dfp: {
        provider: 'azure_extras',
        service: 'dyn365_fraud_protection',
        title: 'Microsoft Dynamics365 Fraud Protection',
        description: 'DFP Web API provides a RESTful set of web services that enables users to create, retrieve, update, and delete DFP instances'
    },
    healthbot: {
        provider: 'azure_extras',
        service: 'health_bot',
        title: 'Health Bot',
        description: 'A managed service purpose-built for development of virtual healthcare assistants.'
    },
    saas: {
        provider: 'azure_extras',
        service: 'saas',
        title: 'Microsoft SaaS',
        description: 'Microsoft SaaS Management Client'
    },
    windowsesu: {
        provider: 'azure_extras',
        service: 'windows_extended_security_updates',
        title: 'Windows Extended Security Updates',
        description: 'Windows Extended Security Updates'
    },
    windowsiot: {
        provider: 'azure_extras',
        service: 'windows_iot',
        title: 'Windows for IoT',
        description: 'Windows for IoT is a member of the Windows family that brings enterprise-class power, security, and manageability to the Internet of Things. It uses Windows embedded experience, ecosystem and cloud connectivity, allowing organizations to create their Internet of Things with secure devices that can be quickly provisioned, easily managed, and seamlessly connected to an overall cloud strategy.'
    },
}
