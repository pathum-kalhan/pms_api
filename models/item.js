const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const item = sequelize.define('item', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(300),
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: false,
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
  item.associate = function (models) {
    // associations can be defined here
  };
  return item;
};
