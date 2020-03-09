
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nic: {
      type: DataTypes.STRING,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      // allowNull: false,
    },
    contactNumbers: {
      type: DataTypes.STRING(300),
    },
    address: {
      type: DataTypes.STRING(300),
    },
    notes: {
      type: DataTypes.STRING(300),
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateJoined: {
      type: DataTypes.DATEONLY,
    },
    birthday: {
      type: DataTypes.DATEONLY,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
    },
    lastSeen: {
      type: DataTypes.DATEONLY,
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        const name = `${this.getDataValue('title')} ${this.getDataValue('firstName')} ${this.getDataValue('lastName')}`;
        return name;
      },
    },
  }, {
    hooks: {
      beforeCreate(user) {
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(user.password, salt);
      },
    },
  });
  user.associate = function (models) {
    // associations can be defined here
  };
  return user;
};
