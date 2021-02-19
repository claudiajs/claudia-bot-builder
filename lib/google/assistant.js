const { ActionsSdkApp } = require('actions-on-google');
const expressMockery = require('node-mocks-http');

function getAssistant(request) {

    // Prep the request and response.
  var mockRequest = expressMockery.createRequest({
    body: request.body
  });
  
  var mockResponse = expressMockery.createResponse();
  
    // We need this monkey patch because node-mocks-http doesn't have the append.
  mockResponse['append'] = (header, value) => {
    console.log('Google SDK added a header: "' + header + '": "' + value + '"');
  };
  
    // Feed the request/response to the assistant SDK
  return new ActionsSdkApp({ request: mockRequest, response: mockResponse });
}

module.exports = getAssistant;