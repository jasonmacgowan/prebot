const express = require("express");
const url = require("url");
const data = require("../data");
const router = express.Router();

router.get("/", function (req, res) {
  const params = data.loadParams();
  res.render("setup", { params });
});

router.post("/", function (req, res) {
  const currentEnv = data.loadEnv();
  const env = {
    ...currentEnv,
    ...req.body,
  };

  if (typeof env.GHE_URL && env.GHE_URL.length > 0) {
    const { host, protocol } = new url.URL(env.GHE_URL);

    env.GHE_HOST = host;
    env.GHE_PROTOCOL = protocol.replace(/:$/, "");
  }

  // we've run setup
  env.PREBOT_CONFIGURED = "true";

  // we don't need this anymore
  delete env.GHE_URL;

  data.saveEnv(env);

  setTimeout(() => {
    process.exit(42);
  }, 1000);

  res.render("reload");
});

module.exports = router;
