const express = require("express");
const app = express();
const bodyparser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
let router = require("./src/router/router");
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors());

function init() {
  try {
    app.use("/", router);
    app.listen(process.env.port, () => {
      console.log(`Now listening on port ${process.env.port}`);
    });
  } catch (err) {
    console.log(err.message);
  }
}
init();
