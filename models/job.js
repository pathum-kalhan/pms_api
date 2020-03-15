
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
  }, {});
  job.associate = function (models) {
    // associations can be defined here
  };
  return job;
};
