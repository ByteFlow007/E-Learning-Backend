const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"));
app.use(cors({ origin: process.env.CORS_ORIGIN }));

module.exports = app;
