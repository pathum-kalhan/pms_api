
module.exports = (sequelize, DataTypes) => {
  const attendance = sequelize.define('attendance', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    site: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    attendanceDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    checkIn: {
      type: DataTypes.STRING,

    },
    checkOut: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,

    },
    // checkInF: {
    //   type: DataTypes.VIRTUAL,
    //   get() {
    //     const t = moment(this.getDataValue('checkIn'), 'HHmm').format('HH:mm A');
    //     return t;
    //   },
    // },
    // checkOutF: {
    //   type: DataTypes.VIRTUAL,
    //   get() {
    //     const t = moment(this.getDataValue('checkOut'), 'HHmm').format('HH:mm A');
    //     return t;
    //   },
    // },
  }, {});
  attendance.associate = function (models) {
    attendance.belongsTo(models.user, {
      foreignKey: 'userId',
    });
  };
  return attendance;
};
