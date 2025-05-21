---
sidebar_position: 3
---

# Installation

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)

## Quick Installation

The easiest way to install all components is to use the root-level installation script:

```bash
npm run install:all
```

This will install dependencies for:
- Root project
- Frontend application
- Backend API
- SwaggerUI documentation
- Training documentation

## Manual Installation

If you prefer to install components individually, follow these steps:

### Frontend
```bash
cd goal-tracker
npm install
```

### Backend
```bash
cd server
npm install
```

### SwaggerUI
```bash
cd swagger-ui
npm install
```

### Training Documentation
```bash
cd docs
npm install
```

After installation is complete, you can proceed to the [Quickstart Guide](./1-quickstart) to run the application.
