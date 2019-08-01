'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'allowed_date', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }),

  down: queryInterface => queryInterface.removeColumn('users', 'allowed_date')
};
