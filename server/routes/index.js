const express = require("express");
const db = require("../db");
const nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "milujemmail@gmail.com",
    pass: "robokona1",
  },
});

const router = express.Router();

// Get all orders
router.get("/getAllOrders/", async (req, res, next) => {
  try {
    let results = await db.all();
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// Get one order
router.get("/getOrder/:id", async (req, res, next) => {
  try {
    let results = await db.one(req.params.id);
    res.json(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

// Add new order & Send email
router.post("/addorder", async (req, res, next) => {
    try {
      let results = await db.new(
        null,
        req.body.cart,
        req.body.date
      );
      res.json(results);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

// // Add new order & Send email
// router.post("/addorder", async (req, res, next) => {
//   try {
//     let results = await db.new(
//       null,
//       req.body.game_id,
//       req.body.game_name,
//       req.body.quantity,
//       req.body.price
//     );
//     res.json(results);

//     let mailOptions = {
//       from: "milujemmail@gmail.com",
//       to: "robokona@gmail.com",
//       subject: "Order confirmation",
//       text: "You have ordered" + " " + req.body.game_name,
//     };

//     transporter.sendMail(mailOptions, function (error, info) {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log("Email sent: " + info.response);
//       }
//     });
//   } catch (e) {
//     console.log(e);
//     res.sendStatus(500);
//   }
// });

module.exports = router;
