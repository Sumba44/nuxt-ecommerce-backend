const express = require("express");
const router = require("express").Router();
hello = require("../controllers/hello");

router.get("/", hello.hello);

module.exports = router;