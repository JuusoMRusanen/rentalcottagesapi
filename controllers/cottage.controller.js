//const db = require("../models/index.dev"); // DEVELOPMENT PATH
const db = require("../models/index"); // PRODUCTION PATH

const { QueryTypes } = require('sequelize');

const Cottage = db.cottage;
const Op = db.Sequelize.Op;

// Create and Save a new Cottage
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Cottage
  const Cottage = {
    cityId: req.body.cityId,
    name: req.body.name,
    bedrooms: req.body.bedrooms,
    bathrooms: req.body.bathrooms,
    price: req.body.price,
    size: req.body.size,
  };

  // Save Cottage in the database
  Cottage.create(Cottage)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Cottage."
      });
    });
};

// Retrieve all cottages from the database.
exports.findAll = async (req, res) => {

  await Cottage.sequelize.query(
    'SELECT *, '+
    'cottage.id AS "cottageId", '+
    'region.id AS "regionId", '+
    'city.name AS "cityName", '+
    'region.name AS "regionName", '+ 
    'cottage.name AS "cottageName" '+ 
    'FROM cottage '+
    'JOIN city ON "cityId" = city.id '+
    'JOIN region ON "regionId" = region.id',
    { type: QueryTypes.SELECT })
  .then(data => {
    res.send(data);
  });
};

// Find a single Cottage with an id
exports.findOne = async (req, res) => {

  const id = req.params.id;
  const error = "Hupsista! Mökkiä ei löytynyt.";
  const reg = new RegExp('^[0-9]+$'); // a number or not
  
  if (reg.test(id)) {
    await Cottage.sequelize.query(
      'SELECT *, '+
      'cottage.id AS "cottageId", '+
      'city.id AS "cityId", '+
      'region.id AS "regionId", '+
      'city.name AS "cityName", '+
      'region.name AS "regionName", '+
      'cottage.name AS "cottageName" '+
      'FROM cottage '+
      'JOIN city ON "cityId" = city.id '+
      'JOIN region ON "regionId" = region.id '+
      'WHERE cottage.id = :id',
      { replacements: { id: id }, type: QueryTypes.SELECT })
    .then( (data, err) => {
      if (data.length > 0) {
        res.send({ cottage: data })
      } else {
        res.send({ error })
      }
      if (err) throw err;
    })
  } else {
    res.send({ error })
    console.log("Cottage not found.")
  }
};

// Update a Cottage by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Cottage.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Cottage was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Cottage with id=${id}. Maybe Cottage was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Cottage with id=" + id
      });
    });
};

// Delete a Cottage with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Cottage.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Cottage was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Cottage with id=${id}. Maybe Cottage was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Cottage with id=" + id
      });
    });
};

// Delete all cottages from the database.
exports.deleteAll = (req, res) => {
  Cottage.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} cottages were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all cottages."
      });
    });
};