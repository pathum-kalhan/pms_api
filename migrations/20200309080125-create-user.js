
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    nic: {
      type: Sequelize.STRING,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      // allowNull: false,
    },
    contactNumbers: {
      type: Sequelize.STRING(300),
    },
    address: {
      type: Sequelize.STRING(300),
    },
    notes: {
      type: Sequelize.STRING(300),
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    dateJoined: {
      type: Sequelize.DATEONLY,
    },
    birthday: {
      type: Sequelize.DATEONLY,
    },
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
    },
    lastSeen: {
      type: Sequelize.DATEONLY,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('users'),
};
