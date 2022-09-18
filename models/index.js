'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const express = require("express");
const cors = require("cors");
const app = express();

// cors origin depends on environment
var corsOptions = { 
  origin: process.env.NODE_ENV === "production" ? "https://bezk1.herokuapp.com" : "http://localhost:8080"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
  sequelize.authenticate().then(() => {
    console.log("Connection successful!")
  })
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

// SYNC the database and insert mockdata
//db.sequelize.sync(); // Doesn't remove former data
db.sequelize.sync().then(() => { // Removes former data

  // Require mockdata
  const city = require("../mockdata/city.json")
  const cottage_photo = require("../mockdata/cottage_photo.json")
  const cottage = require("../mockdata/cottage.json")
  const photo = require("../mockdata/photo.json")
  const region = require("../mockdata/region.json")
  const review = require("../mockdata/review.json")

  // Insert mockdata
  return(
    db.sequelize.models.city.bulkCreate(city),
    db.sequelize.models.cottage_photo.bulkCreate(cottage_photo),
    db.sequelize.models.cottage.bulkCreate(cottage),
    db.sequelize.models.photo.bulkCreate(photo),
    db.sequelize.models.region.bulkCreate(region),
    db.sequelize.models.review.bulkCreate(review)
  );

})
.then((data) => {
  data.forEach((element) => {
    //console.log(element.toJSON()) // console log created data
  })
})
.catch((err) => {
  console.log(err)
});

require("../routes/cottage.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});