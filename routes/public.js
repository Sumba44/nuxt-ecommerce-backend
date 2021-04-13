const express = require("express");
const router = express.Router();
const db = require("../controllers/db");
const nodemailer = require("nodemailer");
const { registerValidation } = require("../controllers/validation");
const { loginValidation } = require("../controllers/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Test method
router.get("/test/", async (req, res, next) => {
  try {
    await db.test();
    res.status(200).json("test OK");
    console.log(new Date().toLocaleString(), "| INFO | Test method OK");
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
    res.setHeader('Content-Type', 'application/json');
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
    res.setHeader('Content-Type', 'application/json');
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
    res.setHeader('Content-Type', 'application/json');
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
    res.setHeader('Content-Type', 'application/json');
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
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
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
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
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

// set date time
function formatDate(date) {
  var hours = date.getHours();
  var minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  var strTime = hours + ":" + minutes;
  return (
    date.getDate() +
    "/" +
    (date.getMonth() + 1) +
    "/" +
    date.getFullYear() +
    " " +
    strTime
  );
}

// generate random ID
function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

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
    let idGen = makeid(20);
    await db.registerUser(
      null,
      idGen,
      req.body.name,
      req.body.email,
      hashPassword,
      formatDate(new Date())
    );
    res.status(200).send(idGen);

    let mailOptions = {
      from: "milujemmail@gmail.com",
      to: "robokona@gmail.com",
      subject: "Registration",
      text: "Your registration was successful",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
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

  // is password correct?
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(401).send("Username or password is wrong.");

  // create and assign a token
  const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET);
  res.header("token", token).send(token);
});

module.exports = router;
