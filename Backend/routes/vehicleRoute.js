const express = require("express");
const router = express.Router();
const {
  createVehicle,
  getAllVehicle,
} = require("../controllers/vehicle.controller");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router.post("/createVehicle", authenticateUser, createVehicle);
router.get("/getAllVehicle", authenticateUser, getAllVehicle);
module.exports = router;
