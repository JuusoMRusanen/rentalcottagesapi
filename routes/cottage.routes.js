module.exports = app => {
  const cottage = require("../controllers/cottage.controller.js");

  var router = require("express").Router();

  // Create a new Cottage
  router.post("/", cottage.create);

  // Retrieve all cottage
  router.get("/", cottage.findAll);

  // Retrieve all cottages with regionId
  router.get("/region/:id", cottage.findAllByRegionId);

  // Retrieve all cottages with regionId
  router.get("/city/:id", cottage.findAllByCityId);

  // Retrieve a single Cottage with id
  router.get("/:id", cottage.findOne);

  // Update a Cottage with id
  router.put("/:id", cottage.update);

  // Delete a Cottage with id
  router.delete("/:id", cottage.delete);

  // Delete all cottage
  router.delete("/", cottage.deleteAll);

  app.use("/api/cottages", router);
};