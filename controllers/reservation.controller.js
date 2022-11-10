//const db = require("../models/index.dev"); // DEVELOPMENT PATH
const db = require("../models/index"); // PRODUCTION PATH

const Reservation = db.reservation;
const Op = db.Sequelize.Op;

// Create and Save a new Reservation
exports.create = (req, res) => {

  console.log(req.body)

  // Validate request
  if (!req.body.firstName) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Reservation
  const reservation = {
    cottageId: req.body.cottageId,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    homeAddress: req.body.homeAddress,
    postalCode: req.body.postalCode,
    postalDistrict: req.body.postalDistrict,
    cleanUp: req.body.cleanUp,
    finalPrice: req.body.finalPrice,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  };

  // Save Reservation in the database
  Reservation.create(reservation)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Reservation."
      });
    });
};

// Retrieve all reservations from the database.
exports.findAll = (req, res) => {
  const name = req.body.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  Reservation.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving reservations."
      });
    });
};

// Find a single Reservation with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Reservation.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Reservation with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Reservation with id=" + id
      });
    });
};

// Update a Reservation by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Reservation.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Reservation was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Reservation with id=${id}. Maybe Reservation was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Reservation with id=" + id
      });
    });
};

// Delete a Reservation with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Reservation.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Reservation was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Reservation with id=${id}. Maybe Reservation was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Reservation with id=" + id
      });
    });
};

// Delete all reservations from the database.
exports.deleteAll = (req, res) => {
  Reservation.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} reservations were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all reservations."
      });
    });
};