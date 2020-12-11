const test = require('tape')
var request = require('supertest');
var app = require('../../index.js');
var Data = require('../../Data.js');

const { MongoClient } = require("mongodb");

app.database = 'zedelivery_teste';

var data = {
  validJson: Data(0),
  invalidJson: Data(5),
}

async function removeDatabase() {
  const mongo = new MongoClient(app.uriMongoDB);
    mongo.connect().then(() => {
    const database = mongo.db(app.database);
    database.dropDatabase();
    mongo.close();
  });
  return true;
}

test('POST / with a valid request', (t) => {
  request(app)
    .post('/')
    .expect(200)
    .expect('Content-Type', /json/)
    .send(Data(0))
    .end(function (err, res) {
      if (res.body.error) {
        t.ok(res.body.error);
        t.ok(res.body.message, res.body.message);
      } else {
        t.ok(res.body.id);
      }

      t.end();
    });
});

test('GET /:id for find partner by id', (t) => {
  var id = data.validJson.id;
  request(app)
    .get('/' + id)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
      t.ok(res.body.id);
      t.equal(res.body.id, id);

      t.end();
    });
});

test('POST / with a duplicated partner', (t) => {
  request(app)
    .post('/')
    .expect(200)
    .expect('Content-Type', /json/)
    .send(data.validJson)
    .end(function (err, res) {
      t.ok(res.body.error);
      t.ok(res.body.message, res.body.message);
      t.equal(res.body.message, 'Duplicated partner');

      t.end();
    });
});

test('POST / with a invalid coverage area', (t) => {
  request(app)
    .post('/')
    .expect(200)
    .expect('Content-Type', /json/)
    .send(data.invalidJson)
    .end(function (err, res) {
      t.error(err, err);
      t.true(res.body.error);
      t.true(res.body.message);
      t.equal(res.body.message, 'Invalid coverage area');
      // t.equal(res.body.message, 'Invalid GeoJson');
      t.end();
    });
});

test('GET /near witout required parameters', (t) => {
  request(app)
    .get('/near')
    .expect(422)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      t.error(err);
      t.ok(res.body.message);
      t.end();
    });
});

test('GET /near with a non coveraged area', (t) => {
  request(app)
    .get('/near?lat=-16.946955162375367&lng=3.357789313316797')
    .expect(404)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      t.error(err, {msg: err});
      t.ok(res.body.message);
      t.end();
    });
});

test('GET /near with a coveraged area', (t) => {
  request(app)
    .get('/near?lat=-23.003382967044733&lng=-43.36497027197921')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
      t.error(err, {msg: err});
      t.ok(res.body.id);
      t.end();
    });
});

test.onFinish(removeDatabase);