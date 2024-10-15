# Azure OpenAPI Doc Generator

Generates a single OpenAPI document for each Azure Resource Manager service from a set of OpenAPI specifications sourced from [__azure-rest-api-specs__](https://github.com/Azure/azure-rest-api-specs).  

This project uses [__autorest__](https://github.com/Azure/autorest) via JavaScript to emit the latest set of OpenAPI specifications for each service,  then dereferences and combines the documents into a single YAML OpenAPI specification using [__APIDevTools/json-schema-ref-parser__](https://github.com/APIDevTools/json-schema-ref-parser). 

> a complete set of specs for each service is available [here](https://github.com/stackql/stackql-azure-openapi/tree/main/openapi/3-combined)

> a set of specs for each service used to generate the `azure` and `azure_extras` `stackql` provider is available [here](https://github.com/stackql/stackql-azure-openapi/tree/main/openapi/4-tagged)  

## Usage

> use the `prereq.sh` script or the equivalent to download the latest api documentation from [__azure-rest-api-specs__](https://github.com/Azure/azure-rest-api-specs)

> use `run.sh` script or the equivalent to run all the `stackql-azure-openapi` commands in a batch

The main entrypoint to the program is:  

```bash
bin/stackql-azure-openapi
```

This can be run without any arguments to get command line usage and help.  The `stackql-azure-openapi` commands include:

- `generate` : uses `autorest` to generate initial OpenAPI3 specs for one or many services
- `dereference` : dereferences all external JSON pointers in the generated OpenAPI specs
- `combine` : combines all the generated OpenAPI specs into a single OpenAPI spec
- `tag` : replaces existing tags for operations with the stackql resource name (optional)

These commands are intended to be run in sequence with the output of each command being the input to the next.  The flow is summarized below:  

### IMAGE

[![stackql_azure_openapi](images/stackql_azure_openapi.png)](images/stackql_azure_openapi.png)

Specific details about each command are provided in the sections below.  

## `generate` command

Uses `autorest` to generate initial OpenAPI3 specs for one or many services using the `autorest` configuration data in the `readme.md` in each service specification directory from the `main` branch of the [azure-rest-api-specs](https://github.com/Azure/azure-rest-api-specs) repo.  Conceptually this would be similar to running the following command in each subdirectory of the `specification` folder:      

```bash
autorest ./resource-manager/readme.md \
--openapi-type=arm \
--output-converted-oai3
```

The output of this command is a directory structure (n-levels deep) containing OpenAPI JSON documents with references to each other (using JSON `$refs`), the union of which forms a complete specification for the service.  

To generate specs for a single service (the `compute` service in this example), run the following command:

```bash
bin/stackql-azure-openapi generate compute
```

To generate specs for all services, run the following command:

```bash
bin/stackql-azure-openapi generate
```

## `dereference` command

Takes the output from the `generated` command, enumerates all JSON documents nested at any level in the directory structure, and dereferences all JSON pointers in each document, outputting a flat structure containing a document for each generated document found for each service with no external references.  

To dereference a set of `autorest` generated specs for a single service (the `compute` service in this example), run the following command:

```bash
bin/stackql-azure-openapi dereference compute
```

To dereference specs for all services, run the following command:

```bash
bin/stackql-azure-openapi dereference
```

## `combine` command

Takes the output from the `dereference` command, and combines all the generated documents into a single OpenAPI spec, outputting a single, self contained YAML document (removing the `examples` for brevity).  

To create a single OpenAPI document for a single service (the `compute` service in this example), run the following command:

```bash
bin/stackql-azure-openapi combine compute
```

To create a single OpenAPI document for all services, run the following command:

```bash
bin/stackql-azure-openapi combine
```

## `tag` command (Optional)

Takes the output from the `combine` command, generates the stackql resource name from stemming the `operationId` for each operation, pushes this value to the beginning of the `tags` array for each operation, and outputs the resulting document.    

To update tags for a single OpenAPI document for a single service (the `compute` service in this example), run the following command:  

```bash
bin/stackql-azure-openapi tag compute
```

To tags fo all OpenAPI documents for all services, run the following command:

```bash
bin/stackql-azure-openapi tag
```

## Testing locally with `stackql`
1. download the latest `stackql` binary, for example `curl -L https://bit.ly/stackql-zip -O && unzip stackql-zip` for Linux systems
2. run the following:
```
PROVIDER_REGISTRY_ROOT_DIR="$(pwd)/openapi"
REG_STR='{"url": "file://'${PROVIDER_REGISTRY_ROOT_DIR}'", "localDocRoot": "'${PROVIDER_REGISTRY_ROOT_DIR}'", "verifyConfig": {"nopVerify": true}}'
./stackql shell --registry="${REG_STR}"
```

### Run Test Suite

from the `stackql-provider-tests` directory:

```bash
cd ../../stackql-provider-tests

# azure
sh test-provider.sh \
azure \
false \
/mnt/c/LocalGitRepos/stackql/openapi-conversion/stackql-azure-openapi/openapi \
true

# azure_extras
sh test-provider.sh \
azure_extras \
false \
/mnt/c/LocalGitRepos/stackql/openapi-conversion/stackql-azure-openapi/openapi \
true

# azure_isv
sh test-provider.sh \
azure_isv \
false \
/mnt/c/LocalGitRepos/stackql/openapi-conversion/stackql-azure-openapi/openapi \
true

# azure_stack
sh test-provider.sh \
azure_stack \
false \
/mnt/c/LocalGitRepos/stackql/openapi-conversion/stackql-azure-openapi/openapi \
true
```

# Document

```bash
sh start-stackql-server.sh
bin/stackql-azure-openapi doc azure
bin/stackql-azure-openapi doc azure_isv
bin/stackql-azure-openapi doc azure_stack
bin/stackql-azure-openapi doc azure_extras
```