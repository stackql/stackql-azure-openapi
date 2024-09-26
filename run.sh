# runs all stackql-azure-openapi commands in succession
# against all specifications in ./azure-rest-api-specs/specfications
# run prereq.sh first if you haven't already

# use autorest to generate raw specs for each specification
rm -rf openapi/1-autorest-generated/*
bin/stackql-azure-openapi generate --debug
bin/stackql-azure-openapi generate liftrqumulo --debug

# derefernece the raw specs and flatten the output
rm -rf openapi/2-dereferenced/*
bin/stackql-azure-openapi dereference --debug

# combine the flattened specs into a single yaml openapi spec
rm -rf openapi/3-combined/*
bin/stackql-azure-openapi combine --debug

# tag the combined specs with stackql tags

# prep tag dirs
rm -rf openapi/src/azure/v00.00.00000/services/*
rm -rf openapi/src/azure_extras/v00.00.00000/services/*
rm -rf openapi/src/azure_isv/v00.00.00000/services/*
rm -rf openapi/src/azure_stack/v00.00.00000/services/*
rm -rf openapi/src/azure/v00.00.00000/provider.yaml
rm -rf openapi/src/azure_extras/v00.00.00000/provider.yaml
rm -rf openapi/src/azure_isv/v00.00.00000/provider.yaml
rm -rf openapi/src/azure_stack/v00.00.00000/provider.yaml

bin/stackql-azure-openapi tag --debug