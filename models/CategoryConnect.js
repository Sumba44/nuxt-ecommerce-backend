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

  // CategoryConnect.sync({ force: true }).then(async () => {
  //   for (let i = 1; i <= 9999; i++) {
  //     const categoryconnect = {
  //       product_id: `${i}`,
  //       category_id: "1",
  //       primary: "0",
  //       category_slug: "slug1"
  //     };
  //     await CategoryConnect.create(categoryconnect);
  //   }
  // });

  // console.log("done");

  return CategoryConnect;
};
