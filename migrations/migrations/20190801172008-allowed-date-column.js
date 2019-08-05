'use strict';

const moment = require('moment');

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'allowed_date', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: moment().unix()
    }),

  down: queryInterface => queryInterface.removeColumn('users', 'allowed_date')
};
