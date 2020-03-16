
const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const job = sequelize.define('job', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(300),
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdDate: {
      type: DataTypes.VIRTUAL,
      get() {
        const d = moment(this.getDataValue('createdAt')).format('YYYY-MM-DD hh:mm:ss A');
        return d;
      },
    },
    updatedDate: {
      type: DataTypes.VIRTUAL,
      get() {
        const d = moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD hh:mm:ss A');
        return d;
      },
    },
  }, {});
  job.associate = function (models) {
    // associations can be defined here
  };
  return job;
};
