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
        roleId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Roles',
                key: 'id',
              }
        },
        score: DataTypes.INTEGER
    });
    User.associate = function(models) {
        // Define associations
        User.belongsTo(models.Role, { foreignKey: 'roleId' });
        User.hasMany(models.Solution, { foreignKey: 'userId' });
        User.hasMany(models.Comment, { foreignKey: 'userId' });
      };
    
    return User;
  };
  