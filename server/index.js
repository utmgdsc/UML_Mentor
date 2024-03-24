const express = require("express");
const path = require("node:path");
const db = require("./models");
const importChallenges = require("./scripts/importChallenges");
const { ErrorHandler } = require("./middleware/ErrorHandlingMiddleware");
const loggingMiddleware = require("./middleware/LoggingMiddleware");
const authMiddleware = require("./middleware/AuthenticationMiddleware");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8080;

// For testing purposes
// app.post('/test-auth', authMiddleware, (req, res) => {
//   const user = req.user;

//   const userInfo = {
//       id: user.id,
//       username: user.username,
//       email: user.email,
//       role: user.role,
//   };

//   res.json(userInfo);
// });

// Sync Sequelize models
db.sequelize.sync().then(async () => {
  // Use { force: true } cautiously as it will drop existing tables
  console.log("Database synced");

  // import the challenges into the db. Comment out after first run
  // await importChallenges();

  // Start listening for requests after the database is ready
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
});

// Set up API routes
const challenges = require("./routes/ChallengeRoutes");
const solutions = require("./routes/SolutionRoutes");
const users = require("./routes/UserRoutes");
const comments = require("./routes/CommentRoutes");

app.use(loggingMiddleware);
app.use(authMiddleware);

app.use("/api/challenges", challenges);
app.use("/api/solutions", solutions);
app.use("/api/users", users);
app.use("/api/comments", comments);

app.use(ErrorHandler);

//uncomment for production
// app.use(express.static(path.resolve(__dirname, "../client/dist")))

//Send all non-api requests to the React app.
//uncomment for production
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"))
// })

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
