const express = require("express");
const data = require("../../data");
const router = express.Router();

router.get("/", function (req, res) {
  const params = data.loadParams();
  res.render("setup/config", { params });
});

router.post("/", function (req, res) {
  const currentEnv = data.loadEnv();
  const env = {
    ...currentEnv,
    ...req.body,
  };

  // we've run setup
  env.PREBOT_CONFIGURED = "true";

  data.saveEnv(env);

  setTimeout(() => {
    process.exit(42);
  }, 1000);

  res.render("setup/reload");
});

module.exports = router;
