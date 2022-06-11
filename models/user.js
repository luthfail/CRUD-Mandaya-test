'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          args: true,
          msg: 'Phone number cannot be null'
        },
        notEmpty: {
          args: true,
          msg: 'Phone number cannot be null'
        },
        isNumeric: {
          args: true,
          msg: 'Phone number must be numeric'
        },
        len: [11, 16]
      }
    },
    gender: {
      type:DataTypes.STRING,
      validate:{
        notNull: {
          args: true,
          msg: "gender is required"
        },
        notEmpty: {
          args: true,
          msg: "choose your gender"
        },
        isIn:{
          args: [['male', 'female']],
          msg: "choose your gender"
        }
      }
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "input your birth"
        },
        notEmpty: {
          args: true,
          msg: "input your birth"
        }
      }
    },
    KTP: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          args: true,
          msg: "input your KTP"
        },
        notEmpty: {
          args: true,
          msg: "input your KTP"
        },
        isNumeric: {
          args: true,
          msg: "input KTP is only numeric"
        },
        len: [16, 16]
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "input your password"
        },
        notEmpty: {
          args: true,
          msg: "input your password"
        },
      }
    },
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};