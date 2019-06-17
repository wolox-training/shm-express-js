'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'first_name'
      },
      lastName: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'last_name'
      },
      email: {
        unique: true,
        allowNull: false,
        type: DataTypes.STRING
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING
      }
    },
    {
      underscored: true,
      tableName: 'users'
    }
  );

  return User;
};
