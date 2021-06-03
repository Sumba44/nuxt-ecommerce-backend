("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init(
    {
      product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      product_name: {
        type: DataTypes.STRING
      },
      short_desc: {
        type: DataTypes.STRING
      },
      long_desc: {
        type: DataTypes.STRING
      },
      rating: {
        type: DataTypes.INTEGER
      },
      price: {
        type: DataTypes.DECIMAL(6, 2)
      },
      wholesale_price: {
        type: DataTypes.DECIMAL(6, 2)
      },
      sale: {
        type: DataTypes.INTEGER
      },
      quantity: {
        type: DataTypes.INTEGER
      },
      product_image: {
        type: DataTypes.STRING
      },
      Product_video: {
        type: DataTypes.STRING
      },
      slug: {
        type: DataTypes.STRING
      },
      supplier: {
        type: DataTypes.STRING
      },
    },
    {
      sequelize,
      tableName: "products",
      modelName: "Product"
    }
  );
  return Product;
};
