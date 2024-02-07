module.exports = (sequelize, DataTypes) => {
    const Solution = sequelize.define('Solution', {
        challengeId: {
            type: DataTypes.INTEGER,
            references: {
              model: 'Challenges', // name of Target model
              key: 'id',
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
              model: 'Users',
              key: 'id',
            }
        }
    });
    // Define associations
    Solution.associate = function(models) {
      Solution.belongsTo(models.User, { foreignKey: 'userId' });
      Solution.belongsTo(models.Challenge, { foreignKey: 'challengeId' });
      Solution.hasMany(models.Comment, { foreignKey: 'solutionId' });
    };
  
    return Solution;
  };
  