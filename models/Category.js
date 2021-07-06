("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models) {
      // Category.belongsToMany(Category, { as: "Category", forgeinKey: "category_id", through: "category_connect" });
    }
  }
  Category.init(
    {
      category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      category_name: {
        type: DataTypes.STRING
      },     
      category_slug: {
        type: DataTypes.STRING
      },
      category_info: {
        type: DataTypes.STRING
      },
      category_priority: {
        type: DataTypes.INTEGER
      },
      category_parent: {
        type: DataTypes.INTEGER
      },
    },
    {
      sequelize,
      tableName: "categories",
      modelName: "Category"
    }
  );

  // Category.sync({ force: true }).then(async () => {
  //   for(let i = 1; i <= 15; i++){
  //     const category = {
  //       category_name: `category_name${i}`,
  //       category_slug: `category_slug${i}`,
  //       category_info: `category_info${i}`,
  //       category_priority: `${i}`,
  //       category_parent: `${i}`,
  //     }
  //     await Category.create(category);
  //   }
  // });

  return Category;
};
