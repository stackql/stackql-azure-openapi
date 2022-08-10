# clone azure-rest-api-specs

if [ -d "./azure-rest-api-specs" ] 
then
    cd azure-rest-api-specs; git fsck && git gc --prune=now && git pull --verbose origin main; cd ..
else
    git clone https://github.com/Azure/azure-rest-api-specs
fi