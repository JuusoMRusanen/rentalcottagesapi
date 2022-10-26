//const db = require("../models/index.dev"); // DEVELOPMENT PATH
const db = require("../models/index"); // PRODUCTION PATH

const Photo = db.photo;
const Op = db.Sequelize.Op;

// Create and Save a new Photo
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Photo
  const Photo = {
    src: req.body.src,
    priority: req.body.priority,
  };

  // Save Photo in the database
  Photo.create(Photo)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Photo."
      });
    });
};

// Retrieve photos for a cottage.
exports.findAllForCottage = (req, res) => {

  const cottageId = req.params.id;

  Photo.findAll({ where: { cottageId: cottageId } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving photos."
      });
    });
};

// Retrieve all photos from the database.
exports.findAll = (req, res) => {

  const src = req.body.src;
  var condition = src ? { src: { [Op.iLike]: `%${src}%` } } : null;

  Photo.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving photos."
      });
    });
};

// Find a single Photo with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Photo.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Photo with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Photo with id=" + id
      });
    });
};

// Update a Photo by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Photo.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Photo was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Photo with id=${id}. Maybe Photo was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Photo with id=" + id
      });
    });
};

// Delete a Photo with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Photo.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Photo was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Photo with id=${id}. Maybe Photo was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Photo with id=" + id
      });
    });
};

// Delete all photos from the database.
exports.deleteAll = (req, res) => {
  Photo.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} photos were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all photos."
      });
    });
};