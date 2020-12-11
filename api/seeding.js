const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
const gjv = require("geojson-validation");
const { MongoClient } = require("mongodb");

require('dotenv').config();

console.log('Populando MongoDB');

async function seedingMongoDB() {
  var uriMongoDB = "mongodb://" + process.env.DB_USER + ":" + encodeURIComponent(process.env.DB_PASS) + "@" + process.env.DB_HOST + "?w=majority";
  var databaseName = process.env.DB_NAME;

  const mongoClient = new MongoClient(uriMongoDB);
  await mongoClient.connect();
  const database = mongoClient.db(databaseName);

  const collection = database.collection("partners");

  await collection.createIndex({
    'coverageArea': "2dsphere",
    'address': "2dsphere"
  });
  await collection.createIndex({'id': 1}, { unique: true });
  await collection.createIndex({'document': 1}, { unique: true });


  var partners = partnersListFile();

  for (var partner of partners) {
    try {
      const result = await collection.insertOne(partner);
      console.log(result);
    } catch (e) {

    }
  }

  await mongoClient.close();
}

function partnersListFile() {
  var fs = require('fs');
  var obj = JSON.parse(fs.readFileSync('storage/pdvs.json', 'utf8'));

  return obj['pdvs'];
}

seedingMongoDB();