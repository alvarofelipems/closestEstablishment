const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
const gjv = require("geojson-validation");
const { MongoClient } = require("mongodb");

require('dotenv').config();

app.uriMongoDB = "mongodb://" + process.env.DB_USER + ":" + encodeURIComponent(process.env.DB_PASS) + "@" + process.env.DB_HOST + "?w=majority";
app.database = process.env.DB_NAME;

app.use(bodyParser.json());
app.use(cors());

app.get("/near/", cors(), (req, res) => {
  if (req.query.lng == undefined || req.query.lat == undefined) {
    res.status(422).json({message: 'Required parameters are missing'}).end();
    return false;
  }

  var partners = partnerNear(req.query).then((partner) => {
    if (partner) {
      res.json(partner);
    } else {
      res.status(404).json({message: 'We don\'t have partners in this place'}).end();
    }
  });
});

app.get("/:id", cors(), async (req, res) => {
  const mongoClient = new MongoClient(app.uriMongoDB);
  try {
    await mongoClient.connect();
    const database = mongoClient.db(app.database);
    const collection = database.collection("partners");

    const partner = await collection.findOne({
      id: req.params.id
    });

    if (!partner) {
      res.status(404).json({
        message: "There is no partner with this id"
      });
      return false;
    }
    res.json(partner);
  } finally {
    await mongoClient.close();
  }
});

app.post("/", cors(), async (req, res) => {
  var partner = req.body;

  if (!gjv.valid(partner.coverageArea) || !gjv.valid(partner.address)) {
    res.json({
      error: true,
      message: 'Invalid GeoJson'
    });
    return false;
  }

  const mongoClient = new MongoClient(app.uriMongoDB);
  try {
    await mongoClient.connect();
    const database = mongoClient.db(app.database);

    const collection = database.collection("partners");

    await collection.createIndex({
      'coverageArea': "2dsphere",
      'address': "2dsphere"
    });
    await collection.createIndex({'id': 1}, { unique: true });
    await collection.createIndex({'document': 1}, { unique: true });


    const result = await collection.insertOne(partner);
    res.json(result.ops[0]);
  } catch (e) {
    switch (e.code) {
      case 11000:
        res.json({
          error: true,
          message: 'Duplicated partner'
        });
        break;

      case 16755:
        res.json({
          error: true,
          message: 'Invalid coverage area'
        });
        break;

      default:
        console.log(e);
        res.json({
          error: true,
          message: 'Unknown error'
        });
        break;
    }
  } finally {
    await mongoClient.close();
  }

});

if (require.main === module) {
  app.listen(3000);
}

async function partnerNear(filter = {}) {
  console.log(filter);
  const mongoClient = new MongoClient(app.uriMongoDB);
  try {
    await mongoClient.connect();
    const database = mongoClient.db(app.database);
    const collection = database.collection("partners");

    if (filter.lng == undefined || filter.lat == undefined) {
      return false;
    }

    var query = {
      'coverageArea': {
        $geoIntersects: {
          $geometry: {
            type: "Point" ,
            coordinates: [Number(filter.lng), Number(filter.lat)]
          }
        }
      },
      'address': {
        $near: {
          $geometry: {
            type: "Point" ,
            coordinates: [Number(filter.lng), Number(filter.lat)]
          }
        }
      },
    };

    const partner = await collection.findOne(query);

    return partner;
  } finally {
    await mongoClient.close();
  }
}

// Expose app
exports = module.exports = app;