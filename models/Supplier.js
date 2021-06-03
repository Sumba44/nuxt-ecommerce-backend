("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Supplier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Supplier.init(
    {
      supplier_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      supplier_name: {
        type: DataTypes.STRING
      },
      supplier_desc: {
        type: DataTypes.STRING
      },
      supplier_logo: {
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      tableName: "suppliers",
      modelName: "Supplier"
    }
  );
  return Supplier;
};
