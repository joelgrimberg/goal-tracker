---
sidebar_position: 5
---

# Hands-on API Testing

## Clone & Start Application (Vibe Coded)

[GitHub](https://github.com/joelgrimberg/cypress-training-2025)
https://github.com/joelgrimberg/cypress-training-2025

```bash
git clone https://github.com/joelgrimberg/cypress-training-2025.git

```

Terminal 1:

```bash
cd cypress-training-2025
cd goal-tracker
npm install
npm run dev

```

Terminal 2:

```bash
cd cypress-training-2025
cd server
npm install
npm run dev
```

terminal 3:

```bash
curl -X 'GET' 'http://localhost:3000/feed/goals'
```
