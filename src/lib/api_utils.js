/**
 * Bitwarden has a very loosely enforced API in terms of case-sensitivity
 * The API accepts any case and clients actually send a mix
 * For compatibility, we just use lowercase everywhere
 */
function normalizeBody(body) {
  const normalized = {};
  Object.keys(body).forEach((key) => {
    normalized[key.toLowerCase()] = body[key];
  });

  return normalized;
}

/**
 * Unless the Webvault runs on the same domain, it requires some custom CORS settings
 *
 * Pragma,Cache-Control are used by the revision date endpoints
 * Device-Type is used by login
 */
const CORS_HEADERS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'Content-Type,Authorization,Accept,Device-type,Pragma,Cache-Control',
};

module.exports.CORS_HEADERS = CORS_HEADERS;

function okResponse(body) {
  console.log('Success response', { body });
  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  };
}

function validationError(message) {
  console.log('Validation error', { message });
  return {
    statusCode: 400,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      ValidationErrors: {
        '': [
          message,
        ],
      },
      Object: 'error',
    }),
  };
}

function serverError(message, error) {
  console.log('Server error', { message, error });
  return {
    statusCode: 500,
    headers: CORS_HEADERS,
    body: JSON.stringify({
      Message: message,
      Object: 'error',
    }),
  };
}

module.exports.normalizeBody = normalizeBody;
module.exports.okResponse = okResponse;
module.exports.validationError = validationError;
module.exports.serverError = serverError;
