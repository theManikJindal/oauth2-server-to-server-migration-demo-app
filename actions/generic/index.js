
const fetch = require('node-fetch')
const { Core } = require('@adobe/aio-sdk')
const authorize = require("@adobe/jwt-auth")

async function get_access_token_jwt(logger, params) {
  
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

async function get_access_token_oauth_s2s(logger, params) {

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

async function get_events(logger, params, access_token) {
  
  const apiEndpoint = 'https://events-va6.adobe.io/events/organizations/23294/integrations/506063/acbef0f2-d736-463d-ace8-c6037b29ddfb'
  const res = await fetch(apiEndpoint, {
    method: 'get',
    headers: {
      'x-ims-org-id': params.ORG_ID,
      'x-api-key': params.CLIENT_ID,
      'Authorization': 'Bearer ' + access_token
    }
  });
  
  return {
    statusCode: 200,
    body: await res.json()
  }
}

// main function that will be executed by Adobe I/O Runtime
async function main (params) {

  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  logger.info('Calling the main action')

  // const access_token = await get_access_token_jwt(logger, params)
  const access_token = await get_access_token_oauth_s2s(logger, params)
  
  // logger.info('access token - ' + access_token)

  return await get_events(logger, params, access_token)
}

exports.main = main