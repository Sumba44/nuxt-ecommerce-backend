("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CategoryConnect extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CategoryConnect.hasMany(models.Product, {foreignKey: "product_id", as: "categoryconnect"});
    }
  }
  CategoryConnect.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      product_id: {
        type: DataTypes.INTEGER
      },
      category_id: {
        type: DataTypes.INTEGER
      },
      primary: {
        type: DataTypes.INTEGER
      }
    },
    {
      sequelize,
      tableName: "category_connect",
      modelName: "CategoryConnect"
    }
  );
  return CategoryConnect;
};
