module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'user', 
            validate: {
                isIn: [['user', 'admin']], 
            }
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    });
    User.associate = function(models) {
        // Define associations
        User.hasMany(models.Solution, { foreignKey: 'userId' });
        User.hasMany(models.Comment, { foreignKey: 'userId' });
        };

    return User;
};
