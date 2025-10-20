---
sidebar_position: 2
---

# Test Triangle & Test Trophy

## Understanding the Testing Pyramid

The Testing Pyramid is a metaphor that helps teams create high-quality software efficiently. It suggests that you should have many more low-level unit tests than high-level end-to-end tests.

### Traditional Testing Pyramid

```
                    /\
                   /  \     ← Few E2E Tests
                  /____\
                 /      \   ← Some Integration Tests
                /________\
               /          \ ← Many Unit Tests
              /____________\
```

### Test Triangle Components

#### 1. Unit Tests (Base - Many)
- **What**: Test individual functions, methods, or components in isolation
- **Scope**: Smallest unit of code
- **Speed**: Fastest (milliseconds)
- **Cost**: Lowest
- **Maintenance**: Easy
- **Tools**: Jest, Mocha, Vitest

#### 2. Integration Tests (Middle - Some)
- **What**: Test how multiple units work together
- **Scope**: Multiple components or services
- **Speed**: Medium (seconds)
- **Cost**: Medium
- **Maintenance**: Moderate
- **Tools**: Supertest, API testing tools

#### 3. End-to-End Tests (Top - Few)
- **What**: Test complete user workflows
- **Scope**: Entire application
- **Speed**: Slowest (minutes)
- **Cost**: Highest
- **Maintenance**: Difficult
- **Tools**: Cypress, Selenium, Playwright

## The Test Trophy

Kent C. Dodds introduced the "Test Trophy" as an evolution of the testing pyramid, emphasizing that different types of tests serve different purposes.

### Test Trophy Components

```
                    /\
                   /  \     ← E2E Tests
                  /____\
                 /      \   ← Integration Tests
                /________\
               /          \ ← Unit Tests
              /____________\
             /              \ ← Static Tests
            /________________\
```

#### 4. Static Tests (Foundation)
- **What**: Catch errors without running code
- **Examples**: TypeScript, ESLint, Prettier
- **Benefits**: Catch errors early, improve code quality

## What to Test Where

### Unit Tests - Test These
- Individual functions and methods
- Business logic
- Data transformations
- Utility functions
- Component rendering (in isolation)

### Integration Tests - Test These
- API endpoints
- Database interactions
- Service layer integration
- Component integration
- Authentication flows

### E2E Tests - Test These
- Critical user journeys
- Complete workflows
- Cross-browser compatibility
- Performance under load
- User experience validation

### Static Tests - Catch These
- Type errors
- Code style violations
- Potential bugs
- Security vulnerabilities