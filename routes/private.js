const express = require("express");
const router = express.Router();
const verify = require("../middleware/verifyToken");
const db = require("../controllers/db");

router.get("/getUser", verify, async (req, res) => {
  try {
    const userInfo = await db.getUser(req.user.id);
    res.status(200).send(userInfo);
  } catch (e) {
    console.log(e);
    res.sendStatus(500).send(e);
  }
});

// Add a new product
router.post("/addproduct", async (req, res, next) => {
  try {
    await db.newProduct(
      null,
      req.body.title,
      req.body.shortDesc,
      req.body.desc,
      req.body.rating,
      req.body.price,
      req.body.wholesalePrice,
      req.body.sale,
      req.body.quantity,
      req.body.productImage,
      req.body.productVideo,
      req.body.slug,
      req.body.supplier
    );
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = router;
