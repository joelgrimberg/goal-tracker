---
sidebar_position: 6
---

# Test scenarios

## Data variation

- Leave mandatory fields blank
- Omit mandatory fields altogether
- Pass in incorrect values
- Pass in very long values
- Pass in complex or unexpected characters (diacritics, emojis, …)

## Injection

- Try to inject JavaScript
- Try to inject SQL
- Try to inject server commands

## Authentication

If your POST endpoint is secured with authentication, try and invoke the
endpoint with:

- No token
- An invalid token
- A token that does not carry authorisation for your endpoint
- An expired token

## Data processing

- The data you sent is stored properly (please don’t just rely on an HTTP 201)
- The data you sent can be retrieved again and is represented as expected (when
  there’s an operation available to do that)
- Invalid or malicious data is properly filtered or rejected
- Unexpectedly large data volumes are handled as expected

## Error messages

- HTTP status codes returned are sensible
- Error messages in the response body are actionable
- Error messages do not reveal sensitive information (stack traces revealing
  implementation details, ‘have you tried / did you mean’ responses) - all this
  information can be used by people with malicious intent
