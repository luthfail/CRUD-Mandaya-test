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
    DrugId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    isPaid: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'ShoppingCart',
  });
  return ShoppingCart;
};