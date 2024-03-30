module.exports = (sequelize, DataTypes) => {
  const Solution = sequelize.define("Solution", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    challengeId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Challenges", // name of Target model
        key: "id",
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "username",
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    diagram: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Path to the diagram image",
    },
  });
  // Define associations
  Solution.associate = function (models) {
    Solution.belongsTo(models.User, { foreignKey: "userId" });
    Solution.belongsTo(models.Challenge, { foreignKey: "challengeId" });
    Solution.hasMany(models.Comment, { foreignKey: "solutionId" });
  };

  return Solution;
};
