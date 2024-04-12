const db = require("../models/index");
const Comment = db.Comment;
const Challenge = db.Challenge;
const Solution = db.Solution;
const { AITA } = require("../AI/AITA");

function formatComments(comments) {
  const extracted = comments.map(
    ({ id, text, User, userId, solutionId, upVotes, replies }) => ({
      id,
      text,
      userId,
      username: User.username,
      solutionId,
      upVotes,
      replies,
    }),
  );

  const convertedReplies = extracted.map((c) => ({
    ...c,
    replies: c.replies
      .split(",")
      .filter((r) => r.length !== 0)
      .map((r) => Number(r)),
  }));

  // console.log("Converted Replies", convertedReplies);

  const replyIds = [];

  function replaceReplies(cms, cm) {
    // console.log(`Calling replaceReplies for ${cm.id}`, cms);
    if (cm.replies.length === 0) {
      // Leaf Node
      // console.log("LEAF NODE", cm);
      return cm;
    }

    if (typeof cm.replies[0] === "object") {
      // Already replaced, skip
      // console.log("Skipping", cm);
      return cm;
    }

    // console.log("Before replacing", cm);

    // Replace replies of the current node
    cm.replies = cm.replies.map((r) => {
      const out = cms.filter((c) => c.id === r)[0];
      replyIds.push(out.id);
      // console.log(`Reply for ${cm.text} found: ${out.id}.`);
      return replaceReplies(cms, out);
    });

    // console.log(cm);
    return cm;
  }

  const convertedRepliesCopy = JSON.parse(JSON.stringify(convertedReplies));

  const repliesIntegrated = convertedRepliesCopy.map((c) =>
    replaceReplies(convertedRepliesCopy, c),
  );
  //
  // console.log(replyIds);

  const repliesIntegratedPurged = repliesIntegrated.filter(
    (c) => !replyIds.includes(c.id),
  );

  return repliesIntegratedPurged;
}

exports.get = async (req, res) => {
  const { solutionId } = req.params;
  try {
    const comments = await Comment.findAll({
      where: { solutionId },
      include: [{
        model: db.User,
        attributes: ['username'],  
        as: 'User'
      }]
    });

    const formatted = formatComments(comments);
    res.status(200).json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching comments");
  }
};


exports.create = async (req, res) => {
  const { text, solutionId } = req.body;

  const userId = req.user.username;

  const newComment = await Comment.create({ text, userId, solutionId });
  res.status(201).json(newComment);
};

exports.edit = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  await Comment.update({ text }, { where: { id } });
  const updatedComment = await Comment.findByPk(id);
  res.status(200).json(updatedComment);
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await Comment.destroy({ where: { id } });
  res.status(204).send();
};

async function reply_to_comment(parentId, text, userId) {
  const parent = await Comment.findByPk(parentId);
  const { solutionId: parentSolutionId, replies: parentReplies } = parent;
  const to_add = {
    text,
    solutionId: parentSolutionId,
    userId: userId,
  };
  const newComment = await Comment.create(to_add);

  const replyList = parentReplies.split(",").filter((v) => v.length !== 0);

  await Comment.update(
    { replies: [...replyList, `${newComment.id}`].join(",") },
    {
      where: {
        id: parentId,
      },
    },
  );

  return [parent, newComment];
}

function getCommentChain(comment, id) {
  if (comment.id === id) {
    // Base case: comment is the one we want
    return [comment];
  }

  for (let reply of comment.replies) {
    const chain = getCommentChain(reply, id);
    if (chain.length !== 0) {
      return [comment, ...chain];
    }
  }

  return [];
}

exports.reply = async (req, res) => {
  // TODO: add userId!!!!
  // Comment that it's in reply to
  const { parentId } = req.params;
  const { text } = req.body;
  const [parent, comment] = await reply_to_comment(
    parentId,
    text,
    req.user.username,
  );

  res.status(204).send();

  if (parent.userId !== "AITA") return;
  // This is a reply to an AI generated comment.

  console.log("Generating AI reply...");
  const comments = formatComments(
    await Comment.findAll({
      where: {
        solutionId: parent.solutionId,
      },
    }),
  );

  const comment_chain = comments
    .map((c) => getCommentChain(c, comment.id))
    .filter((ch) => ch.length !== 0)[0];
  const solution = await Solution.findByPk(parent.solutionId);
  const challenge = await Challenge.findByPk(solution.challengeId);

  console.log("Calling AI TA....");
  const feedback = await AITA.feedback_for_comment(
    comment_chain,
    challenge,
    solution,
  );
  await reply_to_comment(comment.id, feedback, "AITA");
  console.log(`AI TA commented on comment ${comment.id}`);
};
