"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const Product = require("./Product");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const dbs = {};

const Op = Sequelize.Op;

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
  .filter(file => {
    return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js";
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    dbs[model.name] = model;
  });

Object.keys(dbs).forEach(modelName => {
  if (dbs[modelName].associate) {
    dbs[modelName].associate(dbs);
  }
});

dbs.sequelize = sequelize;
// dbs.Sequelize = Sequelize;

// dbs.Product.belongsToMany(dbs.Category, {
//   as: "categories",
//   through: "CategoryConnect",
//   foreignKey: "product_id",
//   otherKey: "category_id"
// });
// dbs.Category.belongsToMany(dbs.Product, {
//   through: "CategoryConnect",
//   foreignKey: "category_id",
//   otherKey: "product_id"
// });

// sequelize.sync({ force: true });

// async function asyncCall() {
  // dbs.Product.create(
  //   {
  //     product_name: `Fender Squier Classic Vibe '70s`,
  //     short_desc: `short_desc`,
  //     long_desc: `long_desc`,
  //     rating: 1,
  //     price: 1,
  //     wholesale_price: 1,
  //     sale: 1,
  //     quantity: 1,
  //     product_image: `https://muzikercdn.com/uploads/products/2581/258144/main_fc102930.jpg`,
  //     product_video: `product_video1`,
  //     slug: `slug1`,
  //     supplier: `supplier1`,
  //     categories: [
  //       { category_name: "kokot", category_slug: "slug1", category_info: "", category_priority: 1, category_parent: 0 }
  //     ]
  //   },
  //   {
  //     include: [
  //       {
  //         association: categories,
  //         as: "categories"
  //       }
  //     ]
  //   }
  // );
  // }


// const pica = dbs.Product.create(
//   {
//     id: 12,
//     product_name: `Fender Squier Classic Vibe '70s`,
//     short_desc: `short_desc`,
//     long_desc: `long_desc`,
//     rating: 1,
//     price: 1,
//     wholesale_price: 1,
//     sale: 1,
//     quantity: 1,
//     product_image: `https://muzikercdn.com/uploads/products/2581/258144/main_fc102930.jpg`,
//     product_video: `product_video1`,
//     slug: `slug1`,
//     supplier: `supplier1`,

//   }
// );

// await Product.create(pica);
// }

// asyncCall();

module.exports = {
  dbs: dbs,
  Op: Op
};
