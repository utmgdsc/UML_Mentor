// models/comment.js
module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        text: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            references: {
              model: 'Users',
              key: 'id',
            }
        },
        solutionId: {
            type: DataTypes.INTEGER,
            references: {
              model: 'Solutions',
              key: 'id',
            }
        },
        helpful: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
      }
    });
    return Comment;
  };
  