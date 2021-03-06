'use strict';

const moment = require('moment');

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
      },
      role: {
        allowNull: false,
        type: DataTypes.ENUM,
        values: ['regular', 'admin'],
        defaultValue: 'regular'
      },
      allowedDate: {
        allowNull: false,
        type: DataTypes.INTEGER,
        field: 'allowed_date',
        defaultValue: moment().unix()
      }
    },
    {
      underscored: true,
      tableName: 'users'
    }
  );

  User.associate = models => User.hasMany(models.Album);

  return User;
};
