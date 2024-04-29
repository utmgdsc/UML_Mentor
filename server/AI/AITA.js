const fs = require("fs").promises;
const { ChatOpenAI } = require("@langchain/openai");
const {
  ChatPromptTemplate,
  MessagesPlaceholder,
} = require("@langchain/core/prompts");
const { HumanMessage, AIMessage } = require("@langchain/core/messages");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { Client } = require("langsmith");

const langsmithClient = new Client();

class AITA {
  static async feedback_for_post(solution, challenge, diagramLocation) {
    // TODO: rescale the image
    // TODO: discuss possible extension like chat, global chat, RAG /w course documents
    console.log(`Getting feedback for solution ${solution.id}`);

    const diagramBuffer = await fs.readFile(diagramLocation);
    const diagramb64 = diagramBuffer.toString("base64");
    const systemPromptText = await fs.readFile("./server/AI/SystemPrompt.md");
    console.log(systemPromptText);

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", systemPromptText],
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

    let chainRunId;
    const feedback = await chain.invoke(
      {
        challenge_title: challenge.title,
        challenge_description: challenge.description,
        solution_title: solution.title,
        solution_description: solution.description,
      },
      {
        callbacks: [
          {
            handleChainStart(_llm, _prompt, runId, parentRunId) {
              chainRunId = parentRunId;
            },
          },
        ],
      },
    );

    return [chainRunId, feedback];
  }
  static async feedback_for_comment(comment_chain, challenge, solution) {
    // Not in use
    // console.log(comment_chain);
    // console.log(challenge);
    // console.log(solution);

    // Comment chain starts from the top-most comment and goes down to the individual reply.
    // Must be alternating between one user and one ai comment, top one being ai
    const comments = [];

    for (let i = 0; i < comment_chain.length; i += 1) {
      if (i % 2 === 0) {
        comments.push(new AIMessage(comment_chain[i].text));
      } else {
        comments.push(new HumanMessage(comment_chain[i].text));
      }
    }

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are a teaching assistant for a software architecture course. You are excellent at providing" +
          " feedback to solutions written by users to software architecture challenges, including questions about UML" +
          " diagrams, software architecture patterns and SOLID principles. Provide" +
          " extensive and helpful feedback as a teaching assistant.",
      ],
      [
        "user",
        "Challenge: {challenge_title}\n{challenge_description}\n" +
          "\nSolution: {solution_title}\n{solution_description}",
      ],
      new MessagesPlaceholder("comments"),
    ]);

    const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo" });
    const outputParser = new StringOutputParser();

    const chain = prompt.pipe(model).pipe(outputParser);

    let chainRunId;
    const feedback = await chain.invoke(
      {
        challenge_title: challenge.title,
        challenge_description: challenge.description,
        solution_title: solution.title,
        solution_description: solution.description,
        comments,
      },
      {
        callbacks: [
          {
            handleChainStart(_llm, _prompt, runId, parentRunId) {
              chainRunId = parentRunId;
            },
          },
        ],
      },
    );

    return [chainRunId, feedback];
  }

  static async upvote(runId) {
    await langsmithClient.createFeedback(runId, "user_upvote", {
      feedbackSourceType: "app",
    });
  }
}

exports.AITA = AITA;
