const express = require("express");
const db = require("../db");

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

// Add new order
router.post("/addorder", async (req, res, next) => {
    try {
      let results = await db.new(null, req.body.game_id, req.body.game_name, req.body.quantity, req.body.price);
      res.json(results);
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  });

// add new order
// router.post("/addorder", function (req, res) {
//   let sql = `INSERT INTO orders(game_id, game_name, quantity, price) VALUES (?)`;
//   let values = [req.body.game_id, req.body.game_name, req.body.quantity, req.body.price];
//   db.query(sql, [values], function (err, data, fields) {
//     if (err) throw err;
//     res.json({
//       status: 200,
//       message: "New user added successfully",
//     });
//   });
// });

module.exports = router;
