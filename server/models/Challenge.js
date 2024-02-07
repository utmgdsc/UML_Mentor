module.exports = (sequelize, DataTypes) => {
    const Challenge = sequelize.define('Challenge', {
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    return Challenge;
  };
  