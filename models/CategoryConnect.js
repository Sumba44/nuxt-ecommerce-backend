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
      CategoryConnect.hasMany(models.Product, { foreignKey: "product_id", as: "Product" });
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
      category_slug: {
        type: DataTypes.STRING
      },
      primary: {
        type: DataTypes.INTEGER
      }
    },
    // {
    //   expirationDate: {
    //     type: DataTypes.DATE,
    //     defaultValue: new Date()
    //   }
    // },
    {
      sequelize,
      tableName: "category_connect",
      modelName: "CategoryConnect"
    }
  );

  // CategoryConnect.sync({ force: true }).then(async () => {
  //   for (let i = 1; i <= 15; i++) {
  //     const categoryconnect = {
  //       product_id: `1`,
  //       category_id: "1",
  //       primary: "0",
  //       category_slug: "slug1"
  //     };
  //     await CategoryConnect.create(categoryconnect);
  //   }
  // });

  return CategoryConnect;
};
