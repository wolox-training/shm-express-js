'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'allowed_date', {
      type: Sequelize.DATE
    }),

  down: queryInterface => queryInterface.removeColumn('users', 'allowed_date')
};
