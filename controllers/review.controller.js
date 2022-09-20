//const db = require("../models/index.dev"); // DEVELOPMENT PATH
const db = require("../models/index"); // PRODUCTION PATH

const Review = db.review;
const Op = db.Sequelize.Op;

// Create and Save a new Review
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Review
  const Review = {
    cottageId: req.body.cottageId,
    nickName: req.body.nickName,
    rating: req.body.rating,
    comment: req.body.comment,
    date: req.body.date,
  };

  // Save Review in the database
  Review.create(Review)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Review."
      });
    });
};

// Retrieve all reviews from the database.
exports.findAll = (req, res) => {
  const cottageId = req.body.cottageId;
  var condition = cottageId ? { cottageId: { [Op.iLike]: `%${cottageId}%` } } : null;

  Review.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving reviews."
      });
    });
};

// Find a single Review with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Review.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Review with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Review with id=" + id
      });
    });
};

// Update a Review by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Review.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Review was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Review with id=${id}. Maybe Review was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Review with id=" + id
      });
    });
};

// Delete a Review with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Review.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Review was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Review with id=${id}. Maybe Review was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Review with id=" + id
      });
    });
};

// Delete all reviews from the database.
exports.deleteAll = (req, res) => {
  Review.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} reviews were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all reviews."
      });
    });
};