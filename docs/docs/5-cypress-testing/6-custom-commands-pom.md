---
sidebar_position: 6
---

# Custom Commands

## Two Patterns for Test Organization

As your test suite grows, you'll find yourself repeating the same actions across multiple tests. There are two main patterns to address this: **Custom Commands** and **Page Object Model (POM)**.

### Custom Commands
Custom commands extend Cypress with reusable actions that can be called like built-in commands. They're simple, direct, and integrate seamlessly with Cypress's existing API.

### Page Object Model (POM)
POM creates an object repository for web UI elements, with each page having a corresponding page object class that encapsulates the page's structure and behavior.

## Why We Focus on Custom Commands

While POM can provide structure, it adds complexity by introducing another layer in the test framework code. This layer can grow its own architecture that differs from the application's architecture, making tests harder to maintain and understand. Custom commands offer a simpler, more direct approach that stays closer to Cypress's philosophy.

### Benefits of Custom Commands

1. **Reusability**: Write once, use everywhere
2. **Maintainability**: Change in one place, updates everywhere
3. **Readability**: Tests become more descriptive and easier to understand
4. **Consistency**: Standardized way to interact with elements
5. **Reduced Duplication**: Less code repetition

## Creating Custom Commands

Custom commands are defined in `cypress/support/commands.js`:

```javascript
// cypress/support/commands.js

// Login command
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('[data-testid=email]').type(email)
  cy.get('[data-testid=password]').type(password)
  cy.get('[data-testid=login-button]').click()
  cy.url().should('include', '/dashboard')
})

// Create goal command
Cypress.Commands.add('createGoal', (title, description) => {
  cy.visit('/goals/new')
  cy.get('[data-testid=goal-title]').type(title)
  cy.get('[data-testid=goal-description]').type(description)
  cy.get('[data-testid=save-goal]').click()
  cy.get('[data-testid=success-message]').should('be.visible')
})

// Wait for loading command
Cypress.Commands.add('waitForLoading', () => {
  cy.get('[data-testid=loading]').should('not.exist')
})
```

## Using Custom Commands

```javascript
describe('Goal Management', () => {
  beforeEach(() => {
    cy.login('user@example.com', 'password')
  })
  
  it('should create a new goal', () => {
    cy.createGoal('Learn Cypress', 'Master end-to-end testing')
    cy.get('[data-testid=goal-list]').should('contain', 'Learn Cypress')
  })
  
  it('should create multiple goals', () => {
    cy.createGoal('Goal 1', 'Description 1')
    cy.createGoal('Goal 2', 'Description 2')
    cy.get('[data-testid=goal-item]').should('have.length', 2)
  })
})
```

## Advanced Custom Commands

```javascript
// Command with options
Cypress.Commands.add('createGoalWithOptions', (goalData, options = {}) => {
  const defaults = {
    waitForSuccess: true,
    validateInList: true
  }
  const config = { ...defaults, ...options }
  
  cy.visit('/goals/new')
  cy.get('[data-testid=goal-title]').type(goalData.title)
  cy.get('[data-testid=goal-description]').type(goalData.description)
  
  if (goalData.targetDate) {
    cy.get('[data-testid=goal-date]').type(goalData.targetDate)
  }
  
  cy.get('[data-testid=save-goal]').click()
  
  if (config.waitForSuccess) {
    cy.get('[data-testid=success-message]').should('be.visible')
  }
  
  if (config.validateInList) {
    cy.visit('/goals')
    cy.get('[data-testid=goal-list]').should('contain', goalData.title)
  }
})

// Command that returns a value
Cypress.Commands.add('getGoalCount', () => {
  return cy.get('[data-testid=goal-item]').then(($elements) => {
    return $elements.length
  })
})
```

## Exercise: Custom Commands Practice

### Assignment: Create Custom Commands

**Objective**: Create reusable custom commands for common actions

**Tasks**:
1. Create custom commands for authentication
2. Create custom commands for goal management
3. Create custom commands for data validation
4. Document all custom commands

**Required Commands**:
```javascript
// Authentication
cy.login(email, password)
cy.logout()
cy.register(email, password, name)

// Goal Management
cy.createGoal(title, description)
cy.editGoal(id, title, description)
cy.deleteGoal(id)
cy.completeGoal(id)

// Data Validation
cy.validateGoalData(goalData)
cy.waitForApiResponse(alias)
cy.clearTestData()
```

**Deliverables**:
- Custom commands file
- Command documentation
- Usage examples

### Assignment: Refactor Existing Tests

**Objective**: Refactor existing tests to use custom commands

**Tasks**:
1. Identify repetitive code in existing tests
2. Extract common actions into custom commands
3. Refactor tests to use new abstractions

**Before Refactoring**:
```javascript
describe('Goal Creation', () => {
  it('should create a goal', () => {
    cy.visit('/login')
    cy.get('[data-testid=email]').type('user@example.com')
    cy.get('[data-testid=password]').type('password')
    cy.get('[data-testid=login-button]').click()
    
    cy.visit('/goals/new')
    cy.get('[data-testid=goal-title]').type('New Goal')
    cy.get('[data-testid=goal-description]').type('Description')
    cy.get('[data-testid=save-goal]').click()
    
    cy.get('[data-testid=goal-list]').should('contain', 'New Goal')
  })
})
```

**After Refactoring**:
```javascript
describe('Goal Creation', () => {
  it('should create a goal', () => {
    cy.login('user@example.com', 'password')
    
    cy.createGoal('New Goal', 'Description')
    cy.get('[data-testid=goal-list]').should('contain', 'New Goal')
  })
})
```

**Deliverables**:
- Refactored test files
- Before/after comparison
- Code reduction metrics 