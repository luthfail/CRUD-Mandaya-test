'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShoppingCart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ShoppingCart.belongsTo(models.User, {
        foreignKey: 'UserId'
      });
      ShoppingCart.belongsTo(models.Drug, {
        foreignKey: 'DrugId'
      });
    }
  }
  ShoppingCart.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    DrugId: {
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
        }
      }
    },
    UserId: {
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
        }
      }
    },
    isPaid: DataTypes.BOOLEAN,
  }, {
    hooks: {
      beforeCreate(shoppingCart, options) {
        shoppingCart.isPaid = false;
      }
    },
    sequelize,
    modelName: 'ShoppingCart',
  });
  return ShoppingCart;
};