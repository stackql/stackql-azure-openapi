# clone azure-rest-api-specs

# NOTE: you will need to set your git config to accept long paths
git config --global core.longpaths true

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

# Define the file path
FILE="/mnt/c/LocalGitRepos/stackql/openapi-conversion/stackql-azure-openapi/azure-rest-api-specs/specification/resources/resource-manager/readme.md"

# Define the search pattern and the replacement text
SEARCH_PATTERN='``` yaml
openapi-type: arm
tag: package-2022-12
```'

REPLACEMENT_TEXT='``` yaml
openapi-type: arm
tag: latest-all
```

``` yaml $(tag) == "latest-all"
input-file:
- Microsoft.Resources/stable/2022-05-01/changes.json
- Microsoft.Resources/stable/2021-04-01/resources.json
- Microsoft.Resources/stable/2021-01-01/subscriptions.json

override-info:
  title: ResourceManagementClient
```'

# Use awk to replace the text
awk -v search="$SEARCH_PATTERN" -v replace="$REPLACEMENT_TEXT" '
BEGIN { found=0 }
/^``` yaml$/ { block=1 }
/^```$/ && block { block=0; found=1; print replace; next }
!block && found { found=0 }
block { next }
{ print }
' "$FILE" > "${FILE}.tmp" && mv "${FILE}.tmp" "$FILE"

# Inform the user that the operation is complete
echo "The specified text has been replaced in $FILE"
