---
sidebar_position: 10
---

# CI/CD Pipeline Integration

## Understanding CI/CD with Cypress

Continuous Integration/Continuous Deployment (CI/CD) pipelines automate the testing process, ensuring that your Cypress tests run automatically whenever code changes are made. This helps catch issues early and maintain code quality.

### Benefits of CI/CD Integration

1. **Automated Testing**: Tests run automatically on every code change
2. **Early Bug Detection**: Issues are caught before they reach production
3. **Consistent Environment**: Tests run in a controlled, reproducible environment
4. **Quality Gates**: Prevent deployment of broken code
5. **Team Collaboration**: Everyone can see test results and status

## CI/CD Pipeline Architecture

### Basic Pipeline Flow

```
Code Push → Build → Test → Deploy
    ↓         ↓       ↓       ↓
  Trigger   Compile  Cypress  Release
```

### Cypress in the Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                    CI/CD Pipeline                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Build     │  │   Test      │  │   Deploy    │        │
│  │             │  │             │  │             │        │
│  │ - Install   │  │ - Start App │  │ - Deploy    │        │
│  │ - Compile   │  │ - Run Tests │  │ - Verify    │        │
│  │ - Build     │  │ - Report    │  │ - Monitor   │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

## GitHub Actions Integration

### Basic GitHub Actions Workflow

```yaml
# .github/workflows/cypress.yml
name: Cypress Tests
on: [push, pull_request]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Start application
        run: npm run start:all &
      
      - name: Wait for application
        run: npx wait-on http://localhost:3001
      
      - name: Run Cypress tests
        uses: cypress-io/github-action@v6
        with:
          start: npm run start:all
          wait-on: 'http://localhost:3001'
          browser: chrome
          record: false
          config: baseUrl=http://localhost:3001
      
      - name: Upload screenshots
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots
      
      - name: Upload videos
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: cypress-videos
          path: cypress/videos
```

### Advanced GitHub Actions Workflow

```yaml
# .github/workflows/cypress-advanced.yml
name: Cypress Advanced Tests
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  CYPRESS_baseUrl: http://localhost:3001

jobs:
  cypress-smoke:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        containers: [1, 2, 3, 4]
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Start application
        run: npm run start:all &
      
      - name: Wait for application
        run: npx wait-on http://localhost:3001
      
      - name: Run Cypress tests
        uses: cypress-io/github-action@v6
        with:
          start: npm run start:all
          wait-on: 'http://localhost:3001'
          browser: chrome
          record: false
          parallel: true
          group: 'Smoke Tests'
          spec: 'cypress/e2e/smoke/*.cy.js'
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results-${{ matrix.containers }}
          path: cypress/results/
      
      - name: Generate test report
        if: always()
        run: |
          npm run generate-report
      
      - name: Upload test report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-report
          path: cypress/reports/
```

## GitLab CI Integration

### Basic GitLab CI Configuration

```yaml
# .gitlab-ci.yml
stages:
  - test
  - report

variables:
  CYPRESS_baseUrl: "http://localhost:3001"

cypress:
  stage: test
  image: cypress/included:12.0.0
  services:
    - name: cypress/included:12.0.0
      alias: cypress
  before_script:
    - npm ci
  script:
    - npm run start:all &
    - npx wait-on http://localhost:3001
    - npx cypress run --config baseUrl=http://localhost:3001
  artifacts:
    when: always
    paths:
      - cypress/videos/
      - cypress/screenshots/
      - cypress/results/
    expire_in: 1 week
  retry:
    max: 2
    when:
      - runner_system_failure
      - stuck_or_timeout_failure
```

### Advanced GitLab CI Configuration

```yaml
# .gitlab-ci.yml
stages:
  - test
  - report
  - deploy

variables:
  CYPRESS_baseUrl: "http://localhost:3001"
  CYPRESS_VIDEO: "true"
  CYPRESS_SCREENSHOT: "true"

.cypress_template: &cypress_template
  image: cypress/included:12.0.0
  before_script:
    - npm ci
  artifacts:
    when: always
    paths:
      - cypress/videos/
      - cypress/screenshots/
      - cypress/results/
    expire_in: 1 week
  retry:
    max: 2
    when:
      - runner_system_failure
      - stuck_or_timeout_failure

cypress-smoke:
  <<: *cypress_template
  stage: test
  script:
    - npm run start:all &
    - npx wait-on http://localhost:3001
    - npx cypress run --spec "cypress/e2e/smoke/*.cy.js"
  only:
    - merge_requests
    - main

cypress-regression:
  <<: *cypress_template
  stage: test
  script:
    - npm run start:all &
    - npx wait-on http://localhost:3001
    - npx cypress run --spec "cypress/e2e/regression/*.cy.js"
  only:
    - main
  when: manual

generate-report:
  stage: report
  image: node:18
  script:
    - npm ci
    - npm run generate-report
  artifacts:
    paths:
      - cypress/reports/
    expire_in: 1 month
  only:
    - main
```

## Jenkins Pipeline Integration

### Basic Jenkins Pipeline

```groovy
// Jenkinsfile
pipeline {
    agent any
    
    environment {
        CYPRESS_BASE_URL = 'http://localhost:3001'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Start Application') {
            steps {
                sh 'npm run start:all &'
                sh 'npx wait-on http://localhost:3001'
            }
        }
        
        stage('Run Cypress Tests') {
            steps {
                sh 'npx cypress run --config baseUrl=http://localhost:3001'
            }
            post {
                always {
                    archiveArtifacts artifacts: 'cypress/videos/*,cypress/screenshots/*'
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
    }
}
```

### Advanced Jenkins Pipeline

```groovy
// Jenkinsfile
pipeline {
    agent any
    
    environment {
        CYPRESS_BASE_URL = 'http://localhost:3001'
        NODE_OPTIONS = '--max-old-space-size=4096'
    }
    
    parameters {
        choice(
            name: 'TEST_TYPE',
            choices: ['smoke', 'regression', 'all'],
            description: 'Select test type to run'
        )
        booleanParam(
            name: 'PARALLEL',
            defaultValue: false,
            description: 'Run tests in parallel'
        )
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Start Application') {
            steps {
                sh 'npm run start:all &'
                sh 'npx wait-on http://localhost:3001'
            }
        }
        
        stage('Run Tests') {
            parallel {
                stage('Smoke Tests') {
                    when {
                        anyOf {
                            expression { params.TEST_TYPE == 'smoke' }
                            expression { params.TEST_TYPE == 'all' }
                        }
                    }
                    steps {
                        script {
                            if (params.PARALLEL) {
                                sh 'npx cypress-parallel -s cypress/e2e/smoke/*.cy.js -d cypress -t 2'
                            } else {
                                sh 'npx cypress run --spec "cypress/e2e/smoke/*.cy.js"'
                            }
                        }
                    }
                }
                
                stage('Regression Tests') {
                    when {
                        anyOf {
                            expression { params.TEST_TYPE == 'regression' }
                            expression { params.TEST_TYPE == 'all' }
                        }
                    }
                    steps {
                        script {
                            if (params.PARALLEL) {
                                sh 'npx cypress-parallel -s cypress/e2e/regression/*.cy.js -d cypress -t 2'
                            } else {
                                sh 'npx cypress run --spec "cypress/e2e/regression/*.cy.js"'
                            }
                        }
                    }
                }
            }
        }
        
        stage('Generate Report') {
            steps {
                sh 'npm run generate-report'
            }
            post {
                always {
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'cypress/reports',
                        reportFiles: 'index.html',
                        reportName: 'Cypress Test Report'
                    ])
                }
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: 'cypress/videos/*,cypress/screenshots/*,cypress/reports/*'
            cleanWs()
        }
        success {
            echo 'All tests passed!'
        }
        failure {
            echo 'Some tests failed!'
        }
    }
}
```

## Environment-Specific Configurations

### Development Environment

```yaml
# .github/workflows/cypress-dev.yml
name: Cypress Development Tests
on:
  push:
    branches: [develop]

jobs:
  cypress-dev:
    runs-on: ubuntu-latest
    environment: development
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run start:all &
      - run: npx wait-on http://localhost:3001
      - uses: cypress-io/github-action@v6
        with:
          start: npm run start:all
          wait-on: 'http://localhost:3001'
          config: baseUrl=http://localhost:3001
          env: environment=development
```

### Staging Environment

```yaml
# .github/workflows/cypress-staging.yml
name: Cypress Staging Tests
on:
  push:
    branches: [main]

jobs:
  cypress-staging:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - uses: cypress-io/github-action@v6
        with:
          config: baseUrl=https://staging.goaltracker.com
          env: environment=staging
```

### Production Environment

```yaml
# .github/workflows/cypress-prod.yml
name: Cypress Production Tests
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to test'
        required: true
        default: 'production'
        type: choice
        options:
          - production
          - staging

jobs:
  cypress-prod:
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment }}
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - uses: cypress-io/github-action@v6
        with:
          config: baseUrl=https://goaltracker.com
          env: environment=${{ github.event.inputs.environment }}
```

## Exercise: CI/CD Pipeline Setup

### Assignment 1: Basic CI/CD Setup

**Objective**: Set up basic CI/CD pipeline with Cypress

**Tasks**:
1. Create GitHub Actions workflow
2. Configure test execution
3. Set up artifact collection
4. Implement basic reporting

**Basic Workflow**:
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

### Assignment 2: Advanced CI/CD Features

**Objective**: Implement advanced CI/CD features

**Tasks**:
1. Set up parallel test execution
2. Implement test categorization
3. Add environment-specific configurations
4. Create comprehensive reporting

**Advanced Features**:
- Parallel test execution
- Test categorization (smoke, regression)
- Environment-specific configurations
- Comprehensive reporting

**Deliverables**:
- Advanced CI/CD configuration
- Parallel execution setup
- Test categorization implementation

### Assignment 3: Multi-Environment Pipeline

**Objective**: Create pipeline for multiple environments

**Tasks**:
1. Create development environment pipeline
2. Create staging environment pipeline
3. Create production environment pipeline
4. Implement environment-specific configurations

**Environment Configurations**:
- Development: Local testing
- Staging: Pre-production testing
- Production: Live environment testing

**Deliverables**:
- Multi-environment pipeline
- Environment-specific configurations
- Deployment strategies

### Assignment 4: Pipeline Optimization

**Objective**: Optimize CI/CD pipeline for performance and reliability

**Tasks**:
1. Implement caching strategies
2. Optimize test execution time
3. Add failure handling and retry logic
4. Implement monitoring and alerting

**Optimization Strategies**:
- Dependency caching
- Test parallelization
- Failure handling
- Performance monitoring

**Deliverables**:
- Optimized pipeline configuration
- Performance improvements
- Monitoring and alerting setup 