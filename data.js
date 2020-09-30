const dotenv = require("dotenv");
const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");

const cwd = process.cwd();
const paramsPath = path.join(cwd, "params.yml");
const envPath = path.join(cwd, ".env");

/**
 * Load params configuration from the current working directory.
 */
exports.loadParams = function loadParams() {
  const raw = fs.readFileSync(paramsPath, "utf8");
  const params = yaml.safeLoad(raw);

  for (const param of params) {
    if (!Object.prototype.hasOwnProperty.call(params, "inputType")) {
      param["inputType"] = "input";
    }
  }

  return params;
};

/**
 * Load .env from the current working directory
 */
exports.loadEnv = function loadEnv() {
  let raw = "";

  try {
    fs.readFileSync(envPath, "utf8");
  } catch {}

  const env = dotenv.parse(raw);

  return env;
};

/**
 * Serialize and object from { k: v } to k=v and write it
 * out to .env
 *
 * @param {Object} env
 */
exports.saveEnv = function saveEnv(env) {
  const raw = Object.keys(env)
    .map((key) => `${key}=${env[key]}`)
    .join("\n");

  fs.writeFileSync(envPath, raw);
};
