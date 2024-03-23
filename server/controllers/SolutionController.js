const fs = require("fs").promises;
const STORAGE_CONFIG = require("../storage_config.json");
const db = require("../models/index");
const { HandledError } = require("../routes/ErrorHandlingMiddleware");
const Solution = db.Solution;
const Comment = db.Comment;
const Challenge = db.Challenge;

exports.getAll = async (req, res) => {
  const solutions = await Solution.findAll();
  res.status(200).json(solutions);
};

exports.get = async (req, res) => {
  const { id } = req.params;
  const solutions = await Solution.findByPk(id);
  res.status(200).json(solutions);
};

exports.getComments = async (req, res) => {
  const { id } = req.params;
  const solution = await Solution.findByPk(id);
  if (!solution) {
    throw HandledError(404, "Solution not found");
  }
  const comments = await solution.getComments();
  res.status(200).json(comments);
};

exports.create = async (req, res) => {
  const { challengeId, userId, title, description } = req.body;
  const { filename: diagram } = req.file;

  const newSolution = await Solution.create({
    challengeId,
    userId,
    title,
    description,
    diagram,
  });
  res.status(201).json(newSolution);
};

exports.edit = async (req, res) => {
  // TODO: make sure only the owner can make edits.
  const { file } = req;
  const { challengeId, userId, description, title, id } = req.body;

  const updateData = {};

  if (challengeId !== null && challengeId !== undefined) {
    updateData.challengeId = challengeId;
  }
  if (userId !== null && userId !== undefined) {
    updateData.userId = userId;
  }
  if (description !== null && description !== undefined) {
    updateData.description = description;
  }
  if (title !== null && title !== undefined) {
    updateData.title = title;
  }

  if (file && STORAGE_CONFIG.delete_on_edit) {
    // delete the old file

    const solution = await Solution.findByPk(id);
    // TODO: construct a path in a better way
    await fs.unlink(`${STORAGE_CONFIG.location}/${solution.diagram}`);
  }

  if (file) {
    updateData.diagram = file.filename;
  }

  if (Object.keys(updateData).length > 0) {
    await Solution.update(updateData, { where: { id } });
  }

  const updatedSolution = await Solution.findByPk(id);
  res.status(200).json(updatedSolution);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await Solution.destroy({ where: { id } });
  res.status(204).send();
};

const { ChatOpenAI } = require("@langchain/openai");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { StringOutputParser } = require("@langchain/core/output_parsers");

exports.getAIFeedback = async (req, res) => {
  // TODO: rescale the image
  // TODO: webrtc streaming back to the user
  // TODO: add feedback to the database
  // TODO: discuss possible extension like chat, global chat, RAG /w course documents

  const { id } = req.params;
  const solution = await Solution.findByPk(id);

  const challenge = await Challenge.findByPk(solution.challengeId);
  const diagramBuffer = await fs.readFile(
    `${STORAGE_CONFIG.location}/${solution.diagram}`,
  );
  const diagramb64 = diagramBuffer.toString("base64");

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a teaching assistant for a software architecture course. You are excellent at providing" +
        " feedback to solutions written by users to software architecture challenges, including questions about UML" +
        " diagrams, software architecture patterns and SOLID principles. The images you receive will be of UML" +
        " diagrams. Provide" +
        " extensive and helpful feedback as a teaching assistant.",
    ],
    [
      "user",
      [
        "Challenge: {challenge_title}\n{challenge_description}\n" +
          "\nSolution: {solution_title}\n{solution_description}",
        { image_url: `data:image/jpeg;base64,${diagramb64}` },
      ],
    ],
  ]);
  const model = new ChatOpenAI({ modelName: "gpt-4-vision-preview" });
  const outputParser = new StringOutputParser();

  const chain = prompt.pipe(model).pipe(outputParser);

  const response = await chain.invoke({
    challenge_title: challenge.title,
    challenge_description: challenge.description,
    solution_title: solution.title,
    solution_description: solution.description,
  });

  res.status(200).json({
    status: "ok",
    response,
  });
};
