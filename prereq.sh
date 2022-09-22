# clone azure-rest-api-specs

# NOTE: you will need to set your git config to accept long paths
# git config --global core.longpaths true

if [ -d "./azure-rest-api-specs" ] 
then
    cd azure-rest-api-specs; git fsck && git gc --prune=now && git pull --verbose origin main; cd ..
else
    git clone https://github.com/Azure/azure-rest-api-specs
fi

# need to make the following amendments azure-rest-api-specs/specification/resources/resource-manager/readme.md

# ``` yaml
# openapi-type: arm
# tag: latest-all
# ```

# ``` yaml $(tag) == 'latest-all'
# input-file:
# - Microsoft.Resources/stable/2022-05-01/changes.json
# - Microsoft.Resources/stable/2021-04-01/resources.json
# - Microsoft.Resources/stable/2021-01-01/subscriptions.json

# override-info:
#   title: ResourceManagementClient
# ```