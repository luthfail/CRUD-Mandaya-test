'use strict';
const { hashPassword } = require('../helpers');
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
      User.belongsToMany(models.Drug, {
        foreignKey: 'UserId',
        through: 'ShoppingCart'
      });
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
      allowNull: false,
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
        len: {
          args: [16, 16],
          msg: "input KTP must be 16 digits"
        }
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
    role: {
      type :DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "input your role"
        },
        notEmpty: {
          args: true,
          msg: "input your role"
        },
        isIn: {
          args: [['admin', 'user']],
          msg: "role is only accept between admin and user"
        }
      }
    },
    balance: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        isInt: {
          args: true,
          msg: "balance is only numeric"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate((user, options) => {
    user.password = hashPassword(user.password);
    user.balance = 0;
  })
  return User;
};