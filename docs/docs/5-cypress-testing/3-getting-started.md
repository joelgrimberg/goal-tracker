---
sidebar_position: 3
---

# Getting Started with Cypress

## Installing Cypress

### Prerequisites

Before installing Cypress, ensure you have:
- Node.js (version 14 or higher)
- npm or yarn package manager
- A modern web browser (Chrome recommended)

### Installation Methods

#### Method 1: npm (Recommended)

```bash
# Navigate to your project directory
cd your-project

# Install Cypress as a dev dependency
npm install cypress --save-dev

# Add Cypress scripts to package.json
```

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "test:e2e": "cypress run"
  }
}
```

#### Method 2: Direct Download

```bash
# Download and install Cypress globally
npm install -g cypress

# Open Cypress
cypress open
```

## Project Setup

### Initializing Cypress

```bash
# Open Cypress for the first time
npm run cypress:open
```

This will:
1. Create a `cypress` folder in your project
2. Generate example test files
3. Open the Cypress Test Runner

### Project Structure

After initialization, your project will have this structure:

```
cypress/
├── e2e/                    # Test files
│   ├── example.cy.js      # Example test
│   └── your-tests.cy.js   # Your test files
├── fixtures/              # Test data
│   └── example.json       # Example fixture
├── support/               # Support files
│   ├── commands.js        # Custom commands
│   └── e2e.js            # Global configuration
└── cypress.config.js      # Cypress configuration
```

## Writing Your First Test

### Basic Test Structure

```javascript
describe('My First Test', () => {
  it('should visit the homepage', () => {
    // Visit the application
    cy.visit('http://localhost:3001')
    
    // Assert that we're on the correct page
    cy.get('h1').should('contain', 'Goal Tracker')
  })
})
```

### Test File Naming Convention

- Use `.cy.js` or `.cy.ts` extension
- Name files descriptively: `login.cy.js`, `goal-creation.cy.js`
- Group related tests in the same file

## Understanding the Cypress Interface

### Test Runner Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Cypress Test Runner                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐                │
│  │   Test List     │    │   Browser       │                │
│  │   - test1.cy.js │    │   [Your App]    │                │
│  │   - test2.cy.js │    │                 │                │
│  └─────────────────┘    └─────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

### Key Features

1. **Test List**: Shows all your test files
2. **Browser Window**: Real-time test execution
3. **Command Log**: Step-by-step test execution
4. **Time Travel**: Click any step to see the state
5. **Selector Playground**: Find elements easily

## Basic Cypress Commands

### Navigation Commands

```javascript
// Visit a URL
cy.visit('http://localhost:3001')

// Go back/forward
cy.go('back')
cy.go('forward')

// Reload the page
cy.reload()
```

### Element Interaction Commands

```javascript
// Click an element
cy.get('[data-testid=login-button]').click()

// Type text
cy.get('[data-testid=email]').type('user@example.com')

// Clear input
cy.get('[data-testid=email]').clear()

// Select from dropdown
cy.get('[data-testid=status-select]').select('completed')
```

### Assertion Commands

```javascript
// Check if element exists
cy.get('[data-testid=goal-list]').should('exist')

// Check text content
cy.get('h1').should('contain', 'Goal Tracker')

// Check element count
cy.get('[data-testid=goal-item]').should('have.length', 3)

// Check element visibility
cy.get('[data-testid=loading]').should('be.visible')
```

## Exercise: Your First Cypress Test

### Assignment 1: Setup Cypress in Goal Tracker

**Objective**: Set up Cypress in the Goal Tracker project

**Tasks**:
1. Navigate to the Goal Tracker project directory
2. Install Cypress as a dev dependency
3. Initialize Cypress
4. Configure Cypress for the Goal Tracker application
5. Create your first test file

**Steps**:
```bash
# Navigate to goal-tracker directory
cd goal-tracker

# Install Cypress
npm install cypress --save-dev

# Add scripts to package.json
# Open Cypress
npm run cypress:open
```

**Configuration** (`cypress.config.js`):
```javascript
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3001',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
```

**Deliverables**:
- Cypress installed and configured
- First test file created
- Test runner working

### Assignment 2: Write Your First Test

**Objective**: Create a simple test for the Goal Tracker application

**Tasks**:
1. Start the Goal Tracker application
2. Create a test that visits the homepage
3. Add assertions to verify the page loads correctly
4. Run the test and verify it passes

**Test Requirements**:
```javascript
describe('Goal Tracker Homepage', () => {
  it('should load the homepage successfully', () => {
    // Visit the homepage
    cy.visit('/')
    
    // Verify the page title
    cy.title().should('contain', 'Goal Tracker')
    
    // Verify main heading exists
    cy.get('h1').should('contain', 'Goal')
    
    // Verify navigation elements exist
    cy.get('nav').should('exist')
    
    // Verify login/register buttons exist
    cy.get('[data-testid=login-button]').should('exist')
    cy.get('[data-testid=register-button]').should('exist')
  })
})
```

**Deliverables**:
- Working test file
- Test passes successfully
- Screenshot of test results

### Assignment 3: Element Selection Practice

**Objective**: Practice selecting elements using different strategies

**Tasks**:
1. Create a test that practices different element selection methods
2. Use data-testid attributes (recommended)
3. Use CSS selectors
4. Use text content
5. Document the pros/cons of each method

**Element Selection Methods**:
```javascript
// By data-testid (recommended)
cy.get('[data-testid=goal-title]')

// By CSS class
cy.get('.goal-item')

// By ID
cy.get('#login-form')

// By text content
cy.contains('Create Goal')

// By partial text
cy.contains('Goal')

// By attribute
cy.get('input[type="email"]')
```

**Deliverables**:
- Test file with different selection methods
- Documentation of selection strategies
- Best practices summary

### Assignment 4: Test Organization

**Objective**: Learn to organize tests effectively

**Tasks**:
1. Create multiple test files for different features
2. Use describe blocks to group related tests
3. Use beforeEach hooks for common setup
4. Create custom commands for repeated actions

**Example Structure**:
```
cypress/e2e/
├── authentication/
│   ├── login.cy.js
│   └── register.cy.js
├── goals/
│   ├── create-goal.cy.js
│   ├── edit-goal.cy.js
│   └── delete-goal.cy.js
└── navigation/
    └── menu.cy.js
```

**Deliverables**:
- Organized test file structure
- Custom commands file
- Test organization documentation 