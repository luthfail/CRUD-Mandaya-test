'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Drug extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Drug.belongsToMany(models.User, {
        foreignKey: 'DrugId',
        through: 'ShoppingCart'
      });
    }
  }
  Drug.init({
    name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        args: true,
        msg: 'DrugId is required'
      },
      notEmpty: {
        args: true,
        msg: 'DrugId is required'
      }
    }
  },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'DrugId is required'
        },
        notEmpty: {
          args: true,
          msg: 'DrugId is required'
        },
        isNumeric: {
          args: true,
          msg: 'DrugId is required'
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'DrugId is required'
        },
        notEmpty: {
          args: true,
          msg: 'DrugId is required'
        },
        isNumeric: {
          args: true,
          msg: 'DrugId is required'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Drug',
  });
  return Drug;
};