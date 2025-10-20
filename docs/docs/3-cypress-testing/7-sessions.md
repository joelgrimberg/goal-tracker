---
sidebar_position: 7
---

# Sessions & State Management

## Understanding Sessions in Cypress

Sessions in Cypress allow you to preserve and reuse browser state across tests, which can significantly speed up your test suite by avoiding repetitive login and setup steps.

### Why Use Sessions?

1. **Performance**: Faster test execution by reusing authentication
2. **Reliability**: More stable tests with consistent state
3. **Efficiency**: Reduce setup time for each test
4. **Real-world Testing**: Test scenarios that require authenticated state

## Basic Session Management

### Using `cy.session()`

```javascript
// Basic session usage
cy.session('user-session', () => {
  cy.visit('/login')
  cy.get('[data-testid=email]').type('user@example.com')
  cy.get('[data-testid=password]').type('password')
  cy.get('[data-testid=login-button]').click()
  cy.url().should('include', '/dashboard')
})
```

### Session with Validation

```javascript
cy.session('user-session', () => {
  // Login steps
  cy.visit('/login')
  cy.get('[data-testid=email]').type('user@example.com')
  cy.get('[data-testid=password]').type('password')
  cy.get('[data-testid=login-button]').click()
}, {
  validate() {
    // Validate that the session is still valid
    cy.visit('/dashboard')
    cy.get('[data-testid=user-menu]').should('be.visible')
  }
})
```

### Session with Custom Cache Key

```javascript
cy.session(['user', 'user@example.com'], () => {
  // Login steps
  cy.visit('/login')
  cy.get('[data-testid=email]').type('user@example.com')
  cy.get('[data-testid=password]').type('password')
  cy.get('[data-testid=login-button]').click()
}, {
  cacheAcrossSpecs: true // Cache across different spec files
})
```

## Advanced Session Patterns

### Multiple User Sessions

```javascript
describe('Multi-user Testing', () => {
  beforeEach(() => {
    // Admin session
    cy.session('admin-session', () => {
      cy.visit('/login')
      cy.get('[data-testid=email]').type('admin@example.com')
      cy.get('[data-testid=password]').type('admin-password')
      cy.get('[data-testid=login-button]').click()
    })
    
    // Regular user session
    cy.session('user-session', () => {
      cy.visit('/login')
      cy.get('[data-testid=email]').type('user@example.com')
      cy.get('[data-testid=password]').type('user-password')
      cy.get('[data-testid=login-button]').click()
    })
  })
  
  it('should test admin functionality', () => {
    cy.session('admin-session') // Use admin session
    cy.visit('/admin')
    cy.get('[data-testid=admin-panel]').should('be.visible')
  })
  
  it('should test user functionality', () => {
    cy.session('user-session') // Use user session
    cy.visit('/goals')
    cy.get('[data-testid=goal-list]').should('be.visible')
  })
})
```

### Session with Data Setup

```javascript
cy.session('user-with-goals', () => {
  // Login
  cy.visit('/login')
  cy.get('[data-testid=email]').type('user@example.com')
  cy.get('[data-testid=password]').type('password')
  cy.get('[data-testid=login-button]').click()
  
  // Create test data
  cy.request('POST', '/api/goals', {
    title: 'Test Goal 1',
    description: 'Test Description 1'
  })
  
  cy.request('POST', '/api/goals', {
    title: 'Test Goal 2',
    description: 'Test Description 2'
  })
}, {
  validate() {
    cy.visit('/goals')
    cy.get('[data-testid=goal-item]').should('have.length', 2)
  }
})
```

## State Management Strategies

### Local Storage and Session Storage

```javascript
// Preserve localStorage
cy.session('user-session', () => {
  // Login steps
  cy.visit('/login')
  cy.get('[data-testid=email]').type('user@example.com')
  cy.get('[data-testid=password]').type('password')
  cy.get('[data-testid=login-button]').click()
}, {
  validate() {
    // Check if user is still logged in
    cy.window().its('localStorage').invoke('getItem', 'authToken')
      .should('exist')
  }
})
```

### Cookies Management

```javascript
cy.session('user-session', () => {
  // Login steps
  cy.visit('/login')
  cy.get('[data-testid=email]').type('user@example.com')
  cy.get('[data-testid=password]').type('password')
  cy.get('[data-testid=login-button]').click()
}, {
  validate() {
    // Check if session cookie exists
    cy.getCookie('sessionId').should('exist')
  }
})
```

### Custom State Validation

```javascript
cy.session('user-session', () => {
  // Login steps
  cy.visit('/login')
  cy.get('[data-testid=email]').type('user@example.com')
  cy.get('[data-testid=password]').type('password')
  cy.get('[data-testid=login-button]').click()
}, {
  validate() {
    // Custom validation logic
    cy.window().then((win) => {
      // Check if user object exists in app state
      expect(win.appState.user).to.exist
      expect(win.appState.user.email).to.eq('user@example.com')
    })
  }
})
```

## Session Configuration Options

### Cache Control

```javascript
cy.session('user-session', () => {
  // Login steps
}, {
  cacheAcrossSpecs: true, // Cache across different spec files
  validate() {
    // Validation logic
  }
})
```

### Session Invalidation

```javascript
// Invalidate a specific session
cy.session('user-session', () => {
  // This will create a new session
}, {
  validate() {
    // If validation fails, session will be recreated
    cy.visit('/dashboard')
    cy.get('[data-testid=user-menu]').should('be.visible')
  }
})
```

### Custom Session Storage

```javascript
cy.session('user-session', () => {
  // Login steps
}, {
  validate() {
    // Custom validation
  },
  setup() {
    // Additional setup after session creation
    cy.visit('/dashboard')
    cy.get('[data-testid=welcome-message]').should('be.visible')
  }
})
```

## Practical Examples for Goal Tracker

### User Authentication Session

```javascript
// cypress/support/sessions/userSession.js
export const createUserSession = (email = 'user@example.com', password = 'password') => {
  return cy.session(`user-${email}`, () => {
    cy.visit('/login')
    cy.get('[data-testid=email]').type(email)
    cy.get('[data-testid=password]').type(password)
    cy.get('[data-testid=login-button]').click()
    cy.url().should('include', '/dashboard')
  }, {
    validate() {
      cy.visit('/dashboard')
      cy.get('[data-testid=user-menu]').should('be.visible')
    }
  })
}

// Usage in tests
describe('Goal Management', () => {
  beforeEach(() => {
    createUserSession()
  })
  
  it('should create a goal', () => {
    cy.visit('/goals/new')
    cy.get('[data-testid=goal-title]').type('New Goal')
    cy.get('[data-testid=goal-description]').type('Description')
    cy.get('[data-testid=save-goal]').click()
    cy.get('[data-testid=success-message]').should('be.visible')
  })
})
```

### Admin Session with Privileges

```javascript
// cypress/support/sessions/adminSession.js
export const createAdminSession = () => {
  return cy.session('admin-session', () => {
    cy.visit('/login')
    cy.get('[data-testid=email]').type('admin@example.com')
    cy.get('[data-testid=password]').type('admin-password')
    cy.get('[data-testid=login-button]').click()
    cy.url().should('include', '/admin')
  }, {
    validate() {
      cy.visit('/admin')
      cy.get('[data-testid=admin-panel]').should('be.visible')
    }
  })
}
```

### Session with Test Data

```javascript
// cypress/support/sessions/dataSession.js
export const createDataSession = () => {
  return cy.session('data-session', () => {
    // Login
    cy.visit('/login')
    cy.get('[data-testid=email]').type('user@example.com')
    cy.get('[data-testid=password]').type('password')
    cy.get('[data-testid=login-button]').click()
    
    // Create test goals
    const goals = [
      { title: 'Learn Cypress', description: 'Master E2E testing' },
      { title: 'Write Tests', description: 'Create comprehensive test suite' },
      { title: 'Deploy Application', description: 'Deploy to production' }
    ]
    
    goals.forEach(goal => {
      cy.request('POST', '/api/goals', goal)
    })
  }, {
    validate() {
      cy.visit('/goals')
      cy.get('[data-testid=goal-item]').should('have.length', 3)
    }
  })
}
```

## Exercise: Session Management Practice

### Assignment 1: Basic Session Implementation

**Objective**: Implement basic session management for authentication

**Tasks**:
1. Create a user session for login
2. Implement session validation
3. Use sessions across multiple tests
4. Measure performance improvement

**Implementation**:
```javascript
// Create user session
cy.session('user-session', () => {
  cy.visit('/login')
  cy.get('[data-testid=email]').type('user@example.com')
  cy.get('[data-testid=password]').type('password')
  cy.get('[data-testid=login-button]').click()
  cy.url().should('include', '/dashboard')
}, {
  validate() {
    cy.visit('/dashboard')
    cy.get('[data-testid=user-menu]').should('be.visible')
  }
})
```

**Deliverables**:
- Session implementation
- Performance comparison
- Usage examples

### Assignment 2: Multi-User Sessions

**Objective**: Create sessions for different user types

**Tasks**:
1. Create admin session
2. Create regular user session
3. Create premium user session
4. Test different user permissions

**User Types**:
- Admin: Full access to all features
- Regular User: Basic goal management
- Premium User: Advanced features

**Deliverables**:
- Multi-user session implementation
- Permission testing
- Session switching examples

### Assignment 3: Session with Data Setup

**Objective**: Create sessions that include test data setup

**Tasks**:
1. Create session with predefined goals
2. Create session with user preferences
3. Create session with different goal states
4. Validate session data integrity

**Data Scenarios**:
```javascript
// Session with active goals
cy.session('active-goals-session', () => {
  // Login and create active goals
})

// Session with completed goals
cy.session('completed-goals-session', () => {
  // Login and create completed goals
})

// Session with mixed goal states
cy.session('mixed-goals-session', () => {
  // Login and create goals with different states
})
```

**Deliverables**:
- Data setup sessions
- Data validation tests
- Session integrity verification

### Assignment 4: Advanced Session Patterns

**Objective**: Implement advanced session patterns for complex scenarios

**Tasks**:
1. Create conditional sessions based on test requirements
2. Implement session cleanup and teardown
3. Create session factories for dynamic user creation
4. Implement session monitoring and debugging

**Advanced Patterns**:
```javascript
// Conditional session
const createConditionalSession = (userType) => {
  const sessionName = `${userType}-session`
  
  return cy.session(sessionName, () => {
    // Create session based on user type
    if (userType === 'admin') {
      // Admin login
    } else if (userType === 'premium') {
      // Premium user login
    } else {
      // Regular user login
    }
  })
}

// Session factory
class SessionFactory {
  static createUserSession(email, password) {
    return cy.session(`user-${email}`, () => {
      // Login with provided credentials
    })
  }
  
  static createDataSession(goalCount) {
    return cy.session(`data-${goalCount}-goals`, () => {
      // Login and create specified number of goals
    })
  }
}
```

**Deliverables**:
- Advanced session patterns
- Session factory implementation
- Debugging and monitoring tools 