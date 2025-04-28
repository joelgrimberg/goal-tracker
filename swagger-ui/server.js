const express = require("express");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3002;

// Enable CORS
app.use(cors());

// Read the OpenAPI specification
const openApiSpec = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../openapi.json"), "utf8"),
);

// Serve Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Goal Tracker API Documentation",
  }),
);

// Redirect root to API docs
app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

// Start the server
app.listen(port, () => {
  console.log(
    `Swagger UI server is running at http://localhost:${port}/api-docs`,
  );
});

