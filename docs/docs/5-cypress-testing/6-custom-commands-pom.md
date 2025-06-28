---
sidebar_position: 6
---

# Custom Commands & Page Object Model

## Why Use Custom Commands and POM?

As your test suite grows, you'll find yourself repeating the same actions across multiple tests. Custom commands and Page Object Model (POM) help you write more maintainable and reusable test code.

### Benefits

1. **Reusability**: Write once, use everywhere
2. **Maintainability**: Change in one place, updates everywhere
3. **Readability**: Tests become more descriptive and easier to understand
4. **Consistency**: Standardized way to interact with elements
5. **Reduced Duplication**: Less code repetition

## Custom Commands

### Creating Custom Commands

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

### Using Custom Commands

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

### Advanced Custom Commands

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

## Page Object Model (POM)

### What is POM?

Page Object Model is a design pattern that creates an object repository for web UI elements. Each page in your application has a corresponding page object class.

### Benefits of POM

1. **Separation of Concerns**: UI logic separated from test logic
2. **Reusability**: Page objects can be reused across tests
3. **Maintainability**: Changes to UI only require updating page objects
4. **Readability**: Tests become more descriptive

### Creating Page Objects

```javascript
// cypress/support/page-objects/LoginPage.js
class LoginPage {
  // Selectors
  elements = {
    emailInput: '[data-testid=email]',
    passwordInput: '[data-testid=password]',
    loginButton: '[data-testid=login-button]',
    errorMessage: '[data-testid=error-message]',
    successMessage: '[data-testid=success-message]'
  }
  
  // Actions
  visit() {
    cy.visit('/login')
    return this
  }
  
  fillEmail(email) {
    cy.get(this.elements.emailInput).type(email)
    return this
  }
  
  fillPassword(password) {
    cy.get(this.elements.passwordInput).type(password)
    return this
  }
  
  clickLogin() {
    cy.get(this.elements.loginButton).click()
    return this
  }
  
  login(email, password) {
    this.visit()
      .fillEmail(email)
      .fillPassword(password)
      .clickLogin()
    return this
  }
  
  // Assertions
  shouldShowError(message) {
    cy.get(this.elements.errorMessage).should('contain', message)
    return this
  }
  
  shouldShowSuccess() {
    cy.get(this.elements.successMessage).should('be.visible')
    return this
  }
}

export default new LoginPage()
```

```javascript
// cypress/support/page-objects/GoalsPage.js
class GoalsPage {
  elements = {
    goalList: '[data-testid=goal-list]',
    goalItem: '[data-testid=goal-item]',
    createGoalButton: '[data-testid=create-goal-button]',
    goalTitle: '[data-testid=goal-title]',
    goalDescription: '[data-testid=goal-description]',
    saveGoalButton: '[data-testid=save-goal]',
    editGoalButton: '[data-testid=edit-goal]',
    deleteGoalButton: '[data-testid=delete-goal]'
  }
  
  visit() {
    cy.visit('/goals')
    return this
  }
  
  clickCreateGoal() {
    cy.get(this.elements.createGoalButton).click()
    return this
  }
  
  fillGoalForm(title, description) {
    cy.get(this.elements.goalTitle).type(title)
    cy.get(this.elements.goalDescription).type(description)
    return this
  }
  
  saveGoal() {
    cy.get(this.elements.saveGoalButton).click()
    return this
  }
  
  createGoal(title, description) {
    this.clickCreateGoal()
      .fillGoalForm(title, description)
      .saveGoal()
    return this
  }
  
  editGoal(goalId, newTitle) {
    cy.get(`[data-testid=edit-${goalId}]`).click()
    cy.get(this.elements.goalTitle).clear().type(newTitle)
    cy.get(this.elements.saveGoalButton).click()
    return this
  }
  
  deleteGoal(goalId) {
    cy.get(`[data-testid=delete-${goalId}]`).click()
    return this
  }
  
  shouldHaveGoalCount(count) {
    cy.get(this.elements.goalItem).should('have.length', count)
    return this
  }
  
  shouldContainGoal(title) {
    cy.get(this.elements.goalList).should('contain', title)
    return this
  }
}

export default new GoalsPage()
```

### Using Page Objects in Tests

```javascript
// cypress/e2e/goal-management.cy.js
import LoginPage from '../support/page-objects/LoginPage'
import GoalsPage from '../support/page-objects/GoalsPage'

describe('Goal Management with POM', () => {
  beforeEach(() => {
    LoginPage.login('user@example.com', 'password')
  })
  
  it('should create a new goal', () => {
    GoalsPage.createGoal('Learn Cypress', 'Master end-to-end testing')
      .shouldContainGoal('Learn Cypress')
  })
  
  it('should edit an existing goal', () => {
    // Create a goal first
    GoalsPage.createGoal('Original Goal', 'Original Description')
    
    // Edit the goal
    GoalsPage.editGoal(1, 'Updated Goal')
      .shouldContainGoal('Updated Goal')
  })
  
  it('should delete a goal', () => {
    // Create a goal first
    GoalsPage.createGoal('Goal to Delete', 'Will be deleted')
    
    // Delete the goal
    GoalsPage.deleteGoal(1)
      .shouldHaveGoalCount(0)
  })
})
```

## Advanced Patterns

### Base Page Object

```javascript
// cypress/support/page-objects/BasePage.js
class BasePage {
  // Common elements
  elements = {
    loading: '[data-testid=loading]',
    errorMessage: '[data-testid=error-message]',
    successMessage: '[data-testid=success-message]'
  }
  
  // Common actions
  waitForLoading() {
    cy.get(this.elements.loading).should('not.exist')
    return this
  }
  
  shouldShowError(message) {
    cy.get(this.elements.errorMessage).should('contain', message)
    return this
  }
  
  shouldShowSuccess() {
    cy.get(this.elements.successMessage).should('be.visible')
    return this
  }
  
  // Navigation
  goBack() {
    cy.go('back')
    return this
  }
  
  reload() {
    cy.reload()
    return this
  }
}

export default BasePage
```

### Component Objects

```javascript
// cypress/support/page-objects/components/GoalCard.js
class GoalCard {
  constructor(goalId) {
    this.goalId = goalId
    this.elements = {
      title: `[data-testid=goal-title-${goalId}]`,
      description: `[data-testid=goal-description-${goalId}]`,
      status: `[data-testid=goal-status-${goalId}]`,
      editButton: `[data-testid=edit-${goalId}]`,
      deleteButton: `[data-testid=delete-${goalId}]`
    }
  }
  
  clickEdit() {
    cy.get(this.elements.editButton).click()
    return this
  }
  
  clickDelete() {
    cy.get(this.elements.deleteButton).click()
    return this
  }
  
  shouldHaveTitle(title) {
    cy.get(this.elements.title).should('contain', title)
    return this
  }
  
  shouldHaveStatus(status) {
    cy.get(this.elements.status).should('contain', status)
    return this
  }
}

export default GoalCard
```

## Exercise: Custom Commands and POM Practice

### Assignment 1: Create Custom Commands

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

### Assignment 2: Implement Page Object Model

**Objective**: Create page objects for the Goal Tracker application

**Tasks**:
1. Create page objects for all major pages
2. Implement fluent interface (method chaining)
3. Add comprehensive assertions
4. Create component objects for reusable elements

**Required Page Objects**:
- LoginPage
- RegisterPage
- DashboardPage
- GoalsPage
- GoalFormPage
- ProfilePage

**Component Objects**:
- GoalCard
- NavigationMenu
- LoadingSpinner
- ErrorMessage

**Deliverables**:
- Complete page object structure
- Component objects
- Usage examples

### Assignment 3: Refactor Existing Tests

**Objective**: Refactor existing tests to use custom commands and POM

**Tasks**:
1. Identify repetitive code in existing tests
2. Extract common actions into custom commands
3. Create page objects for test pages
4. Refactor tests to use new abstractions

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
    
    GoalsPage.createGoal('New Goal', 'Description')
      .shouldContainGoal('New Goal')
  })
})
```

**Deliverables**:
- Refactored test files
- Before/after comparison
- Code reduction metrics

### Assignment 4: Advanced Patterns

**Objective**: Implement advanced patterns for complex scenarios

**Tasks**:
1. Create base page object with common functionality
2. Implement component objects for reusable elements
3. Create data builders for test data
4. Implement test utilities and helpers

**Advanced Patterns**:
```javascript
// Data Builder
class GoalBuilder {
  constructor() {
    this.goal = {
      title: 'Default Goal',
      description: 'Default Description',
      targetDate: null,
      status: 'active'
    }
  }
  
  withTitle(title) {
    this.goal.title = title
    return this
  }
  
  withDescription(description) {
    this.goal.description = description
    return this
  }
  
  withTargetDate(date) {
    this.goal.targetDate = date
    return this
  }
  
  build() {
    return { ...this.goal }
  }
}

// Test Utilities
class TestUtils {
  static generateRandomEmail() {
    return `test-${Date.now()}@example.com`
  }
  
  static generateRandomGoal() {
    return new GoalBuilder()
      .withTitle(`Goal ${Date.now()}`)
      .withDescription(`Description ${Date.now()}`)
      .build()
  }
}
```

**Deliverables**:
- Advanced pattern implementations
- Test utilities
- Best practices documentation 