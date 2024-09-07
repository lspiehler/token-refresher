# token-refresher

Automatically refreshes an OAuth2 token and writes it to the filesystem

## Run container
```
docker run -d -ti \
--name=token-refresher \
--restart unless-stopped \
-v /token:/token \
-e AUTHURL=https://api.service.com \
-e CLIENTID=myclientid \
-e CLIENTSECRET=myclientsecret \
-e SCOPE=myscope \
-e GRANTTYPE=client_credentials \
-e TOKENPATH=/token/access_token \
lspiehler/token-refresher:latest
```