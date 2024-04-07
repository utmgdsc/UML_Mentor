const session = require('express-session');
const express = require("express");
const path = require("node:path");
const db = require("./models");
const importChallenges = require("./scripts/importChallenges");
const { ErrorHandler } = require("./middleware/ErrorHandlingMiddleware");
const loggingMiddleware = require("./middleware/LoggingMiddleware");
const createAITAUser = require("./scripts/createAITAUser");
const authMiddleware = require('./middleware/AuthenticationMiddleware');
const checkRole = require("./middleware/CheckRoleMiddleware");

const app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

const PORT = process.env.PORT || 8080;


// Set up API routes
const challenges = require("./routes/ChallengeRoutes");
const solutions = require("./routes/SolutionRoutes");
const users = require("./routes/UserRoutes");
const comments = require("./routes/CommentRoutes");
const SolutionInProgress = require("./routes/SolutionInProgressRoutes");

//For testing purposes
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

//For testing purposes - admin
app.get('/test-protected', checkRole(['admin']), (req, res) => {
  res.send('Welcome, admin!');
});



app.use(loggingMiddleware);
app.use(authMiddleware);

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

//For testing purposes
app.post('/test-auth', authMiddleware, (req, res) => {
  const user = req.user;

  const userInfo = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
  };

  res.json(userInfo);
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

