module.exports = app => {
  const region = require("../controllers/region.controller.js");

  var router = require("express").Router();

  // Create a new Cottage
  router.post("/", region.create);

  // Retrieve all region
  router.get("/", region.findAll);

  // Retrieve a single Cottage with id
  router.get("/:id", region.findOne);

  // Update a Cottage with id
  router.put("/:id", region.update);

  // Delete a Cottage with id
  router.delete("/:id", region.delete);

  // Delete all region
  router.delete("/", region.deleteAll);

  app.use("/api/region", router);
};