module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      // we can add permissions / more fields here
    });
    return Role;
  };
  