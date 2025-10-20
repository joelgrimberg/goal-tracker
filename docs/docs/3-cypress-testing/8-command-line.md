---
sidebar_position: 8
---

# Command Line Usage

## Running Cypress from Command Line

While Cypress Test Runner provides a great GUI for development and debugging, running tests from the command line is essential for CI/CD pipelines and automated testing.

### Basic Command Line Usage

```bash
# Run all tests in headless mode
npx cypress run

# Run specific test file
npx cypress run --spec "cypress/e2e/login.cy.js"

# Run tests in specific browser
npx cypress run --browser chrome
npx cypress run --browser firefox
npx cypress run --browser edge

# Run tests in headed mode (with browser UI)
npx cypress run --headed
```

### Configuration Options

```bash
# Use specific configuration file
npx cypress run --config-file cypress.config.prod.js

# Override configuration options
npx cypress run --config baseUrl=http://localhost:3001

# Set environment variables
npx cypress run --env apiUrl=http://localhost:3000

# Run with specific viewport
npx cypress run --config viewportWidth=1920,viewportHeight=1080
```

## Advanced Command Line Options

### Test Selection

```bash
# Run tests matching a pattern
npx cypress run --spec "cypress/e2e/**/*.cy.js"

# Run tests in specific folder
npx cypress run --spec "cypress/e2e/authentication/*.cy.js"

# Run tests with specific name pattern
npx cypress run --spec "cypress/e2e/goals.cy.js" --grep "create goal"

# Exclude tests
npx cypress run --spec "cypress/e2e/**/*.cy.js" --grep "skip"
```

### Parallel Execution

```bash
# Run tests in parallel (requires cypress-parallel)
npx cypress-parallel -s cypress/e2e/**/*.cy.js -d cypress -t 4

# Run with specific number of workers
npx cypress-parallel -s cypress/e2e/**/*.cy.js -d cypress -t 2
```

### Output and Reporting

```bash
# Generate JUnit XML report
npx cypress run --reporter junit --reporter-options "mochaFile=results/results-[hash].xml"

# Generate JSON report
npx cypress run --reporter json --reporter-options "output=results/results.json"

# Generate HTML report
npx cypress run --reporter mochawesome

# Verbose output
npx cypress run --verbose
```

## Environment-Specific Commands

### Development Environment

```bash
# Development with hot reload
npm run cypress:dev

# Run tests against development server
npx cypress run --config baseUrl=http://localhost:3001
```

### Staging Environment

```bash
# Run tests against staging
npx cypress run --config baseUrl=https://staging.goaltracker.com

# Use staging environment variables
npx cypress run --env environment=staging
```

### Production Environment

```bash
# Run tests against production
npx cypress run --config baseUrl=https://goaltracker.com

# Use production environment variables
npx cypress run --env environment=production
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/cypress.yml
name: Cypress Tests
on: [push, pull_request]
jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: cypress-io/github-action@v6
        with:
          start: npm run start:all
          wait-on: 'http://localhost:3001'
          browser: chrome
          record: false
          config: baseUrl=http://localhost:3001
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - test

cypress:
  stage: test
  image: cypress/included:12.0.0
  script:
    - npm install
    - npm run start:all &
    - npx wait-on http://localhost:3001
    - npx cypress run --config baseUrl=http://localhost:3001
  artifacts:
    when: always
    paths:
      - cypress/videos/
      - cypress/screenshots/
```

### Jenkins Pipeline

```groovy
// Jenkinsfile
pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                sh 'npm install'
                sh 'npm run start:all &'
                sh 'npx wait-on http://localhost:3001'
                sh 'npx cypress run --config baseUrl=http://localhost:3001'
            }
            post {
                always {
                    archiveArtifacts artifacts: 'cypress/videos/*,cypress/screenshots/*'
                }
            }
        }
    }
}
```

## Performance and Optimization

### Running Tests Faster

```bash
# Run tests in parallel
npx cypress-parallel -s cypress/e2e/**/*.cy.js -d cypress -t 4

# Use specific browser for speed
npx cypress run --browser chrome --headless

# Disable video recording for speed
npx cypress run --config video=false

# Disable screenshots for speed
npx cypress run --config screenshotOnRunFailure=false
```

### Memory Optimization

```bash
# Limit memory usage
npx cypress run --config numTestsKeptInMemory=0

# Clean up after each test
npx cypress run --config trashAssetsBeforeRuns=true
```

## Debugging Command Line Issues

### Verbose Logging

```bash
# Enable debug logging
DEBUG=cypress:* npx cypress run

# Enable specific debug categories
DEBUG=cypress:server:util:process_profiler npx cypress run

# Verbose output
npx cypress run --verbose
```

### Troubleshooting Commands

```bash
# Check Cypress installation
npx cypress verify

# Open Cypress to check configuration
npx cypress open

# Run with specific configuration
npx cypress run --config-file cypress.config.debug.js
```

## Custom Scripts and Automation

### Package.json Scripts

```json
{
  "scripts": {
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "cypress:run:chrome": "cypress run --browser chrome",
    "cypress:run:firefox": "cypress run --browser firefox",
    "cypress:run:headed": "cypress run --headed",
    "cypress:run:dev": "cypress run --config baseUrl=http://localhost:3001",
    "cypress:run:staging": "cypress run --config baseUrl=https://staging.goaltracker.com",
    "cypress:run:prod": "cypress run --config baseUrl=https://goaltracker.com",
    "cypress:run:parallel": "cypress-parallel -s cypress/e2e/**/*.cy.js -d cypress -t 4",
    "cypress:run:smoke": "cypress run --spec \"cypress/e2e/smoke/*.cy.js\"",
    "cypress:run:regression": "cypress run --spec \"cypress/e2e/regression/*.cy.js\"",
    "test:e2e": "start-server-and-test start:all http://localhost:3001 cypress:run"
  }
}
```

### Custom Shell Scripts

```bash
#!/bin/bash
# run-tests.sh

# Set environment
ENVIRONMENT=${1:-dev}
BROWSER=${2:-chrome}

echo "Running Cypress tests for $ENVIRONMENT environment with $BROWSER browser"

# Set base URL based on environment
case $ENVIRONMENT in
  "dev")
    BASE_URL="http://localhost:3001"
    ;;
  "staging")
    BASE_URL="https://staging.goaltracker.com"
    ;;
  "prod")
    BASE_URL="https://goaltracker.com"
    ;;
  *)
    echo "Unknown environment: $ENVIRONMENT"
    exit 1
    ;;
esac

# Run tests
npx cypress run \
  --browser $BROWSER \
  --config baseUrl=$BASE_URL \
  --env environment=$ENVIRONMENT \
  --reporter mochawesome \
  --reporter-options "reportDir=cypress/reports,overwrite=true,html=true,json=true"
```

## Exercise: Command Line Practice

### Assignment 1: Basic Command Line Setup

**Objective**: Set up and run Cypress tests from command line

**Tasks**:
1. Install Cypress and configure command line scripts
2. Run tests in different browsers
3. Run tests in headed and headless modes
4. Configure different environments

**Required Scripts**:
```json
{
  "scripts": {
    "cypress:open": "cypress open",
    "cypress:run": "cypress run",
    "cypress:run:chrome": "cypress run --browser chrome",
    "cypress:run:firefox": "cypress run --browser firefox",
    "cypress:run:headed": "cypress run --headed",
    "cypress:run:dev": "cypress run --config baseUrl=http://localhost:3001",
    "cypress:run:staging": "cypress run --config baseUrl=https://staging.goaltracker.com"
  }
}
```

**Deliverables**:
- Package.json scripts
- Test execution examples
- Environment configuration

### Assignment 2: CI/CD Integration

**Objective**: Integrate Cypress tests into CI/CD pipeline

**Tasks**:
1. Create GitHub Actions workflow
2. Configure test execution in CI
3. Set up artifact collection
4. Implement test reporting

**CI Configuration**:
```yaml
name: Cypress Tests
on: [push, pull_request]
jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - uses: cypress-io/github-action@v6
        with:
          start: npm run start:all
          wait-on: 'http://localhost:3001'
          browser: chrome
          record: false
```

**Deliverables**:
- CI/CD configuration files
- Test execution workflow
- Artifact collection setup

### Assignment 3: Performance Optimization

**Objective**: Optimize test execution performance

**Tasks**:
1. Implement parallel test execution
2. Optimize test configuration for speed
3. Set up test categorization (smoke, regression)
4. Measure and document performance improvements

**Performance Optimizations**:
```bash
# Parallel execution
npx cypress-parallel -s cypress/e2e/**/*.cy.js -d cypress -t 4

# Speed optimizations
npx cypress run --config video=false,screenshotOnRunFailure=false

# Test categorization
npm run cypress:run:smoke
npm run cypress:run:regression
```

**Deliverables**:
- Performance optimization configuration
- Test categorization setup
- Performance measurement results

### Assignment 4: Advanced Automation

**Objective**: Create advanced automation scripts

**Tasks**:
1. Create custom shell scripts for test execution
2. Implement environment-specific configurations
3. Set up automated test reporting
4. Create test execution monitoring

**Advanced Scripts**:
```bash
#!/bin/bash
# run-tests.sh

ENVIRONMENT=${1:-dev}
BROWSER=${2:-chrome}
PARALLEL=${3:-false}

echo "Running tests for $ENVIRONMENT with $BROWSER"

if [ "$PARALLEL" = "true" ]; then
  npx cypress-parallel -s cypress/e2e/**/*.cy.js -d cypress -t 4
else
  npx cypress run --browser $BROWSER --config baseUrl=$BASE_URL
fi
```

**Deliverables**:
- Custom automation scripts
- Environment management
- Test monitoring setup 