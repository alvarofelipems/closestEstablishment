const express = require("express");
const fs = require("fs");
require('dotenv').config();

const app = express();

app.get("/", (req, res) => {
  fs.readFile(__dirname + '/html/index.html', (err, data) => {
    res.send(
      data.toString()
        .replace('{{API_URI}}', process.env.API_URI)
        .replace('{{MAPS_KEY}}', process.env.MAPS_KEY)
    );
  });
});

app.listen(3000);
