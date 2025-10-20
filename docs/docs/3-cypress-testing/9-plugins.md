---
sidebar_position: 9
---

# Plugin Installation & Configuration

## Understanding Cypress Plugins

Cypress plugins extend the functionality of Cypress by allowing you to hook into various events and customize the testing environment. Plugins can be used for tasks, custom commands, and integration with external tools.

### Why Use Plugins?

1. **Custom Tasks**: Execute Node.js code during test runs
2. **External Tool Integration**: Connect with databases, APIs, or other services
3. **Custom Commands**: Add new Cypress commands
4. **Environment Setup**: Configure test environments
5. **Reporting**: Generate custom reports and analytics

## Plugin Architecture

### Plugin File Structure

```javascript
// cypress.config.js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        // Custom tasks
      })
      
      on('before:browser:launch', (browser, launchOptions) => {
        // Browser launch configuration
      })
      
      on('after:screenshot', (details) => {
        // Screenshot handling
      })
    },
  },
})
```

### Plugin Events

| Event | Description | Use Case |
|-------|-------------|----------|
| `task` | Execute Node.js code | Database operations, file operations |
| `before:browser:launch` | Before browser starts | Browser configuration, extensions |
| `after:screenshot` | After screenshot taken | Image processing, upload |
| `after:spec` | After spec completes | Reporting, cleanup |
| `before:spec` | Before spec starts | Setup, data preparation |

## Essential Plugins

### Database Operations

```bash
# Install database plugin
npm install cypress-db-reset --save-dev
```

```javascript
// cypress.config.js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        'db:reset': () => {
          // Reset database to known state
          return require('cypress-db-reset')()
        },
        'db:seed': () => {
          // Seed database with test data
          return require('./cypress/plugins/db-seed')()
        },
        'db:cleanup': () => {
          // Clean up test data
          return require('./cypress/plugins/db-cleanup')()
        }
      })
    },
  },
})
```

### File Operations

```javascript
// cypress.config.js
const fs = require('fs')
const path = require('path')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        // Read file content
        readFile(filename) {
          return fs.readFileSync(filename, 'utf8')
        },
        
        // Write file content
        writeFile({ filename, content }) {
          fs.writeFileSync(filename, content)
          return null
        },
        
        // Delete file
        deleteFile(filename) {
          if (fs.existsSync(filename)) {
            fs.unlinkSync(filename)
          }
          return null
        },
        
        // Check if file exists
        fileExists(filename) {
          return fs.existsSync(filename)
        }
      })
    },
  },
})
```

### API Operations

```javascript
// cypress.config.js
const axios = require('axios')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        // Make HTTP requests
        async apiRequest({ method, url, data, headers }) {
          try {
            const response = await axios({
              method,
              url,
              data,
              headers
            })
            return response.data
          } catch (error) {
            return { error: error.message }
          }
        },
        
        // Create test user
        async createTestUser(userData) {
          try {
            const response = await axios.post('http://localhost:3000/api/users', userData)
            return response.data
          } catch (error) {
            return { error: error.message }
          }
        },
        
        // Clean up test user
        async deleteTestUser(userId) {
          try {
            await axios.delete(`http://localhost:3000/api/users/${userId}`)
            return null
          } catch (error) {
            return { error: error.message }
          }
        }
      })
    },
  },
})
```

## Popular Cypress Plugins

### Cypress Real Events

```bash
# Install real events plugin
npm install cypress-real-events --save-dev
```

```javascript
// cypress/support/e2e.js
import 'cypress-real-events/support'

// Usage in tests
cy.get('[data-testid=button]').realClick()
cy.get('[data-testid=input]').realType('text')
cy.get('[data-testid=element]').realHover()
```

### Cypress Axe (Accessibility Testing)

```bash
# Install axe plugin
npm install cypress-axe --save-dev
```

```javascript
// cypress/support/e2e.js
import 'cypress-axe'

// Usage in tests
cy.injectAxe()
cy.checkA11y()
cy.checkA11y('[data-testid=form]', {
  rules: {
    'color-contrast': { enabled: true },
    'button-name': { enabled: true }
  }
})
```

### Cypress Data Session

```bash
# Install data session plugin
npm install cypress-data-session --save-dev
```

```javascript
// cypress/support/e2e.js
import 'cypress-data-session'

// Usage in tests
cy.dataSession('user', () => {
  // Create user data
  return { id: 1, name: 'Test User' }
})
```

### Cypress Grep

```bash
# Install grep plugin
npm install @cypress/grep --save-dev
```

```javascript
// cypress.config.js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      require('@cypress/grep/src/plugin')(on, config)
      return config
    },
  },
})

// cypress/support/e2e.js
import registerCypressGrep from '@cypress/grep'
registerCypressGrep()

// Usage in tests
it('should create a goal @smoke', () => {
  // Test implementation
})
```

## Custom Plugin Development

### Creating Custom Tasks

```javascript
// cypress/plugins/custom-tasks.js
const fs = require('fs')
const path = require('path')

module.exports = {
  // Generate test data
  generateTestData: (dataType) => {
    switch (dataType) {
      case 'user':
        return {
          email: `test-${Date.now()}@example.com`,
          password: 'password123',
          name: 'Test User'
        }
      case 'goal':
        return {
          title: `Goal ${Date.now()}`,
          description: `Description ${Date.now()}`,
          targetDate: new Date().toISOString().split('T')[0]
        }
      default:
        return {}
    }
  },
  
  // Validate test data
  validateTestData: (data, schema) => {
    // Implement validation logic
    const requiredFields = schema.required || []
    const missingFields = requiredFields.filter(field => !data[field])
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
    }
    
    return true
  },
  
  // Clean up test artifacts
  cleanupTestArtifacts: () => {
    const artifactsDir = path.join(__dirname, '../screenshots')
    if (fs.existsSync(artifactsDir)) {
      fs.rmSync(artifactsDir, { recursive: true, force: true })
    }
    return null
  }
}
```

### Plugin Configuration

```javascript
// cypress.config.js
const customTasks = require('./cypress/plugins/custom-tasks')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        // Custom tasks
        'generate:user': () => customTasks.generateTestData('user'),
        'generate:goal': () => customTasks.generateTestData('goal'),
        'validate:data': ({ data, schema }) => customTasks.validateTestData(data, schema),
        'cleanup:artifacts': () => customTasks.cleanupTestArtifacts()
      })
    },
  },
})
```

## Environment-Specific Plugins

### Development Environment

```javascript
// cypress.config.dev.js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3001',
    setupNodeEvents(on, config) {
      on('task', {
        // Development-specific tasks
        'dev:reset-db': () => {
          // Reset development database
          return require('./cypress/plugins/dev-reset-db')()
        },
        'dev:seed-data': () => {
          // Seed development data
          return require('./cypress/plugins/dev-seed-data')()
        }
      })
    },
  },
})
```

### Production Environment

```javascript
// cypress.config.prod.js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://goaltracker.com',
    setupNodeEvents(on, config) {
      on('task', {
        // Production-specific tasks
        'prod:backup-data': () => {
          // Backup production data before tests
          return require('./cypress/plugins/prod-backup-data')()
        },
        'prod:restore-data': () => {
          // Restore production data after tests
          return require('./cypress/plugins/prod-restore-data')()
        }
      })
    },
  },
})
```

## Exercise: Plugin Implementation

### Assignment 1: Basic Plugin Setup

**Objective**: Set up basic plugins for common testing tasks

**Tasks**:
1. Install essential plugins (cypress-real-events, cypress-axe)
2. Configure custom tasks for file operations
3. Set up database operations plugin
4. Create environment-specific configurations

**Required Plugins**:
```bash
npm install cypress-real-events cypress-axe --save-dev
```

**Custom Tasks**:
```javascript
on('task', {
  readFile: (filename) => fs.readFileSync(filename, 'utf8'),
  writeFile: ({ filename, content }) => {
    fs.writeFileSync(filename, content)
    return null
  },
  deleteFile: (filename) => {
    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename)
    }
    return null
  }
})
```

**Deliverables**:
- Plugin configuration files
- Custom tasks implementation
- Environment configurations

### Assignment 2: Database Integration

**Objective**: Create plugins for database operations

**Tasks**:
1. Create database reset task
2. Create database seeding task
3. Create test data cleanup task
4. Implement data validation tasks

**Database Tasks**:
```javascript
on('task', {
  'db:reset': () => {
    // Reset database to known state
    return require('./cypress/plugins/db-reset')()
  },
  'db:seed': (data) => {
    // Seed database with test data
    return require('./cypress/plugins/db-seed')(data)
  },
  'db:cleanup': () => {
    // Clean up test data
    return require('./cypress/plugins/db-cleanup')()
  },
  'db:validate': (query) => {
    // Validate database state
    return require('./cypress/plugins/db-validate')(query)
  }
})
```

**Deliverables**:
- Database plugin implementation
- Test data management
- Database validation utilities

### Assignment 3: API Integration

**Objective**: Create plugins for API operations

**Tasks**:
1. Create API request task
2. Create test user management tasks
3. Create API response validation tasks
4. Implement API mocking tasks

**API Tasks**:
```javascript
on('task', {
  'api:request': ({ method, url, data, headers }) => {
    // Make HTTP requests
    return require('./cypress/plugins/api-request')({ method, url, data, headers })
  },
  'api:create-user': (userData) => {
    // Create test user
    return require('./cypress/plugins/api-create-user')(userData)
  },
  'api:delete-user': (userId) => {
    // Delete test user
    return require('./cypress/plugins/api-delete-user')(userId)
  },
  'api:validate-response': ({ response, schema }) => {
    // Validate API response
    return require('./cypress/plugins/api-validate-response')({ response, schema })
  }
})
```

**Deliverables**:
- API plugin implementation
- Test user management
- API validation utilities

### Assignment 4: Advanced Plugin Development

**Objective**: Create advanced plugins for complex scenarios

**Tasks**:
1. Create test data generation plugin
2. Create reporting plugin
3. Create performance monitoring plugin
4. Implement plugin testing

**Advanced Plugins**:
```javascript
// Test data generation
on('task', {
  'generate:test-data': (config) => {
    return require('./cypress/plugins/test-data-generator')(config)
  }
})

// Performance monitoring
on('task', {
  'performance:start': (testName) => {
    return require('./cypress/plugins/performance-monitor').start(testName)
  },
  'performance:end': (testName) => {
    return require('./cypress/plugins/performance-monitor').end(testName)
  }
})

// Custom reporting
on('after:spec', (spec, results) => {
  require('./cypress/plugins/custom-reporter')(spec, results)
})
```

**Deliverables**:
- Advanced plugin implementations
- Performance monitoring tools
- Custom reporting system 