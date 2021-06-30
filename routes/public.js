const express = require("express");
const router = express.Router();

// Modules
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
// const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const sharp = require("sharp");
const chalk = require("chalk");

// Controllers
const db = require("../controllers/db");
const { registerValidation, loginValidation } = require("../controllers/validation");
const upload = require("../controllers/upload");
const email = require("../controllers/email");
const logger = require("../controllers/logger");

// Middleware
const pagination = require("../middleware/pagination");

// Models
const dbs = require("../models");

dotenv.config();

// Test method
router.get("/test/", async (req, res, next) => {
  try {
    const results = await dbs.sequelize.authenticate();
    console.log("Connection has been established successfully.");
    logger.log("INFO", "DB Test Method OK", JSON.stringify(results));
    res.status(200).json("DB Test Method OK");
  } catch (error) {
    logger.log("ERROR", "DB Test failed", error);
    console.error("Unable to connect to the database:", error);
    res.Status(500);
  }
});

// DB Sync method
router.get("/sync/", async (req, res, next) => {
  try {
    // force or alter
    await dbs.User.sync({ force: true });
    res.status(200).json("The table for the User model was just (re)created!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});

// DB select all
router.get("/findall/", pagination, async (req, res) => {
  try {
    const { page, size } = req.pagination;

    const response = await dbs.User.findAndCountAll({
      limit: size,
      offset: page * size
    });
    res.status(200).send({
      data: response.rows,
      totalPages: Math.ceil(response.count / Number.parseInt(size))
    });
  } catch (error) {
    res.status(500).send(error)
  }
});

// Images folder optimalizator
router.post("/optimize/", async (req, res, next) => {
  try {
    fs.readdir("./public/images/opt", (error, files) => {
      if (error) {
        res.status(500).send(error);
      } else {
        if (files.length > 0) {
          files.forEach(file => {
            let currFile = "./public/images/opt/" + file;

            sharp(currFile)
              .resize(1520, 480, { fit: "inside" })
              .toFormat("jpg")
              .jpeg({ mozjpeg: true, quality: 90 })
              .toFile("./public/images/opt/optimized-" + file)
              .then(data => {
                console.log(chalk.yellow(file) + " Resized");
                // delete original file
                // fs.unlink(currFile, err => {
                //   if (error) {
                //     console.error(error);
                //     res.status(500).send(error);
                //     return;
                //   }
                //   console.log(chalk.blue(currFile) + " Deleted");
                // });
              })
              .catch(error => {
                console.log(error);
                res.status(500).send(error);
              });
          });
          res.status(200).send("All files successfully resized!");
        } else {
          res.status(405).send("No files in the directory");
        }
      }
    });
  } catch (error) {
    console.log(error);
    logger.log("ERROR", "Error while resizing files", error);
    res.Status(500);
  }
});

// Upload
router.post("/upload/", async (req, res) => {
  try {
    upload.singleFile(req, res);
  } catch (error) {
    console.log(error);
    res.Status(500);
  }
});

// Get product
router.get("/getproduct/:id", async (req, res, next) => {
  try {
    // let results = await db.product(req.params.id);
    const results = await dbs.Product.findAll({
      where: {
        product_id: req.params.id
      }
    });
    res.status(200).send(results);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// Search all products
router.get("/search", async (req, res, next) => {
  try {
    let results = await db.searchAll(req.query.search);
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(results);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Search all categories
router.get("/searchCategories", async (req, res, next) => {
  try {
    let results = await db.searchAllCategory(req.query.search);
    res.setHeader("Content-Type", "application/json");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get all categories
router.get("/getallcategories", async (req, res, next) => {
  try {
    let results = await db.categories();
    res.setHeader("Content-Type", "application/json");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get category info
router.get("/getcategory", async (req, res, next) => {
  try {
    let results = await db.getCategory(req.query.slug);
    res.setHeader("Content-Type", "application/json");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get all products in category
router.get("/getallproductsincategory/:id", async (req, res, next) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  try {
    results.data = await db.allInCategory(req.params.id);

    if (endIndex < results.data.length) {
      results.next = {
        page: page + 1,
        limit: limit
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      };
    }

    results.data = results.data.slice(startIndex, endIndex);
    res.setHeader("Content-Type", "application/json");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get all products filtered search
router.get("/filterproducts/", async (req, res, next) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  try {
    results.data = await db.filterProducts(req);

    if (endIndex < results.data.length) {
      results.next = {
        page: page + 1,
        limit: limit
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      };
    }

    results.data = results.data.slice(startIndex, endIndex);
    res.setHeader("Content-Type", "application/json");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Add new order & Send email
router.post("/addorder", async (req, res, next) => {
  try {
    await db.newOrder(null, req.body.cart, req.body.date);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get all orders
router.get("/getallorders/", async (req, res, next) => {
  try {
    let results = await db.all();
    res.json(results);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get one order
router.get("/getorder/:id", async (req, res, next) => {
  try {
    let results = await db.one(req.params.id);
    res.json(results);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// REGISTER
router.post("/register", async (req, res, next) => {
  // validate inputs
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  try {
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: hashPassword
    };
    const response = await dbs.User.create(user);

    // send email to confirm registration
    email.registration(response.uid, req.body.email);
    res.status(200).send("Email sent");
  } catch (error) {
    if (error.errors.length > 0) {
      res.status(401).send(error.errors[0].message);
    } else {
      console.log(error);
      res.status(500).send(error);
    }
  }
});

// Email verification
router.get("/verifyemail", async (req, res, next) => {
  try {
    const user = jwt.verify(req.query.token, process.env.EMAIL_SECRET);
    await dbs.User.update({ verified: 1 }, { where: { uid: user.id } });
    res.status(200).send("Email verified");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// LOGIN
router.post("/login", async (req, res, next) => {
  // validate inputs
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if email exists
  const user = await dbs.User.findAll({ where: { email: req.body.email } });
  if (user[0].email.length < 1) return res.status(405).send("Username or password is wrong.");

  // check if email was verified
  if (user[0].verified == 0) return res.status(406).send("Registration not comfirmed yet.");

  // is password correct?
  const validPass = await bcrypt.compare(req.body.password, user[0].password);
  if (!validPass) return res.status(401).send("Username or password is wrong.");

  // create and assign a token
  const token = jwt.sign({ id: user[0].uid }, process.env.TOKEN_SECRET, {
    expiresIn: "30d"
  });
  res.header("token", token).send(token);
});

module.exports = router;
