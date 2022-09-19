module.exports = app => {
  const photo = require("../controllers/photo.controller.js");

  var router = require("express").Router();

  // Create a new Cottage
  router.post("/", photo.create);

  // Retrieve all photo
  router.get("/", photo.findAll);

  // Retrieve a single Cottage with id
  router.get("/:id", photo.findOne);

  // Update a Cottage with id
  router.put("/:id", photo.update);

  // Delete a Cottage with id
  router.delete("/:id", photo.delete);

  // Delete all photo
  router.delete("/", photo.deleteAll);

  app.use("/api/photo", router);
};