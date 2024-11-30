const session = require("express-session");
const express = require("express");
const path = require("node:path");
const db = require("./models");
const importChallenges = require("./scripts/importChallenges");
const { ErrorHandler } = require("./middleware/ErrorHandlingMiddleware");
const loggingMiddleware = require("./middleware/LoggingMiddleware");
const createAITAUser = require("./scripts/createAITAUser");
const createAdmins = require("./scripts/createAdmins");
const authMiddleware = require("./middleware/AuthenticationMiddleware");
const checkRole = require("./middleware/CheckRoleMiddleware");

// const OPENAI_API_KEY = 'openai-api-key'; // Replace with your OpenAI API key
require("dotenv").config();

// Import OpenAI SDK
const { Configuration, OpenAI } = require("openai");

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb" }));

const PORT = process.env.PORT || 8080;

// Set up API routes
const challenges = require("./routes/ChallengeRoutes");
const solutions = require("./routes/SolutionRoutes");
const users = require("./routes/UserRoutes");
const comments = require("./routes/CommentRoutes");
const SolutionInProgress = require("./routes/SolutionInProgressRoutes");
const aiRoutes = require("./routes/AIRoutes");
const guardrailsRoutes = require("./routes/guardrailsRoutes");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
});

// AI chat route
app.post("/api/openai-chat", authMiddleware, async (req, res) => {
  const { umlData, challengeName, challengeDescription } = req.body;
  const systemPrompt = `You are an expert software architect and educator specializing in UML diagram analysis. 
    Your task is to:
    1. Analyze the provided UML diagram for correctness and best practices
    2. Evaluate how well it solves the given challenge
    3. Suggest specific improvements
    4. Check for SOLID principle violations
    5. Assess the overall design quality
    
    Format your response in clear sections:
    - Overall Assessment
    - Design Strengths
    - Areas for Improvement
    - SOLID Principles Analysis
    - Specific Recommendations`;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or another model of your choice
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `
      Challenge Title: ${challengeName}
      Challenge Description: ${challengeDescription}
      
      ${umlData}
      
      Please provide a comprehensive analysis of this UML diagram in relation to the challenge.`,
        },
      ],
    });

    const aiReply = response.choices[0].message.content.trim();
    res.json({ reply: aiReply });
  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Error communicating with OpenAI." });
  }
});

//For testing purposes
app.post("/test-auth", authMiddleware, (req, res) => {
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
app.use("/api/ai", aiRoutes);
app.use("/api/guardrails", guardrailsRoutes);
app.use(ErrorHandler);

// ENV FILE SPECIFICATION
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

// Sync Sequelize models
db.sequelize.sync().then(async () => {
  console.log("Database synced");
  // await importChallenges();
  // await createAITAUser(); // Uncomment if you want to create a user
  // await createAdmins();

  // Start listening for requests after the database is ready
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
});
