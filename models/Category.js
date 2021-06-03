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
      // define association here
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
      category_slug: {
        type: DataTypes.INTEGER
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
  return Category;
};
