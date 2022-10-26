module.exports = app => {
  const photo = require("../controllers/photo.controller.js");

  var router = require("express").Router();

  // Create a new Photo
  router.post("/", photo.create);

  // Retrieve all photo for a cottage
  router.get("/:id", photo.findAllForCottage);

  // Retrieve all photo
  router.get("/", photo.findAll);

  // Retrieve a single Photo with id
  router.get("/:id", photo.findOne);

  // Update a Photo with id
  router.put("/:id", photo.update);

  // Delete a Photo with id
  router.delete("/:id", photo.delete);

  // Delete all photo
  router.delete("/", photo.deleteAll);

  app.use("/api/photos", router);
};