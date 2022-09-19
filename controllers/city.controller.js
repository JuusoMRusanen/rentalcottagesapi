//const db = require("../models/index.dev"); // DEVELOPMENT PATH
const db = require("../models/index"); // PRODUCTION PATH

const City = db.city;
const Op = db.Sequelize.Op;

// Create and Save a new City
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a City
  const City = {
    regionId: req.body.regionId,
    name: req.body.name,
  };

  // Save City in the database
  City.create(City)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the City."
      });
    });
};

// Retrieve all citys from the database.
exports.findAll = (req, res) => {
  const name = req.body.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  City.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving citys."
      });
    });
};

// Find a single City with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  City.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find City with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving City with id=" + id
      });
    });
};

// Update a City by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  City.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "City was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update City with id=${id}. Maybe City was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating City with id=" + id
      });
    });
};

// Delete a City with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  City.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "City was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete City with id=${id}. Maybe City was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete City with id=" + id
      });
    });
};

// Delete all citys from the database.
exports.deleteAll = (req, res) => {
  City.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} citys were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all citys."
      });
    });
};