const express = require("express");
const router = express.Router();
const {
  createVehicle,
  getAllVehicle,
  updateVehicle
} = require("../controllers/vehicle.controller");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router.post("/createVehicle", authenticateUser, createVehicle);
router.patch("/updateVehicle", authenticateUser, updateVehicle);
router.get("/getAllVehicle", authenticateUser, getAllVehicle);
module.exports = router;