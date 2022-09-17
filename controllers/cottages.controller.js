//const db = require("../models/index.dev"); // DEVELOPMENT PATH
const db = require("../models/index"); // PRODUCTION PATH

const Cottage = db.cottages;
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
exports.findAll = (req, res) => {
  const name = req.body.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  Cottage.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving cottages."
      });
    });
};

// Find a single Cottage with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Cottage.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Cottage with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Cottage with id=" + id
      });
    });
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