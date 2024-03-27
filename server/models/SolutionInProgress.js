module.exports = (sequelize, DataTypes) => {

  //TODO: add proper spacing and indentation
  const SolutionInProgress = sequelize.define('SolutionInProgress', {
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
            key: 'username',
          }
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      diagram: {
        type: DataTypes.STRING,
        allowNull: false, //NOTE: SUBJECT TO CHANGE -> may need to be true, because when we create a new diagram, we need a dummy value, before we save it for the first time
      },
  }, {
    indexes: [  // Enforce the uniqueness of the combination of challengeId and userId
      {
        unique: true,
        fields: ['challengeId', 'userId']
      }
    ]
  });

    SolutionInProgress.associate = function(models) {
      SolutionInProgress.belongsTo(models.User, { foreignKey: 'userId' });
      SolutionInProgress.belongsTo(models.Challenge, { foreignKey: 'challengeId' });
    };
  return SolutionInProgress;
}