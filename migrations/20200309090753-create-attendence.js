
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('attendances', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    site: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    attendanceDate: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    checkIn: {
      type: Sequelize.STRING,

    },
    checkOut: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,

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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('attendences'),
};
