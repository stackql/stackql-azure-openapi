# clone azure-rest-api-specs

if [ -d "./azure-rest-api-specs" ] 
then
    cd azure-rest-api-specs; git fsck && git gc --prune=now && git pull --verbose origin main; cd ..
else
    git clone https://github.com/Azure/azure-rest-api-specs
fi

# convert all specs to openapi3



# deference and consolidate all specs



# remove unused fields