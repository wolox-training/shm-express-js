'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('users', 'secret', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'wolox-training'
    }),

  down: queryInterface => queryInterface.removeColumn('users', 'secret')
};
