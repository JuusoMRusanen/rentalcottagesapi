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
  origin: process.env.NODE_ENV === "production" ? "https://rentalcottages.herokuapp.com" : "http://localhost:3000"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Serves resources from public folder
app.use(express.static(__dirname + '/../public'));

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

// List models
const City = db.sequelize.models.city;
const Cottage = db.sequelize.models.cottage;
const Photo = db.sequelize.models.photo;
const Region = db.sequelize.models.region;
const Review = db.sequelize.models.review;

// Associations
Region.hasMany(City)
City.belongsTo(Region)
City.hasMany(Cottage)
Cottage.belongsTo(City)
Cottage.hasMany(Review)
Review.belongsTo(Cottage)
Cottage.hasMany(Photo)
Photo.belongsTo(Cottage)

// Read and remove all user uploaded images(not included by default) from the public folder
function deleteUploadedImages(dirName) {

  let defaultFiles = [];

  // Generate default file names
  for (let idx = 0; idx <= 14; idx++) {
    defaultFiles.push(`${idx}.jpg`);
  }

  // Additional default files
  defaultFiles.push("mokki0.png");

  //console.log(defaultFiles);

  fs.readdir(dirName, (err, allFiles) => {
    if (err) {
      onError(err);
      return;
    }
    allFiles.forEach(allFile => {
      if ( !defaultFiles.includes(allFile) ){
        fs.unlink(dirName + allFile, (err) => {
          if (err) throw err;
          console.log(allFile + ' was deleted.');
        });
      }
    });
  });
}

// SYNC the database and insert mockdata
//db.sequelize.sync(); // Doesn't remove former data
db.sequelize.sync({ force: true }).then(() => { // Removes former data

  // Delete user uploaded images
  deleteUploadedImages(__dirname + '/../public/photos/')

  // Require mockdata
  const city = require("../mockdata/city.json")
  const cottage = require("../mockdata/cottage.json")
  const photo = require("../mockdata/photo.json")
  const region = require("../mockdata/region.json")
  const review = require("../mockdata/review.json")

  // Insert mockdata
  // CREATION ORDER MUST BE ACCORDING TO ASSOCIATIONS
  return(
    Region.bulkCreate(region),
    City.bulkCreate(city),
    Cottage.bulkCreate(cottage),
    Photo.bulkCreate(photo),
    Review.bulkCreate(review)
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

// Enable routes
require("../routes/city.routes")(app);
require("../routes/cottage.routes")(app);
require("../routes/photo.routes")(app);
require("../routes/region.routes")(app);
require("../routes/review.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});