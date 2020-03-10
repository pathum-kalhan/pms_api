
module.exports = (sequelize, DataTypes) => {
  const audit = sequelize.define('audit', {
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    area: {
      type: DataTypes.STRING,
      allowNull: false,

    },
    description: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
    reference: {
      type: DataTypes.STRING,

    },
  }, {});
  audit.associate = function (models) {
    audit.belongsTo(models.user, {
      foreignKey: 'userId',
    });
  };
  return audit;
};
