---
sidebar_position: 5
---

# API Testing with Cypress

## Why Test APIs with Cypress?

While Cypress is primarily known for end-to-end testing, it also provides excellent capabilities for API testing. This allows you to test both the frontend and backend in the same framework.

### Benefits of API Testing in Cypress

1. **Unified Testing Framework**: Test UI and API in the same place
2. **Data Setup**: Create test data via API before UI tests
3. **Validation**: Verify API responses during UI interactions
4. **Performance**: API tests are faster than UI tests
5. **Coverage**: Test scenarios that are difficult to test via UI

## Basic API Testing

### Making HTTP Requests

```javascript
// GET request
cy.request('GET', '/api/goals').then((response) => {
  expect(response.status).to.eq(200)
  expect(response.body).to.have.length(3)
})

// POST request
cy.request('POST', '/api/goals', {
  title: 'Learn Cypress',
  description: 'Master API testing'
}).then((response) => {
  expect(response.status).to.eq(201)
  expect(response.body.title).to.eq('Learn Cypress')
})
```

### Using `cy.request()` with Aliases

```javascript
// Create an alias for the request
cy.request('GET', '/api/goals').as('getGoals')

// Use the alias in assertions
cy.get('@getGoals').then((response) => {
  expect(response.status).to.eq(200)
})

// Chain multiple assertions
cy.get('@getGoals').its('body').should('have.length', 3)
cy.get('@getGoals').its('status').should('eq', 200)
```

## Advanced API Testing Techniques

### Authentication

```javascript
// Login and get token
cy.request('POST', '/api/auth/login', {
  email: 'user@example.com',
  password: 'password'
}).then((response) => {
  const token = response.body.token
  
  // Use token in subsequent requests
  cy.request({
    method: 'GET',
    url: '/api/goals',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).as('authenticatedRequest')
})
```

### Request Configuration

```javascript
cy.request({
  method: 'POST',
  url: '/api/goals',
  body: {
    title: 'Test Goal',
    description: 'Test Description'
  },
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token'
  },
  failOnStatusCode: false // Don't fail on non-2xx status codes
}).as('createGoal')
```

### Response Validation

```javascript
cy.request('GET', '/api/goals').then((response) => {
  // Validate status code
  expect(response.status).to.eq(200)
  
  // Validate response structure
  expect(response.body).to.be.an('array')
  
  // Validate individual items
  response.body.forEach(goal => {
    expect(goal).to.have.property('id')
    expect(goal).to.have.property('title')
    expect(goal).to.have.property('status')
  })
  
  // Validate specific values
  const firstGoal = response.body[0]
  expect(firstGoal.title).to.be.a('string')
  expect(firstGoal.status).to.be.oneOf(['active', 'completed', 'cancelled'])
})
```

## Combining UI and API Testing

### Data Setup via API

```javascript
describe('Goal Management', () => {
  beforeEach(() => {
    // Create test data via API
    cy.request('POST', '/api/goals', {
      title: 'Test Goal 1',
      description: 'Test Description 1'
    }).as('goal1')
    
    cy.request('POST', '/api/goals', {
      title: 'Test Goal 2',
      description: 'Test Description 2'
    }).as('goal2')
  })
  
  it('should display goals from API', () => {
    // Visit the UI
    cy.visit('/goals')
    
    // Verify goals are displayed
    cy.get('[data-testid=goal-item]').should('have.length', 2)
    cy.get('[data-testid=goal-item]').first().should('contain', 'Test Goal 1')
  })
})
```

### API Validation During UI Tests

```javascript
describe('Goal Creation', () => {
  it('should create goal via UI and validate API', () => {
    // Intercept the API call
    cy.intercept('POST', '/api/goals').as('createGoal')
    
    // Perform UI action
    cy.visit('/goals/new')
    cy.get('[data-testid=goal-title]').type('New Goal')
    cy.get('[data-testid=goal-description]').type('New Description')
    cy.get('[data-testid=save-goal]').click()
    
    // Wait for API call
    cy.wait('@createGoal')
    
    // Validate API request
    cy.get('@createGoal').its('request.body').should('deep.equal', {
      title: 'New Goal',
      description: 'New Description'
    })
    
    // Validate API response
    cy.get('@createGoal').its('response.statusCode').should('eq', 201)
    cy.get('@createGoal').its('response.body.title').should('eq', 'New Goal')
  })
})
```

## Error Handling and Edge Cases

### Testing Error Responses

```javascript
describe('API Error Handling', () => {
  it('should handle 404 errors', () => {
    cy.request({
      method: 'GET',
      url: '/api/goals/999999',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404)
      expect(response.body.error).to.contain('Goal not found')
    })
  })
  
  it('should handle validation errors', () => {
    cy.request({
      method: 'POST',
      url: '/api/goals',
      body: { title: '' }, // Invalid data
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body.errors).to.have.property('title')
    })
  })
})
```

### Testing Performance

```javascript
describe('API Performance', () => {
  it('should respond within acceptable time', () => {
    const startTime = Date.now()
    
    cy.request('GET', '/api/goals').then(() => {
      const endTime = Date.now()
      const responseTime = endTime - startTime
      
      expect(responseTime).to.be.lessThan(1000) // Less than 1 second
    })
  })
})
```

## Practical Examples for Goal Tracker

### Complete CRUD Operations

```javascript
describe('Goal CRUD Operations', () => {
  let goalId
  
  it('should create a goal', () => {
    cy.request('POST', '/api/goals', {
      title: 'Learn Cypress',
      description: 'Master end-to-end testing'
    }).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body.title).to.eq('Learn Cypress')
      goalId = response.body.id
    })
  })
  
  it('should read a goal', () => {
    cy.request('GET', `/api/goals/${goalId}`).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.id).to.eq(goalId)
    })
  })
  
  it('should update a goal', () => {
    cy.request('PUT', `/api/goals/${goalId}`, {
      title: 'Learn Cypress - Updated',
      status: 'completed'
    }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.title).to.eq('Learn Cypress - Updated')
      expect(response.body.status).to.eq('completed')
    })
  })
  
  it('should delete a goal', () => {
    cy.request('DELETE', `/api/goals/${goalId}`).then((response) => {
      expect(response.status).to.eq(204)
    })
    
    // Verify goal is deleted
    cy.request({
      method: 'GET',
      url: `/api/goals/${goalId}`,
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404)
    })
  })
})
```

## Exercise: API Testing Practice

### Assignment 1: Basic API Testing

**Objective**: Learn to test APIs using Cypress

**Tasks**:
1. Test the goals API endpoints (GET, POST, PUT, DELETE)
2. Validate response status codes and body structure
3. Test with different data scenarios
4. Document API behavior

**Test Endpoints**:
- `GET /api/goals` - List all goals
- `GET /api/goals/:id` - Get specific goal
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

**Deliverables**:
- Complete API test suite
- Response validation tests
- API documentation

### Assignment 2: Authentication Testing

**Objective**: Test authenticated API endpoints

**Tasks**:
1. Test login endpoint to get authentication token
2. Test protected endpoints with valid token
3. Test protected endpoints without token
4. Test with invalid/expired tokens

**Authentication Flow**:
```javascript
// Login flow
cy.request('POST', '/api/auth/login', {
  email: 'user@example.com',
  password: 'password'
}).then((response) => {
  const token = response.body.token
  
  // Test protected endpoint
  cy.request({
    method: 'GET',
    url: '/api/goals',
    headers: { 'Authorization': `Bearer ${token}` }
  })
})
```

**Deliverables**:
- Authentication test suite
- Token validation tests
- Security test scenarios

### Assignment 3: Data Validation

**Objective**: Test API data validation and error handling

**Tasks**:
1. Test required field validation
2. Test data type validation
3. Test business rule validation
4. Test error response formats

**Validation Scenarios**:
```javascript
// Required fields
cy.request({
  method: 'POST',
  url: '/api/goals',
  body: {}, // Missing required fields
  failOnStatusCode: false
})

// Data type validation
cy.request({
  method: 'POST',
  url: '/api/goals',
  body: { title: 123 }, // Wrong data type
  failOnStatusCode: false
})

// Business rules
cy.request({
  method: 'POST',
  url: '/api/goals',
  body: { title: 'a'.repeat(1000) }, // Too long
  failOnStatusCode: false
})
```

**Deliverables**:
- Validation test suite
- Error response documentation
- Business rule test cases

### Assignment 4: Integration Testing

**Objective**: Test complete workflows combining UI and API

**Tasks**:
1. Create test data via API
2. Perform actions via UI
3. Validate changes via API
4. Clean up test data

**Integration Example**:
```javascript
describe('Goal Workflow', () => {
  it('should create goal via API and verify in UI', () => {
    // Create goal via API
    cy.request('POST', '/api/goals', {
      title: 'API Created Goal',
      description: 'Created via API'
    }).then((response) => {
      const goalId = response.body.id
      
      // Verify in UI
      cy.visit('/goals')
      cy.get(`[data-testid=goal-${goalId}]`).should('contain', 'API Created Goal')
      
      // Update via UI
      cy.get(`[data-testid=edit-${goalId}]`).click()
      cy.get('[data-testid=goal-title]').clear().type('Updated Goal')
      cy.get('[data-testid=save-goal]').click()
      
      // Verify update via API
      cy.request('GET', `/api/goals/${goalId}`).then((response) => {
        expect(response.body.title).to.eq('Updated Goal')
      })
    })
  })
})
```

**Deliverables**:
- Integration test workflows
- UI-API synchronization tests
- End-to-end workflow documentation 