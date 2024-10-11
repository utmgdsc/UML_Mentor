// Import necessary controller modules and database models
const UserController = require("./UserController");
const SolutionController = require("./SolutionController");
const SolutionInProgressController = require("./SolutionInProgressController");
const ChallengeController = require("./ChallengeController");
const db = require("../models/index");
const STORAGE_CONFIG = require("../storage_config.json");
const fs = require("fs").promises;

// Mock the database and models
jest.mock("../models/index", () => ({
  User: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  Solution: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  SolutionInProgress: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(), // Add this line
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  Challenge: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  Comment: {
    create: jest.fn(),
  },
  sequelize: {
    random: jest.fn(),
  },
}));

// Mock file system operations
jest.mock("fs", () => ({
  promises: {
    unlink: jest.fn(),
  },
}));

// Mock AI feedback module
jest.mock("../AI/AITA", () => ({
  AITA: {
    feedback_for_post: jest.fn(),
  },
}));

// Helper function to create a mock response object for testing
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res); // Add this line
  return res;
};

describe("UserController", () => {
  test("getMe returns user data when user exists", async () => {
    const req = { headers: { utorid: "testuser" } };
    const res = mockResponse();
    const mockUser = { username: "testuser", role: "user", score: 100 };
    db.User.findOne.mockResolvedValue(mockUser);

    await UserController.getMe(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  test("getMe returns 403 when user does not exist", async () => {
    const req = { headers: { utorid: "nonexistentuser" } };
    const res = mockResponse();
    db.User.findOne.mockResolvedValue(null);

    await UserController.getMe(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith("Not authorized");
  });

  test("update updates user data successfully", async () => {
    const req = {
      params: { username: "testuser" },
      body: { email: "test@example.com", role: "admin", score: 200 },
    };
    const res = mockResponse();
    const mockUser = { username: "testuser", update: jest.fn() };
    db.User.findByPk.mockResolvedValue(mockUser);

    await UserController.update(req, res);

    expect(mockUser.update).toHaveBeenCalledWith({
      email: "test@example.com",
      role: "admin",
      score: 200,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  test("getSolvedChallengesTitles returns solved challenge titles", async () => {
    const req = { params: { username: "testuser" } };
    const res = mockResponse();
    const mockSolutions = [
      { Challenge: { title: "Challenge 1" } },
      { Challenge: { title: "Challenge 2" } },
    ];
    db.Solution.findAll.mockResolvedValue(mockSolutions);

    await UserController.getSolvedChallengesTitles(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(["Challenge 1", "Challenge 2"]);
  });

  test("getSolutions returns user solutions", async () => {
    const req = { params: { id: "testuser" } };
    const res = mockResponse();
    const mockUser = {
      getSolutions: jest
        .fn()
        .mockResolvedValue([{ id: 1, title: "Solution 1" }]),
    };
    db.User.findByPk.mockResolvedValue(mockUser);

    await UserController.getSolutions(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  test("getComments returns user comments", async () => {
    const req = { params: { id: "testuser" } };
    const res = mockResponse();
    const mockUser = {
      getComments: jest.fn().mockResolvedValue([{ id: 1, text: "Comment 1" }]),
    };
    db.User.findByPk.mockResolvedValue(mockUser);

    await UserController.getComments(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  // Additional tests for UserController methods can be added here
});

describe("SolutionController", () => {
  test("getNrecent returns recent solutions", async () => {
    const req = { params: { n: 5 }, user: { username: "testuser" } };
    const res = mockResponse();
    const mockSolutions = [
      { id: 1, title: "Solution 1" },
      { id: 2, title: "Solution 2" },
    ];
    db.Solution.findAll.mockResolvedValue(mockSolutions);

    await SolutionController.getNrecent(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockSolutions);
  });

  test("create creates a new solution", async () => {
    const req = {
      body: {
        challengeId: 1,
        title: "New Solution",
        description: "Test description",
      },
      user: { username: "testuser" },
      file: { filename: "test-image.jpg" },
    };
    const res = mockResponse();
    const mockSolution = { id: 1, ...req.body };
    const mockChallenge = { difficulty: "easy" };
    const mockUser = { score: 0, save: jest.fn() };

    db.Solution.create.mockResolvedValue(mockSolution);
    db.Challenge.findByPk.mockResolvedValue(mockChallenge);
    db.User.findByPk.mockResolvedValue(mockUser);
    db.Comment.create.mockResolvedValue({ id: 1, text: "AI Feedback" });

    const { AITA } = require("../AI/AITA");
    AITA.feedback_for_post.mockResolvedValue(["mockRunId", "AI Feedback"]);

    await SolutionController.create(req, res);

    expect(db.Solution.create).toHaveBeenCalledWith({
      challengeId: 1,
      userId: "testuser",
      title: "New Solution",
      description: "Test description",
      diagram: "test-image.jpg",
    });
    expect(AITA.feedback_for_post).toHaveBeenCalled();
    expect(db.Challenge.findByPk).toHaveBeenCalledWith(1);
    expect(db.User.findByPk).toHaveBeenCalledWith("testuser");
    expect(mockUser.save).toHaveBeenCalled();
    expect(db.Comment.create).toHaveBeenCalledWith({
      text: "AI Feedback",
      userId: "AITA",
      solutionId: 1,
      runId: "mockRunId",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockSolution);
  });

  test("getUserSolutions returns solutions for a specific user", async () => {
    const req = { params: { username: "testuser" } };
    const res = mockResponse();
    const mockSolutions = [
      { id: 1, title: "Solution 1" },
      { id: 2, title: "Solution 2" },
    ];
    db.Solution.findAll.mockResolvedValue(mockSolutions);

    await SolutionController.getUserSolutions(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockSolutions);
  });

  test("getAll returns all solutions for admin users", async () => {
    const req = { user: { role: "admin" } };
    const res = mockResponse();
    const mockSolutions = [{ id: 1, challengeId: 1, dataValues: {} }];
    const mockChallenge = { title: "Challenge Title" };
    db.Solution.findAll.mockResolvedValue(mockSolutions);
    db.Challenge.findByPk.mockResolvedValue(mockChallenge);

    await SolutionController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  test("getAll returns filtered solutions for non-admin users", async () => {
    const req = { user: { role: "user", username: "testuser" } };
    const res = mockResponse();
    const mockSolutions = [{ id: 1, challengeId: 1, dataValues: {} }];
    const mockChallenge = { title: "Challenge Title" };
    db.Solution.findAll.mockResolvedValue(mockSolutions);
    db.Challenge.findByPk.mockResolvedValue(mockChallenge);

    await SolutionController.getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  test("get returns a specific solution", async () => {
    const req = {
      params: { id: 1 },
      user: { role: "user", username: "testuser" },
    };
    const res = mockResponse();
    const mockSolution = {
      id: 1,
      challengeId: 1,
      userId: "testuser",
      dataValues: {},
    };
    const mockChallenge = { title: "Challenge Title" };
    const mockUser = { username: "testuser" };
    db.Solution.findByPk.mockResolvedValue(mockSolution);
    db.Challenge.findByPk.mockResolvedValue(mockChallenge);
    db.User.findByPk.mockResolvedValue(mockUser);

    await SolutionController.get(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  test("edit updates a solution", async () => {
    const req = {
      params: { id: 1 },
      body: { title: "Updated Solution", description: "Updated description" },
      user: { username: "testuser" },
      file: { filename: "updated-image.jpg" },
    };
    const res = mockResponse();
    const mockSolution = { id: 1, update: jest.fn(), diagram: "old-image.jpg" };
    db.Solution.findByPk.mockResolvedValue(mockSolution);

    await SolutionController.edit(req, res);

    expect(db.Solution.update).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  describe("delete", () => {
    test("successfully deletes a solution and its associated file", async () => {
      const req = { params: { id: 1 } };
      const res = mockResponse();
      const mockSolution = { id: 1, diagram: "test.jpg" };

      db.Solution.findByPk.mockResolvedValue(mockSolution);
      db.Solution.destroy.mockResolvedValue(1);
      fs.unlink.mockResolvedValue();

      await SolutionController.delete(req, res);

      expect(db.Solution.findByPk).toHaveBeenCalledWith(1);
      expect(db.Solution.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(fs.unlink).toHaveBeenCalledWith(
        expect.stringContaining("test.jpg")
      );
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    test("returns 404 if solution is not found", async () => {
      const req = { params: { id: 999 } };
      const res = mockResponse();

      db.Solution.findByPk.mockResolvedValue(null);

      await SolutionController.delete(req, res);

      expect(db.Solution.findByPk).toHaveBeenCalledWith(999);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Solution not found" });
    });

    test("handles file deletion error", async () => {
      const req = { params: { id: 1 } };
      const res = mockResponse();
      const mockSolution = { id: 1, diagram: "test.jpg" };

      db.Solution.findByPk.mockResolvedValue(mockSolution);
      db.Solution.destroy.mockResolvedValue(1);
      fs.unlink.mockRejectedValue(new Error("File deletion error"));

      await SolutionController.delete(req, res);

      expect(db.Solution.findByPk).toHaveBeenCalledWith(1);
      expect(db.Solution.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(fs.unlink).toHaveBeenCalledWith(
        expect.stringContaining("test.jpg")
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error deleting solution",
      });
    });
  });

  // Additional tests for SolutionController methods can be added here
});

describe("SolutionInProgressController", () => {
  test("findMyInProgress returns in-progress solutions", async () => {
    const req = { user: { username: "testuser" } };
    const res = mockResponse();
    const mockSolutions = [
      { id: 1, title: "In Progress 1" },
      { id: 2, title: "In Progress 2" },
    ];
    db.SolutionInProgress.findAll.mockResolvedValue(mockSolutions);

    await SolutionInProgressController.findMyInProgress(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockSolutions);
  });

  test("findOneByChallengeId returns a specific in-progress solution", async () => {
    const req = { user: { username: "testuser" }, params: { challengeId: 1 } };
    const res = mockResponse();
    const mockSolution = { id: 1, title: "In Progress 1", challengeId: 1 };
    db.SolutionInProgress.findOne.mockResolvedValue(mockSolution);

    await SolutionInProgressController.findOneByChallengeId(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockSolution);
  });

  test("create adds a new in-progress solution", async () => {
    const req = {
      user: { username: "testuser" },
      body: { xml: "<xml></xml>", title: "New Solution", challengeId: 1 },
    };
    const res = mockResponse();
    db.SolutionInProgress.findOne.mockResolvedValue(null);
    db.SolutionInProgress.create.mockResolvedValue({ id: 1, ...req.body });

    await SolutionInProgressController.create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  test("edit updates an in-progress solution", async () => {
    const req = {
      params: { id: 1 },
      body: { xml: "<updated></updated>", title: "Updated Solution" },
    };
    const res = mockResponse();
    const mockSolution = { id: 1, update: jest.fn() };
    db.SolutionInProgress.findByPk = jest.fn().mockResolvedValue(mockSolution);

    await SolutionInProgressController.edit(req, res);

    expect(mockSolution.update).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  test("delete removes an in-progress solution", async () => {
    const req = { params: { id: 1 }, headers: { userid: "testuser" } };
    const res = mockResponse();
    const mockSolution = { id: 1, userId: "testuser", destroy: jest.fn() };
    db.SolutionInProgress.findByPk.mockResolvedValue(mockSolution);

    await SolutionInProgressController.delete(req, res);

    expect(mockSolution.destroy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  // Additional tests for SolutionInProgressController methods can be added here
});

describe("ChallengeController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("findUserInProgress returns challenges for user", async () => {
    const req = { params: { username: "testuser" } };
    const res = mockResponse();
    const mockSolutions = [
      {
        Challenge: {
          id: 1,
          title: "Challenge 1",
          description: JSON.stringify({
            outcome: "Test outcome",
            keyPatterns: ["Pattern 1", "Pattern 2"],
            generalDescription: "Test description",
            usageScenarios: ["Scenario 1", "Scenario 2"],
            expectedFunctionality: "Test functionality",
          }),
          difficulty: "easy",
          hidden: false,
        },
      },
    ];
    db.SolutionInProgress.findAll.mockResolvedValue(mockSolutions);
    db.Solution.findAll.mockResolvedValue([]);

    await ChallengeController.findUserInProgress(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  test("findAll returns all non-hidden challenges", async () => {
    const req = { user: { username: "testuser" } };
    const res = mockResponse();
    const mockChallenges = [
      {
        id: 1,
        title: "Challenge 1",
        hidden: false,
        description: JSON.stringify({
          outcome: "Test outcome",
          keyPatterns: ["Pattern 1", "Pattern 2"],
          generalDescription: "Test description",
          usageScenarios: ["Scenario 1", "Scenario 2"],
          expectedFunctionality: "Test functionality",
        }),
        difficulty: "easy",
      },
      {
        id: 2,
        title: "Challenge 2",
        hidden: false,
        description: JSON.stringify({
          outcome: "Test outcome 2",
          keyPatterns: ["Pattern 3", "Pattern 4"],
          generalDescription: "Test description 2",
          usageScenarios: ["Scenario 3", "Scenario 4"],
          expectedFunctionality: "Test functionality 2",
        }),
        difficulty: "medium",
      },
    ];
    db.Challenge.findAll.mockResolvedValue(mockChallenges);
    db.Solution.findAll.mockResolvedValue([]);

    await ChallengeController.findAll(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  test("create creates a new challenge", async () => {
    const req = {
      body: {
        title: "New Challenge",
        difficulty: "medium",
        outcome: "Test outcome",
        keyPatterns: ["Pattern 1", "Pattern 2"],
        generalDescription: "Test description",
        expectedFunctionality: "Test functionality",
        usageScenarios: ["Scenario 1", "Scenario 2"],
      },
    };
    const res = mockResponse();
    const mockChallenge = {
      id: 1,
      title: "New Challenge",
      difficulty: "medium",
      description: JSON.stringify({
        outcome: "Test outcome",
        keyPatterns: ["Pattern 1", "Pattern 2"],
        generalDescription: "Test description",
        expectedFunctionality: "Test functionality",
        usageScenarios: ["Scenario 1", "Scenario 2"],
      }),
    };
    db.Challenge.create.mockResolvedValue(mockChallenge);

    await ChallengeController.create(req, res);

    expect(db.Challenge.create).toHaveBeenCalledWith({
      title: "New Challenge",
      difficulty: "medium",
      description: expect.any(String),
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockChallenge);
  });

  test("findSuggested returns easy challenges for new users", async () => {
    const req = { user: { username: "newuser" } };
    const res = mockResponse();
    db.Solution.findAll.mockResolvedValue([]);
    db.Challenge.findAll.mockResolvedValue([
      { id: 1, title: "Easy Challenge", difficulty: "easy" },
    ]);

    await ChallengeController.findSuggested(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  test("findHidden returns hidden challenges", async () => {
    const req = { user: { username: "testuser" } };
    const res = mockResponse();
    db.Challenge.findAll.mockResolvedValue([
      { id: 1, title: "Hidden Challenge", hidden: true },
    ]);

    await ChallengeController.findHidden(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  test("hide updates the hidden status of a challenge", async () => {
    const req = { params: { id: 1 }, body: { hidden: true } };
    const res = mockResponse();
    db.Challenge.update.mockResolvedValue([1]);
    db.Challenge.findByPk.mockResolvedValue({
      id: 1,
      title: "Updated Challenge",
      hidden: true,
    });

    await ChallengeController.hide(req, res);

    expect(db.Challenge.update).toHaveBeenCalledWith(
      { hidden: true },
      { where: { id: 1 } }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  // Additional tests for ChallengeController methods can be added here
});
