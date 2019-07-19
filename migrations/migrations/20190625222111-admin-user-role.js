'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM,
      values: ['regular', 'admin'],
      allowNull: false,
      defaultValue: 'regular'
    }),

  down: queryInterface => queryInterface.removeColumn('users', 'role')
};
