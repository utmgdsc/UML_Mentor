const db = require("../models/index");
const Comment = db.Comment;
const Challenge = db.Challenge;
const Solution = db.Solution;
const User = db.User;
const { AITA } = require("../AI/AITA");

function formatComments(extracted) {
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
      // console.log(out);
      if (out) {
        replyIds.push(out.id);
      }
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

exports.getUserComments = async (req, res) => {
  const userId = req.params.username;
  const comments = await Comment.findAll({
    where: {
      userId,
    },
  });
  res.status(200).json(comments);
};

exports.get = async (req, res) => {
  const { solutionId } = req.params;
  const comments = await Comment.findAll({
    where: {
      solutionId,
    },
  });

  const extracted = comments.map(
    ({ id, text, userId, solutionId, upVotes, replies, usersWhoUpvoted }) => ({
      id,
      text,
      userId,
      solutionId,
      hasUserUpvoted: usersWhoUpvoted.includes(req.user.username),
      upVotes,
      replies,
    }),
  );

  const formatted = formatComments(extracted);

  res.status(200).json(formatted);
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

async function reply_to_comment(parentId, text, userId, runId = "") {
  const parent = await Comment.findByPk(parentId);
  const { solutionId: parentSolutionId, replies: parentReplies } = parent;
  const to_add = {
    text,
    solutionId: parentSolutionId,
    userId,
    runId,
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
  const { parentId } = req.params;
  const { text } = req.body;
  const [parent, comment] = await reply_to_comment(
    parentId,
    text,
    req.user.username,
  );

  res.status(204).send();
};

exports.upvote = async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findByPk(commentId);

  const upvotedUsersList = comment.usersWhoUpvoted
    .split(",")
    .filter((v) => v.length !== 0);

  if (upvotedUsersList.includes(`${req.user.username}`)) {
    console.log("Invalid upvote.");
    res.status(409).send();
    return;
  }

  Comment.update(
    {
      upVotes: comment.upVotes + 1,
      usersWhoUpvoted: [...upvotedUsersList, `${req.user.username}`].join(","),
    },
    {
      where: {
        id: comment.id,
      },
    },
  );

  res.status(204).send();

  if (comment.userId === "AITA") {
    await AITA.upvote(comment.runId);
    console.log("AI upvoted.");
  }
};
