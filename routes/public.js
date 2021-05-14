const express = require("express");
const router = express.Router();
const db = require("../models/db");
const { registerValidation } = require("../controllers/validation");
const { loginValidation } = require("../controllers/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const upload = require("../controllers/upload");
const { v4: uuidv4 } = require("uuid");
const email = require("../controllers/email");
const logger = require("../controllers/logger");
const fs = require("fs");
const sharp = require("sharp");
const chalk = require("chalk");

dotenv.config();

// Test method
router.get("/test/", async (req, res, next) => {
  try {
    let results = await db.test();
    logger.log("INFO", "DB Test Method OK", JSON.stringify(results));
    res.status(200).json("DB Test Method OK");
  } catch (err) {
    console.log(err);
    logger.log("ERROR", "DB Test failed", err);
    res.Status(500);
  }
});

// Images folder optimalizator
router.post("/optimize/", (req, res, next) => {
  try {
    fs.readdir("./public/images/opt", (err, files) => {
      files.forEach(file => {
        let currFile = "./public/images/opt/" + file;

        sharp(currFile)
          .resize(1280, 768, { fit: "inside" })
          .toFormat("jpg")
          .jpeg({ mozjpeg: true, quality: 70 })
          .toFile("./public/images/opt/auto-" + file)
          .then(data => {
            console.log(chalk.yellow(file) + " Resized");
            // delete original file
            fs.unlink(currFile, err => {
              if (err) {
                console.error(err);
                res.status(500).send(err);
                return;
              }
              console.log(chalk.blue(currFile) + " Deleted");
            });
          })
          .catch(err => {
            console.log(err);
            res.status(500).send(err);
          });
      });
    });
    res.status(200).send("All files successfully resized!");
  } catch (err) {
    console.log(err);
    logger.log("ERROR", "Error while resizing files", err);
    res.Status(500);
  }
});

// Upload
router.post("/upload/", (req, res) => {
  try {
    upload.singleFile(req, res);
  } catch (e) {
    console.log(e);
    res.Status(500);
  }
});

// Get product
router.get("/getproduct/:id", async (req, res, next) => {
  try {
    let results = await db.product(req.params.id);
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// Search all products
router.get("/search", async (req, res, next) => {
  try {
    let results = await db.searchAll(req.query.search);
    res.setHeader("Content-Type", "application/json");
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// Search all categories
router.get("/searchCategories", async (req, res, next) => {
  try {
    let results = await db.searchAllCategory(req.query.search);
    res.setHeader("Content-Type", "application/json");
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// Get all categories
router.get("/getallcategories", async (req, res, next) => {
  try {
    let results = await db.categories();
    res.setHeader("Content-Type", "application/json");
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// Get category info
router.get("/getcategory", async (req, res, next) => {
  try {
    let results = await db.getCategory(req.query.slug);
    res.setHeader("Content-Type", "application/json");
    res.json(results);
  } catch (e) {
    console.log(e);
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
  } catch (e) {
    console.log(e);
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
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// Add new order & Send email
router.post("/addorder", async (req, res, next) => {
  try {
    await db.newOrder(null, req.body.cart, req.body.date);
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// Get all orders
router.get("/getallorders/", async (req, res, next) => {
  try {
    let results = await db.all();
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// Get one order
router.get("/getorder/:id", async (req, res, next) => {
  try {
    let results = await db.one(req.params.id);
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// REGISTER
router.post("/register", async (req, res, next) => {
  // validate inputs
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if email exists
  const emailExist = await db.userExists(req.body.email);
  if (emailExist) return res.status(401).send("Email already exists");

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  try {
    let idGen = uuidv4();
    await db.registerUser(null, idGen, req.body.name, req.body.email, hashPassword, new Date());

    // send email to confirm registration
    email.registration(idGen, req.body.email);
    res.status(200).send(idGen);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

// Email verification
router.get("/verifyemail", async (req, res, next) => {
  try {
    const user = jwt.verify(req.query.token, process.env.EMAIL_SECRET);
    await db.verifyEmail(user.id);
    res.status(200).send("Email verified");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

// LOGIN
router.post("/login", async (req, res, next) => {
  // validate inputs
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if email exists
  const user = await db.userExists(req.body.email);
  if (!user) return res.status(405).send("Username or password is wrong.");

  // check if email was verified
  if (!user.verified) return res.status(406).send("Registration not comfirmed yet.");

  // is password correct?
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(401).send("Username or password is wrong.");

  // create and assign a token
  const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET);
  res.header("token", token).send(token);
});

module.exports = router;
