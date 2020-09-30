const express = require("express");
const url = require("url");
const data = require("../../data");

const router = express.Router();

router.get("/", function (req, res) {
  const env = data.loadEnv();

  let gheURL;

  if (
    Object.prototype.hasOwnProperty.call(env, "GHE_HOST") &&
    Object.prototype.hasOwnProperty.call(env, "GHE_PROTOCOL")
  ) {
    gheURL = `${env.GHE_PROTOCOL}${env.GHE_HOST}`;
  }

  res.render("setup/target", { url: gheURL });
});

router.post("/", function (req, res) {
  const errors = [];
  const currentEnv = data.loadEnv();

  const env = {
    ...currentEnv,
    ...req.body,
  };

  /**
   * split GHE_URL into GHE_HOST and GHE_PROTOCOL
   */
  if (typeof env.GHE_URL && env.GHE_URL.length > 0) {
    try {
      const { host, protocol } = new url.URL(env.GHE_URL);

      env.GHE_HOST = host;
      env.GHE_PROTOCOL = protocol.replace(/:$/, "");

      // we don't need this anymore
      delete env.GHE_URL;
    } catch (err) {
      errors.push("Invalid url.");
    }
  }

  if (errors.length) {
    res.render("setup/target", { errors, url: env.GHE_URL });
  } else {
    data.saveEnv(env);
    res.redirect("config");
  }
});

module.exports = router;
