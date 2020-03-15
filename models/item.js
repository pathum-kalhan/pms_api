
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
  }, {});
  item.associate = function (models) {
    // associations can be defined here
  };
  return item;
};
