---
sidebar_position: 3
---

# Introduction

### What is an API?

An API (Application Programming Interface) is a set of rules and protocols that
allows different software applications to communicate and exchange data with
each other.

### Examples of an API

- ChuckNorris 👊
- Cypress
- Find one for yourself 🎉

### The scope of API testing

The scope of API testing is to ensure that the API works as expected. This means
that the API should return the correct response for a given request. The API
should also handle errors gracefully, and return the correct error response when
an error occurs.

I.e.:

```json
{
  "error": {
    "code": "E500",
    "message": "An unexpected error occurred"
  }
}
```

Now a more helpful message:

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Input data does not meet required parameters",
    "details": {
      "field": "email",
      "reason": "Invalid email format",
      "trace_id": "req-1234-5678"
    }
}
```

Should we test the API in isolation, or should we test the API in the context of
the application that uses it?

### Key Communication Methods

| Communication Type | Description                                                       | Common Protocols                |
| :----------------- | :---------------------------------------------------------------- | :------------------------------ |
| REST API           | Stateless, uses standard HTTP methods                             | GET, POST, PUT (Update), DELETE |
| GraphQL            | Flexible query language for APIs                                  | HTTP POST requests              |
| WebSocket          | Real-time, bidirectional communication                            | WS, WSS protocols               |
| gRPC               | High-performance RPC framework                                    | HTTP/2                          |
| SOAP               | XML-based protocol for exchanging structured information (legacy) | HTTP, SMTP, TCP                 |

[!IMPORTANT] Doesn't have to be Client - Server. Could also be Server - Server.

### Common API Communication Patterns

1. **Request-Response Model**

   - Client sends a request
   - Server processes the request
   - Server sends back a response

2. **Authentication Methods**

   - API Keys
   - JWT (JSON Web Tokens)
   - OAuth 2.0 (i.e. Login with Google, Okta, ??)

### Data Exchange Formats

| Format                  | Pros                                | Cons                             |
| :---------------------- | :---------------------------------- | :------------------------------- |
| XML                     | Robust, supports complex structures | More verbose                     |
| JSON                    | Lightweight, human-readable         | Less compact than binary formats |
| Protocol Buffers (gRPC) | Compact, fast                       | Less human-readable              |

### HTTP Status Codes

HTTP status codes are used to indicate the result of an API request. Here are
some common categories:

| Status Code Range | Description   | Examples                                           |
| :---------------- | :------------ | :------------------------------------------------- |
| 2xx               | Success       | 200 OK, 201 Created                                |
| 3xx               | Redirection   | 301 Moved Permanently, 304 Not Modified            |
| 4xx               | Client Errors | 400 Bad Request, 401 Unauthorized, 404 Not Found   |
| 5xx               | Server Errors | 500 Internal Server Error, 503 Service Unavailable |

### Best Practices

- Use HTTPS for secure communication
- Implement proper error handling
- Use rate limiting
- Version your APIs
- Provide clear documentation

### Example API Call (Pseudocode)

```javascript
const response = await fetch("/users", {
  method: "GET",
  params: { id: 123 },
  headers: {
    Authorization: "Bearer token",
  },
});
```
