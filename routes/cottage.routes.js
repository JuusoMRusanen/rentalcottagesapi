module.exports = app => {
  const cottages = require("../controllers/cottage.controller.js");

  var router = require("express").Router();

  // Create a new Cottage
  router.post("/", cottages.create);

  // Retrieve all cottages
  router.get("/", cottages.findAll);

  // Retrieve a single Cottage with id
  router.get("/:id", cottages.findOne);

  // Update a Cottage with id
  router.put("/:id", cottages.update);

  // Delete a Cottage with id
  router.delete("/:id", cottages.delete);

  // Delete all cottages
  router.delete("/", cottages.deleteAll);

  app.use("/api/cottages", router);
};