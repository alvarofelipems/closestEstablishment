# Closest establishment
> *Este arquivo também está disponível em português [aqui](README_pt.md).*

Given a specific geographic position the service will search for on the database
the establishments which are able to cover the area and find the one closer to it.

## Requirements

In this project was used the idea of containers in order to isolate each service of application so it would become possible to run inside the local area and also according to the dev and prod environment with the closest experience possible.

In order to make the application work, it will be necessary to have the [docker](https://www.docker.com/) installed in your machine and also the [docker-compose](https://docs.docker.com/compose/) to compose the containers.

## Installation:

### 1. Cloning:

The repository will need to be cloned.

```
git clone ######
```

### 2. Runing:

Inside the dir where the project was cloned it is necessary to run the command.

```
./application start
```
### 3. Seeding:

Let's add a few data in the database so the application can be tested.

```
./application seeding
```

## Front-end:

Open the local address, which probably is [http://localhost/:81](http://localhost/:81)

On this link you will see a front-end application to consum the API

Once you click in any spot on the map, it will be presented a localization of the closest partner and the coverage area will be highlighted


## Tests

To make sure the code is working well, the application relies on automated tests and in order to run them you should use the command:

```
./application test
```

The test coverage was developed only for the API features of the project and if you want to contribute with another test you can add them to the folder `api/tests`


The test tools used were:

- [tape](https://www.npmjs.com/package/tape)
- [supertest](https://www.npmjs.com/package/supertest)

## Architecture


On `docker-compose.yml` are established the following services and bellow you can find the explanation for each one of them.


* API
* webserver_api
* mongo
* mongo-express
* web
* webserver_web


### API

The `API` is the main service of this project and it has the following features:

- To register partners
- To show a specific partner through its `id`
- To find the closest partner inside the area


### MongoDB

Mongo DB is a document-based database and it was chosen for the project because of the following advantages:

* It makes the complex structure objects storage easier
* There are many resources to manage GeoJSON
* Simple and fast queries

### Mongo Express

MongoDB admin interface

### Webserver API

NGINX was used to receive users requests and load balancing across multiple instances instances of API

### WEB

Front-end application to consum the API.

### Webserver API

The same thing as Webserver API, but for WEB

## Turning off

Once you want to turn off everything that has been running in your machine, you just have to run the command


```
./application stop
```



## If you love Postman ❤️


You can download the collection [here](https://www.postman.com/collections/e5f281994138a13a156f)
