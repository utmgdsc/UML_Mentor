module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        preferredName: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'user', // default role is 'user'
            validate: {
                isIn: [['user', 'admin']], // Ensures the role is either 'user' or 'admin'
            }
        },
        hasAcceptedTerms: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },        
        score: DataTypes.INTEGER
    });
    User.associate = function(models) {
        // Define associations
        User.hasMany(models.Solution, { foreignKey: 'userId' });
        User.hasMany(models.Comment, { foreignKey: 'userId' });
      };
    
    return User;
  };
  