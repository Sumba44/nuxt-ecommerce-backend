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
      // Product.belongsTo(models.CategoryConnect, { foreignKey: "product_id", as: "CategoryConnect" });

      // Product.hasMany(models.CategoryConnect, { foreignKey: "product_id", as: "Product" });
      
      // Product.belongsToMany(models.Category, { through: 'category_connect' })
      
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
      product_video: {
        type: DataTypes.STRING
      },
      slug: {
        type: DataTypes.STRING
      },
      supplier: {
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      tableName: "products",
      modelName: "Product"
    }
  );

  // Product.sync({ alter: true }).then(async () => {
  //   for(let i = 1; i <= 10000; i++){

  //     let rand = Math.floor(Math.random() * 5) + 1;

  //     const product = {
  //       product_name: `Fender Squier Classic Vibe '70s${i}`,
  //       short_desc: `short_desc${i}`,
  //       long_desc: `long_desc${i}`,
  //       rating: rand,
  //       price: `${i}`,
  //       wholesale_price: `${i}`,
  //       sale: `${i}`,
  //       quantity: `${i}`,
  //       product_image: `https://muzikercdn.com/uploads/products/2581/258144/main_fc102930.jpg`,
  //       product_video: `product_video${i}`,
  //       slug: `slug${i}`,
  //       supplier: `supplier${i}`
  //     }
  //     await Product.create(product);
  //   }
  // });

  return Product;
};
