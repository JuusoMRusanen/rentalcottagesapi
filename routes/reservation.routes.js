module.exports = app => {
  const reservation = require("../controllers/reservation.controller.js");

  var router = require("express").Router();

  // Create a new Reservation
  router.post("/", reservation.create);

  // Retrieve all Reservation
  router.get("/", reservation.findAll);

  // Retrieve a single Reservation with id
  router.get("/:id", reservation.findOne);

  // Update a Reservation with id
  router.put("/:id", reservation.update);

  // Delete a Reservation with id
  router.delete("/:id", reservation.delete);

  // Delete all Reservation
  router.delete("/", reservation.deleteAll);

  app.use("/api/reservations", router);
};