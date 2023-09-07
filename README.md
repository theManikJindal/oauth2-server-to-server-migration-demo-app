
## Service Account (JWT)

```js
async function get_access_token(logger, params) {
  
  const config = {
    clientId: params.CLIENT_ID,
    clientSecret: params.CLIENT_SECRET,
    technicalAccountId: params.TECHNICAL_ACCOUNT_ID,
    orgId: params.ORG_ID,
    metaScopes: JSON.parse(params.META_SCOPES),
    privateKey: params.PRIVATE_KEY
  };

  // logger.info('config object - ' + JSON.stringify(config))
  const res = await authorize(config)
  // logger.info(JSON.stringify(res))
  return res.access_token
}
```

## OAuth Server to Server

```conf
SCOPES=adobeio_api,openid,read_client_secret,AdobeID,read_organizations,additional_info.roles,manage_client_secrets,additional_info.projectedProductContext

```

```js
async function get_access_token(logger, params) {

  logger.info("fetching oauth2 access token")

  const request_body = 'grant_type=client_credentials'
                + '&client_id=' + params.CLIENT_ID
                + '&client_secret=' + params.CLIENT_SECRET
                + '&scope=' + params.SCOPES

  const res = await fetch('https://ims-na1.adobelogin.com/ims/token/v3', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: request_body
  });

  const response_body = (await res.json())
  // logger.info(JSON.stringify(response_body))
  return response_body.access_token
}
```