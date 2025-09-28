const express = require("express");
const dotenv = require("dotenv").config();

const app = express();
const PORT_NO = process.env.PORT;

app.get("/", (req, res) => {
  console.log("Hey there");
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.send("Hey again");
});

app.listen(PORT_NO || 5100, () => {
  console.log("App running successfully");
});
