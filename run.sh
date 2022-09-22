# runs all stackql-azure-openapi commands in succession
# against all specifications in ./azure-rest-api-specs/specfications
# run prereq.sh first if you haven't already

# use autorest to generate raw specs for each specification
bin/stackql-azure-openapi generate

# derefernece the raw specs and flatten the output
bin/stackql-azure-openapi dereference

# combine the flattened specs into a single yaml openapi spec
bin/stackql-azure-openapi combine

# tag the combined specs with stackql tags
bin/stackql-azure-openapi tag