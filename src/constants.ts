export const AUTH_PATH = '/auth';
export const CDRS_PATH = '/cdrs';
export const DETAILS_URI = '/details';
export const SUMMARY_URI = '/summary';
export const LOGS_URI = '/logs';
export const API_ROOT = '/';
export const DOCS_ROOT = '/docs';

// Swagger/OpenAPI info
export const SWAGGER_OPENAPI = '3.0.0';
export const SWAGGER_TITLE = 'ATS CDR API';
export const SWAGGER_VERSION = '1.0.0';
export const SWAGGER_DESCRIPTION =
  'API documentation for CDR processing service';
export const SWAGGER_APIS_GLOB = './src/routes/*.ts';

// Log messages
export const LOG_AUTH_SUCCESS = 'Authenticated';
export const LOG_AUTH_NO_TOKEN = 'Token is null after authentication';
export const LOG_AUTH_FAILED = 'Authentication failed';
export const LOG_STREAM_STARTED = 'Streaming started';
export const LOG_STREAM_ERROR = 'Stream error';
export const LOG_STREAM_ENDED = 'Stream ended';
export const LOG_INVALID_CDR = 'Invalid CDR dropped';
export const LOG_PARSE_STORE_ERROR = 'Parse/store error';

// HTTP‐logging options
export const LOG_HTTP_MSG = '{{req.method}} {{req.url}}';
export const LOG_SKIP_PREFIX = '/docs/';

// Pagination params
export const QUERY_PARAM_PAGE = 'page';
export const QUERY_PARAM_PAGE_SIZE = 'pageSize';
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 50;

// HTTP error messages
export const ERR_PAGE_INVALID = 'page must be a positive integer';
export const ERR_PAGE_SIZE_INVALID = 'pageSize must be a positive integer';
export const ERR_CUST_ID_INVALID = 'cust_id must be a number';
export const ERR_LIMIT_INVALID = 'limit must be a positive integer';
export const ERR_INTERNAL_SERVER = 'Internal Server Error';
export const ERR_INVALID_REQUEST = 'Invalid request parameters';
export const ERROR_NOT_FOUND = 'Not Found';

// Error messages
export const ERR_TOKEN_NULL = 'Token is null after authentication';
export const ERR_AUTH_FAILED = 'Authentication failed';

// Streaming init
export const STREAM_INIT_ERROR = 'Failed to init real-time stream';
