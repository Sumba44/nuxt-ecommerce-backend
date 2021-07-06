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

// dbs.Product.belongsToMany(dbs.Category, { as: "productss", forgeinKey: "product_id", through: dbs.CategoryConnect });
// dbs.Category.belongsToMany(dbs.Product, { as: "categoriess", forgeinKey: "category_id", through: dbs.CategoryConnect });


// dbs.CategoryConnect.hasMany(dbs.Product, { foreignKey: 'product_id'});

// dbs.CategoryConnect.belongsToMany(dbs.Product, { through: 'category_connect'});

// Folder.belongsToMany(Team, { through: 'teams_folders'});
// Team.belongsToMany(Folder, { through: 'teams_folders'});

// db.Sequelize = Sequelize;

// sequelize.sync({ alter: true });

// module.exports = db;

module.exports = {
  dbs: dbs,
  Op: Op
};
