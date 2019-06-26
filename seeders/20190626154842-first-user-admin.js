'use strict';

module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert(
      'users',
      [
        {
          first_name: 'John',
          last_name: 'Doe',
          email: 'demo@wolox.com',
          password: '$2b$10$9.dvahVb5lgcsaRtVlttCOPr6JHbXI.nmDfWNGHhIt39Mev/gDa0u',
          role: 'admin',
          created_at: new Date(),
          updated_at: new Date(),
          deleted_at: new Date()
        }
      ],
      {}
    ),

  down: queryInterface => queryInterface.bulkDelete('users', null, {})
};
