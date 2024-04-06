// models/comment.js
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "username",
      },
    },
    solutionId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Solutions",
        key: "id",
      },
    },
    upVotes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    replies: {
      type: DataTypes.TEXT,
      defaultValue: "",
      // This is a comma separated list of comment ids
    },
  });
  return Comment;
};
