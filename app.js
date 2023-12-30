const express = require("express");
const app = express();

app.use(express.json({limit:"20kb"}));

module.exports = app;