const express = require("express");
const fs = require("fs");
require('dotenv').config();

const app = express();

app.get("/", (req, res) => {
  fs.readFile(__dirname + '/html/index.html', (err, html) => {
    html = html.toString().replace('{{API_URI}}', process.env.API_URI);

    if (process.env.MAPS_KEY) {
        html.replace('key={{MAPS_KEY}}', process.env.MAPS_KEY);
    }

    res.send(html);
  });
});

app.listen(3000);
