("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // User.hasMany(models.Category, {
      //   foreignKey: 'id'
      // })
    }
  }
  User.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      uid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        unique: true
      },
      name: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING,
        unique: true
      },
      password: {
        type: DataTypes.STRING
      },
      verified: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {
      sequelize,
      tableName: "users",
      modelName: "User"
    }
  );

  // User.sync({ force: true }).then(async () => {
  //   for(let i = 1; i <= 15; i++){
  //     const user = {
  //       name: `user${i}`,
  //       email: `user${i}@mail.com`,
  //       password: 'P4ssword'
  //     }
  //     await User.create(user);
  //   }
  // });
  return User;
};
