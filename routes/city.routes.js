module.exports = app => {
  const city = require("../controllers/city.controller.js");

  var router = require("express").Router();

  // Create a new Cottage
  router.post("/", city.create);

  // Retrieve all city
  router.get("/", city.findAll);

  // Retrieve a single Cottage with id
  router.get("/:id", city.findOne);

  // Update a Cottage with id
  router.put("/:id", city.update);

  // Delete a Cottage with id
  router.delete("/:id", city.delete);

  // Delete all city
  router.delete("/", city.deleteAll);

  app.use("/api/cities", router);
};