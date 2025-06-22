# 🛡️ API Security: JWT, OAuth, and Beyond

## 🌟 Introduction

In this afternoon session, we'll explore the critical aspects of API security,
focusing on authentication and authorization mechanisms that protect your APIs
from unauthorized access and ensure data integrity.

## 🎓 Learning Objectives

By the end of this session, you will be able to:

- Understand the fundamentals of API security
- Implement and test Basic Authentication
- Implement and test JWT-based authentication
- Work with OAuth 2.0 flows
- Identify common security vulnerabilities
- Apply security best practices in API testing

## 🔒 Security Fundamentals

### Why API Security Matters

APIs are the backbone of modern applications, making them prime targets for
attackers. Proper security implementation is crucial for:

- Protecting sensitive data
- Preventing unauthorized access
- Maintaining user privacy
- Complying with regulations (GDPR, HIPAA, etc.)

### Common Security Threats

1. **Authentication Bypass**: Unauthorized access to protected resources
2. **Injection Attacks**: SQL injection, NoSQL injection
3. **Data Exposure**: Sensitive information in responses
4. **Rate Limiting Bypass**: Abuse of API endpoints
5. **Token Hijacking**: Stealing authentication tokens

## 🔐 Basic Authentication

> **Note:** The current API does not support Basic Authentication. The examples
> below are for educational purposes only. All protected endpoints in this API
> use JWT authentication.

### What is Basic Authentication?

Basic Authentication is a simple authentication scheme built into the HTTP
protocol. It sends credentials (username and password) encoded in Base64 format
in the Authorization header.

### How Basic Auth Works

1. **Client sends credentials** in Base64 encoded format
2. **Server validates credentials** against stored user data
3. **Server responds** with success (200) or failure (401)

### Basic Auth Structure

```
Authorization: Basic base64(username:password)
```

### Testing Basic Authentication (Educational Example)

#### 1. Manual Base64 Encoding

```bash
# Encode credentials manually
echo -n "username:password" | base64
# Output: dXNlcm5hbWU6cGFzc3dvcmQ=

# Example only (not supported by this API):
# curl -X GET http://localhost:3000/protected \
#   -H "Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ="
```

#### 2. Using curl's Built-in Basic Auth

```bash
# Example only (not supported by this API):
# curl -X GET http://localhost:3000/protected \
#   -u "username:password"
```

#### 3. Testing with Environment Variables

```bash
# Example only (not supported by this API):
# export USERNAME="alice@prisma.io"
# export PASSWORD="password123"
# curl -X GET http://localhost:3000/protected \
#   -u "$USERNAME:$PASSWORD"
```

#### 4. Testing Invalid Credentials

```bash
# Example only (not supported by this API):
# curl -X GET http://localhost:3000/protected \
#   -u "alice@prisma.io:wrongpassword"
# Expected response: 401 Unauthorized
```

#### 5. Testing Missing Credentials

```bash
# Example only (not supported by this API):
# curl -X GET http://localhost:3000/protected
# Expected response: 401 Unauthorized
```

### Basic Auth Security Considerations

#### ✅ **Advantages:**

- Simple to implement
- Widely supported
- Built into HTTP protocol
- Easy to test and debug

#### ❌ **Disadvantages:**

- **Credentials sent in every request** (not secure over HTTP)
- **Base64 encoding is not encryption** (easily decoded)
- **No built-in expiration** mechanism
- **Vulnerable to man-in-the-middle attacks**
- **Credentials stored in browser history**

#### 🔒 **Security Best Practices:**

1. **Always use HTTPS** in production
2. **Implement rate limiting** to prevent brute force attacks
3. **Use strong password policies**
4. **Consider session timeouts**
5. **Log authentication attempts**

### Basic Auth vs JWT

| Feature              | Basic Auth            | JWT               |
| -------------------- | --------------------- | ----------------- |
| **Credentials sent** | Every request         | Once during login |
| **Server state**     | Stateless             | Stateless         |
| **Expiration**       | Manual implementation | Built-in          |
| **Security**         | Low (Base64 encoded)  | High (signed)     |
| **Complexity**       | Simple                | Moderate          |

### Example: Implementing Basic Auth

```bash
# 1. Test without authentication (not supported by this API)
# curl -X GET http://localhost:3000/auth/me
# Response: 401 Unauthorized

# 2. Test with Basic Auth (not supported by this API)
# curl -X GET http://localhost:3000/auth/me \
#   -u "alice@prisma.io:password123"
# Response: 200 OK with user data

# 3. Test with invalid credentials (not supported by this API)
# curl -X GET http://localhost:3000/auth/me \
#   -u "alice@prisma.io:wrongpassword"
# Response: 401 Unauthorized
```

### Basic Auth in Bruno

```javascript
// Example only (not supported by this API)
test("Basic Auth successful", function() {
  expect(response.status).to.equal(200);
  expect(response.body).to.have.property("id");
  expect(response.body).to.have.property("email");
});

test("Basic Auth failed", function() {
  expect(response.status).to.equal(401);
  expect(response.body).to.have.property("error");
});
```

## 🔑 JWT (JSON Web Tokens)

### What is JWT?

JWT is a compact, URL-safe means of representing claims to be transferred
between two parties. It consists of three parts:

- **Header**: Algorithm and token type
- **Payload**: Claims (user data, permissions, etc.)
- **Signature**: Verification signature

### JWT Structure

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTY4ODg4ODg4OCwiZXhwIjoxNjg4ODkyNDg4fQ.4Qw1Qw8v8Qw1Qw8v8Qw1Qw8v8Qw1Qw8v8Qw1Qw8v8Qw
```

**Visual breakdown:**

```
HEADER          PAYLOAD                                      SIGNATURE
eyJhbGciOiJI... . eyJpZCI6IjEyMyIsImVtYWlsI... . 4Qw1Qw8v8Qw...
   |                  |                                            |
Algorithm & type   User claims (id, email, iat, exp)         Cryptographic signature
```

### Testing JWT Authentication

#### 1. User Registration (Required First)

```bash
# Register a new user (multipart form required)
curl -X POST http://localhost:3000/auth/register \
  -F "email=user@example.com" \
  -F "password=password123" \
  -F "name=John Doe"
```

#### 2. Token Generation and Validation

```bash
# Login to get JWT token
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

#### 3. Using JWT in Requests

```bash
# Make authenticated request to get user info
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 4. Testing Token Expiration

```bash
# Test with expired token
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer EXPIRED_TOKEN"
```

#### 5. Update User Profile (Protected Endpoint)

```bash
# Update user profile with JWT token
curl -X PUT http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "New Name", "email": "newemail@example.com"}'
```

### 🛡️ JWT Security Best Practices

1. **Token Expiration**: Set reasonable expiration times (1 hour in this API)
2. **Secure Storage**: Store tokens securely (HttpOnly cookies, secure storage)
3. **Token Rotation**: Implement token refresh mechanisms
4. **Signature Verification**: Always verify token signatures
5. **Sensitive Data**: Avoid storing sensitive data in JWT payload

## 🔄 OAuth 2.0

### 🔗 OAuth 2.0 Overview

OAuth 2.0 is an authorization framework that enables applications to obtain
limited access to user accounts on HTTP services.

### 🔁 OAuth 2.0 Flows

#### 1. Authorization Code Flow (Most Secure)

```mermaid
sequenceDiagram
    participant Client
    participant Auth Server
    participant Resource Server
    participant User

    Client->>Auth Server: 1. Authorization Request
    Auth Server->>User: 2. User Login
    User->>Auth Server: 3. Grant Access
    Auth Server->>Client: 4. Authorization Code
    Client->>Auth Server: 5. Exchange Code for Token
    Auth Server->>Client: 6. Access Token
    Client->>Resource Server: 7. API Request with Token
    Resource Server->>Client: 8. Protected Resource
```

#### 1a. First-Party OAuth 2.0 Flow (No Consent Screen)

```mermaid
sequenceDiagram
    participant Client
    participant Auth Server
    participant Resource Server
    participant User

    Client->>Auth Server: 1. Authorization Request
    Auth Server->>User: 2. User Login
    Note right of Auth Server: Consent step is skipped (trusted app)
    Auth Server->>Client: 3. Authorization Code
    Client->>Auth Server: 4. Exchange Code for Token
    Auth Server->>Client: 5. Access Token
    Client->>Resource Server: 6. API Request with Token
    Resource Server->>Client: 7. Protected Resource
```

#### 2. Client Credentials Flow (Server-to-Server)

```bash
# Request access token
curl -X POST https://auth-server.com/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET"
```

### 🧪 Testing OAuth 2.0

#### 1. Authorization Request

```bash
# Redirect user to authorization server
https://auth-server.com/oauth/authorize?
  response_type=code&
  client_id=YOUR_CLIENT_ID&
  redirect_uri=YOUR_REDIRECT_URI&
  scope=read write&
  state=random_state_string
```

#### 2. Token Exchange

```bash
# Exchange authorization code for access token
curl -X POST https://auth-server.com/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code&
      code=AUTHORIZATION_CODE&
      redirect_uri=YOUR_REDIRECT_URI&
      client_id=YOUR_CLIENT_ID&
      client_secret=YOUR_CLIENT_SECRET"
```

## 🔍 Security Testing Scenarios

### 🧪 Authentication Testing

#### Test Cases:

- **Valid Credentials**: Ensure successful authentication
- **Invalid Credentials**: Verify proper error handling
- **Missing Credentials**: Check for appropriate error responses
- **Expired Tokens**: Test token expiration handling
- **Malformed Tokens**: Test with invalid token formats

#### Example Test in Bruno:

```javascript
// Test valid JWT authentication
test("Valid JWT authentication", function () {
  expect(response.status).to.equal(200);
  expect(response.body).to.have.property("id");
  expect(response.body).to.have.property("email");
});

test("Invalid JWT authentication", function () {
  expect(response.status).to.equal(401);
  expect(response.body).to.have.property("error");
});

test("Missing JWT token", function () {
  expect(response.status).to.equal(401);
  expect(response.body).to.have.property("error");
});
```

### 🛂 Authorization Testing

#### Test Cases:

- **Role-Based Access**: Test different user roles
- **Resource Ownership**: Verify users can only access their data
- **Permission Boundaries**: Test access to unauthorized resources
- **Admin Access**: Verify admin-only endpoints

### 🏷️ Security Headers Testing

#### Common Security Headers:

- `X-Frame-Options`: Prevent clickjacking
- `X-Content-Type-Options`: Prevent MIME type sniffing
- `X-XSS-Protection`: Enable XSS protection
- `Strict-Transport-Security`: Enforce HTTPS
- `Content-Security-Policy`: Control resource loading

#### Testing Security Headers:

```javascript
test("Security headers are present", function () {
  expect(response.headers).to.have.property("x-frame-options");
  expect(response.headers).to.have.property("x-content-type-options");
  expect(response.headers).to.have.property("strict-transport-security");
});
```

## 🏋️‍♂️ Hands-on Exercise: Securing the Goal Tracker API

### 🛡️ Exercise 1: JWT Implementation

1. **Set up JWT authentication** in your Goal Tracker API ✅ (Already
   implemented)
2. **Create login endpoint** that returns JWT tokens ✅ (Available at
   `/auth/login`)
3. **Protect goal endpoints** with JWT middleware (To be implemented)
4. **Test authentication flow** using Bruno

### 🔗 Exercise 2: OAuth 2.0 Integration

1. **Implement OAuth 2.0 provider** (Google, GitHub, etc.)
2. **Create OAuth callback endpoint**
3. **Test OAuth flow** from start to finish
4. **Verify token validation** and user data retrieval

### 🧪 Exercise 3: Security Testing

1. **Create comprehensive test suite** for security scenarios
2. **Test token expiration** and refresh mechanisms
3. **Verify proper error handling** for security failures
4. **Test rate limiting** and abuse prevention

## ✅ Security Best Practices Checklist

### 🔑 Authentication

- [x] Use strong password policies
- [ ] Implement multi-factor authentication (MFA)
- [x] Use secure session management (JWT)
- [ ] Implement account lockout mechanisms

### 🛂 Authorization

- [x] Follow principle of least privilege
- [ ] Implement role-based access control (RBAC)
- [x] Validate user permissions on every request
- [x] Use secure token storage

### 🔒 Data Protection

- [ ] Encrypt sensitive data in transit and at rest
- [x] Implement proper input validation
- [x] Use parameterized queries to prevent injection
- [ ] Sanitize output to prevent XSS

### 🛡️ API Security

- [ ] Use HTTPS for all communications
- [ ] Implement rate limiting
- [ ] Add security headers
- [ ] Log security events
- [ ] Regular security audits

## 🐞 Common Security Vulnerabilities to Test

### 1. Broken Authentication

- Weak password policies
- Session fixation
- Insecure password reset

### 2. Broken Authorization

- Insecure direct object references
- Missing access controls
- Privilege escalation

### 3. Data Exposure

- Sensitive data in responses
- Insecure error messages
- Information disclosure

### 4. Injection Attacks

- SQL injection
- NoSQL injection
- Command injection

## 🛠️ Tools for Security Testing

### 1. OWASP ZAP

- Automated security scanner
- API security testing
- Vulnerability assessment

### 2. Burp Suite

- Web application security testing
- API security analysis
- Manual security testing

### 3. Postman Security Testing

- Built-in security testing features
- OAuth 2.0 support
- Security header validation

### 4. Custom Security Tests

- Bruno test scripts
- Automated security checks
- Continuous security monitoring

## 🚀 Next Steps

1. **Implement security measures** in your Goal Tracker API
2. **Create comprehensive security test suite**
3. **Set up automated security scanning**
4. **Regular security audits** and penetration testing
5. **Stay updated** with security best practices

## 📚 Resources

- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [JWT.io](https://jwt.io/) - JWT debugger and documentation
- [OAuth 2.0 RFC](https://tools.ietf.org/html/rfc6749)
- [Security Headers](https://securityheaders.com/) - Security header checker

---

_Remember: Security is not a one-time implementation but an ongoing process.
Regular testing, monitoring, and updates are essential for maintaining secure
APIs._
