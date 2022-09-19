//const db = require("../models/index.dev"); // DEVELOPMENT PATH
const db = require("../models/index"); // PRODUCTION PATH

const Cottage_photo = db.cottage_photo;
const Op = db.Sequelize.Op;

// Create and Save a new Cottage_photo
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Cottage_photo
  const Cottage_photo = {
    src: req.body.src,
    priority: req.body.priority,
  };

  // Save Cottage_photo in the database
  Cottage_photo.create(Cottage_photo)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Cottage_photo."
      });
    });
};

// Retrieve all cottage_photos from the database.
exports.findAll = (req, res) => {
  const src = req.body.src;
  var condition = src ? { src: { [Op.iLike]: `%${src}%` } } : null;

  Cottage_photo.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving cottage_photos."
      });
    });
};

// Find a single Cottage_photo with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Cottage_photo.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Cottage_photo with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Cottage_photo with id=" + id
      });
    });
};

// Update a Cottage_photo by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Cottage_photo.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Cottage_photo was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Cottage_photo with id=${id}. Maybe Cottage_photo was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Cottage_photo with id=" + id
      });
    });
};

// Delete a Cottage_photo with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Cottage_photo.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Cottage_photo was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Cottage_photo with id=${id}. Maybe Cottage_photo was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Cottage_photo with id=" + id
      });
    });
};

// Delete all cottage_photos from the database.
exports.deleteAll = (req, res) => {
  Cottage_photo.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} cottage_photos were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all cottage_photos."
      });
    });
};