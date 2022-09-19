//const db = require("../models/index.dev"); // DEVELOPMENT PATH
const db = require("../models/index"); // PRODUCTION PATH

const Region = db.region;
const Op = db.Sequelize.Op;

// Create and Save a new Region
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Region
  const Region = {
    name: req.body.name
  };

  // Save Region in the database
  Region.create(Region)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Region."
      });
    });
};

// Retrieve all regions from the database.
exports.findAll = (req, res) => {
  const name = req.body.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  Region.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving regions."
      });
    });
};

// Find a single Region with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Region.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Region with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Region with id=" + id
      });
    });
};

// Update a Region by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Region.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Region was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Region with id=${id}. Maybe Region was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Region with id=" + id
      });
    });
};

// Delete a Region with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Region.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Region was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Region with id=${id}. Maybe Region was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Region with id=" + id
      });
    });
};

// Delete all regions from the database.
exports.deleteAll = (req, res) => {
  Region.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} regions were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all regions."
      });
    });
};