
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('users', [
    {
      title: 'Mr',
      firstName: 'system',
      lastName: 'admin',
      email: 'admin@system.com',
      password: '$2b$10$ZGmOeKwvtfGLEpEOLTdH7u5ce./106tufdmWHgBK3xWpQBiITDt1.',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),

    },
  ]),

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  },
};
