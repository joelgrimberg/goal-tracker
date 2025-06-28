---
sidebar_position: 4
---

# Mocking, Stubbing & Intercepts

## Understanding Network Control

Cypress provides powerful tools to control and manipulate network requests, allowing you to create reliable and fast tests by eliminating dependencies on external services.

### Why Mock Network Requests?

1. **Speed**: Tests run faster without waiting for real API calls
2. **Reliability**: Tests don't fail due to external service issues
3. **Control**: You can test different scenarios (success, error, slow responses)
4. **Isolation**: Tests are independent of external dependencies

## Key Concepts

### Mocking vs Stubbing vs Intercepting

| Term | Definition | Use Case |
|------|------------|----------|
| **Mocking** | Creating fake implementations of functions/modules | Unit testing, replacing complex logic |
| **Stubbing** | Replacing real functions with simplified versions | Replacing external dependencies |
| **Intercepting** | Capturing and modifying network requests | API testing, response manipulation |

## Network Interception with `cy.intercept()`

### Basic Interception

```javascript
// Intercept all GET requests to /api/goals
cy.intercept('GET', '/api/goals').as('getGoals')

// Visit the page that triggers the request
cy.visit('/goals')

// Wait for the intercepted request
cy.wait('@getGoals')

// Assert on the response
cy.get('@getGoals').its('response.statusCode').should('eq', 200)
```

### Intercepting with Custom Response

```javascript
// Intercept and return custom data
cy.intercept('GET', '/api/goals', {
  statusCode: 200,
  body: [
    { id: 1, title: 'Learn Cypress', status: 'active' },
    { id: 2, title: 'Master Testing', status: 'completed' }
  ]
}).as('getGoals')

cy.visit('/goals')
cy.wait('@getGoals')
```

### Intercepting Different HTTP Methods

```javascript
// POST request
cy.intercept('POST', '/api/goals').as('createGoal')

// PUT request
cy.intercept('PUT', '/api/goals/*').as('updateGoal')

// DELETE request
cy.intercept('DELETE', '/api/goals/*').as('deleteGoal')
```

## Advanced Interception Techniques

### Dynamic Response Based on Request

```javascript
cy.intercept('POST', '/api/goals', (req) => {
  // Modify the request
  req.body.title = req.body.title + ' (Modified)'
  
  // Send the request and modify the response
  req.reply((res) => {
    res.body.id = 999
    res.body.createdAt = new Date().toISOString()
  })
}).as('createGoal')
```

### Error Scenarios

```javascript
// Simulate server error
cy.intercept('GET', '/api/goals', {
  statusCode: 500,
  body: { error: 'Internal Server Error' }
}).as('getGoalsError')

// Simulate network timeout
cy.intercept('GET', '/api/goals', {
  forceNetworkError: true
}).as('networkError')
```

### Delayed Responses

```javascript
// Simulate slow API response
cy.intercept('GET', '/api/goals', {
  statusCode: 200,
  body: [],
  delay: 2000 // 2 seconds delay
}).as('slowGetGoals')
```

## Stubbing Functions

### Stubbing with `cy.stub()`

```javascript
// Stub a function
const createGoalStub = cy.stub().returns({ id: 123, title: 'Stubbed Goal' })

// Use the stub in your test
cy.window().then((win) => {
  win.createGoal = createGoalStub
})

// Verify the stub was called
cy.window().then((win) => {
  expect(win.createGoal).to.be.called
})
```

### Stubbing with `cy.spy()`

```javascript
// Spy on a function (monitor calls without changing behavior)
const saveGoalSpy = cy.spy()

cy.window().then((win) => {
  win.saveGoal = saveGoalSpy
})

// Verify the spy was called with specific arguments
cy.window().then((win) => {
  expect(win.saveGoal).to.be.calledWith({ title: 'Test Goal' })
})
```

## Practical Examples for Goal Tracker

### Testing Goal Creation

```javascript
describe('Goal Creation', () => {
  it('should create a goal successfully', () => {
    // Intercept the API call
    cy.intercept('POST', '/api/goals', {
      statusCode: 201,
      body: {
        id: 1,
        title: 'Learn Cypress',
        description: 'Master end-to-end testing',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z'
      }
    }).as('createGoal')

    // Perform the action
    cy.visit('/goals/new')
    cy.get('[data-testid=goal-title]').type('Learn Cypress')
    cy.get('[data-testid=goal-description]').type('Master end-to-end testing')
    cy.get('[data-testid=save-goal]').click()

    // Wait for the API call
    cy.wait('@createGoal')

    // Verify the response
    cy.get('@createGoal').its('request.body').should('deep.equal', {
      title: 'Learn Cypress',
      description: 'Master end-to-end testing'
    })
  })
})
```

### Testing Error Handling

```javascript
describe('Error Handling', () => {
  it('should handle API errors gracefully', () => {
    // Intercept with error response
    cy.intercept('GET', '/api/goals', {
      statusCode: 500,
      body: { error: 'Database connection failed' }
    }).as('getGoalsError')

    // Visit the page
    cy.visit('/goals')

    // Wait for the error
    cy.wait('@getGoalsError')

    // Verify error message is displayed
    cy.get('[data-testid=error-message]')
      .should('be.visible')
      .and('contain', 'Failed to load goals')
  })
})
```

### Testing Loading States

```javascript
describe('Loading States', () => {
  it('should show loading indicator', () => {
    // Intercept with delay
    cy.intercept('GET', '/api/goals', {
      statusCode: 200,
      body: [],
      delay: 1000
    }).as('getGoals')

    // Visit the page
    cy.visit('/goals')

    // Verify loading indicator appears
    cy.get('[data-testid=loading]').should('be.visible')

    // Wait for the request to complete
    cy.wait('@getGoals')

    // Verify loading indicator disappears
    cy.get('[data-testid=loading]').should('not.exist')
  })
})
```

## Exercise: Network Control Practice

### Assignment 1: Basic Interception

**Objective**: Learn to intercept and control network requests

**Tasks**:
1. Create a test that intercepts the goals API
2. Return custom data for the goals list
3. Verify the custom data appears in the UI
4. Test different response scenarios (success, error, empty)

**Test Scenarios**:
```javascript
// Success scenario
cy.intercept('GET', '/api/goals', {
  statusCode: 200,
  body: [
    { id: 1, title: 'Test Goal 1', status: 'active' },
    { id: 2, title: 'Test Goal 2', status: 'completed' }
  ]
})

// Error scenario
cy.intercept('GET', '/api/goals', {
  statusCode: 500,
  body: { error: 'Server error' }
})

// Empty scenario
cy.intercept('GET', '/api/goals', {
  statusCode: 200,
  body: []
})
```

**Deliverables**:
- Test file with different interception scenarios
- Screenshots of each scenario
- Documentation of what each test verifies

### Assignment 2: Dynamic Interception

**Objective**: Create dynamic responses based on request data

**Tasks**:
1. Intercept POST requests to create goals
2. Modify the request data before sending
3. Modify the response data after receiving
4. Verify both request and response modifications

**Example**:
```javascript
cy.intercept('POST', '/api/goals', (req) => {
  // Log the original request
  console.log('Original request:', req.body)
  
  // Modify the request
  req.body.title = req.body.title + ' (Modified)'
  
  // Send the request and modify the response
  req.reply((res) => {
    res.body.id = 999
    res.body.modified = true
    res.body.originalTitle = req.body.title.replace(' (Modified)', '')
  })
})
```

**Deliverables**:
- Dynamic interception test
- Request/response modification examples
- Console logs showing modifications

### Assignment 3: Error Simulation

**Objective**: Test application behavior under various error conditions

**Tasks**:
1. Test network timeouts
2. Test server errors (4xx, 5xx)
3. Test malformed responses
4. Verify error handling and user feedback

**Error Scenarios**:
```javascript
// Network timeout
cy.intercept('GET', '/api/goals', {
  forceNetworkError: true
})

// Server error
cy.intercept('GET', '/api/goals', {
  statusCode: 503,
  body: { error: 'Service Unavailable' }
})

// Malformed response
cy.intercept('GET', '/api/goals', {
  statusCode: 200,
  body: 'invalid json'
})
```

**Deliverables**:
- Error simulation test suite
- Error handling verification
- User experience documentation

### Assignment 4: Performance Testing

**Objective**: Test application behavior with slow responses

**Tasks**:
1. Test loading indicators with delayed responses
2. Test timeout handling
3. Test user experience during slow network
4. Verify loading states and progress indicators

**Performance Scenarios**:
```javascript
// Slow response
cy.intercept('GET', '/api/goals', {
  statusCode: 200,
  body: [],
  delay: 3000
})

// Very slow response
cy.intercept('GET', '/api/goals', {
  statusCode: 200,
  body: [],
  delay: 10000
})
```

**Deliverables**:
- Performance test scenarios
- Loading state verification
- User experience analysis 