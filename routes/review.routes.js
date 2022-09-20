module.exports = app => {
  const review = require("../controllers/review.controller.js");

  var router = require("express").Router();

  // Create a new Review
  router.post("/", review.create);

  // Retrieve all Review
  router.get("/", review.findAll);

  // Retrieve a single Review with id
  router.get("/:id", review.findOne);

  // Update a Review with id
  router.put("/:id", review.update);

  // Delete a Review with id
  router.delete("/:id", review.delete);

  // Delete all Review
  router.delete("/", review.deleteAll);

  app.use("/api/reviews", router);
};