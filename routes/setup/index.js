const express = require("express");
const configRouter = require("./config");
const targetRouter = require("./target");

const router = express.Router();

router.use("/config", configRouter);
router.use("/target", targetRouter);

router.get("/", (req, res) => {
  res.render("setup");
});

module.exports = router;
