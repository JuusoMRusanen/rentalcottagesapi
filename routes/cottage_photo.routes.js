module.exports = app => {
  const cottage_photo = require("../controllers/cottage_photo.controller.js");

  var router = require("express").Router();

  // Create a new Cottage
  router.post("/", cottage_photo.create);

  // Retrieve all cottage_photo
  router.get("/", cottage_photo.findAll);

  // Retrieve a single Cottage with id
  router.get("/:id", cottage_photo.findOne);

  // Update a Cottage with id
  router.put("/:id", cottage_photo.update);

  // Delete a Cottage with id
  router.delete("/:id", cottage_photo.delete);

  // Delete all cottage_photo
  router.delete("/", cottage_photo.deleteAll);

  app.use("/api/cottage_photo", router);
};