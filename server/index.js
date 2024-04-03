const express = require("express");
const path = require("node:path");
const db = require("./models");
const importChallenges = require("./scripts/importChallenges");

const { ErrorHandler } = require("./middleware/ErrorHandlingMiddleware");
const loggingMiddleware = require("./middleware/LoggingMiddleware");
const authMiddleware = require("./middleware/AuthenticationMiddleware");
const createAITAUser = require("./scripts/createAITAUser");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8080;

// Set up API routes
const challenges = require("./routes/ChallengeRoutes");
const solutions = require("./routes/SolutionRoutes");
const users = require("./routes/UserRoutes");
const comments = require("./routes/CommentRoutes");
const SolutionInProgress = require("./routes/SolutionInProgressRoutes");

app.use(loggingMiddleware);

// Sync Sequelize models
db.sequelize.sync().then(async () => {
  // Use { force: true } cautiously as it will drop existing tables
  console.log("Database synced");

  // import the challenges into the db. Comment out after first run
  // Also create the AI user
  // await importChallenges();
  // await createAITAUser();

  // Start listening for requests after the database is ready
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
});

// Set up API routes
app.use(authMiddleware);

app.use("/api/challenges", challenges);
app.use("/api/solutions", solutions);
app.use("/api/inprogress", SolutionInProgress);
app.use("/api/users", users);
app.use("/api/comments", comments);

app.use(ErrorHandler);

// ENV FILE SPECIFICATION
// PROD=prod|dev -> prod runs in production mode
//
if (process.env?.ENV === "prod") {
  console.log("!!! RUNNING IN PRODUCTION MODE !!!");
  app.use(express.static(path.resolve(__dirname, "../client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
  });
}

if (process.env?.ENV === "dev") {
  console.log("===[ Running in Dev Mode ]===");
}
