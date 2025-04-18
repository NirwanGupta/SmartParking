const express = require("express");
const router = express.Router();
const {
  createVehicle,
  getAllVehicle,
  updateVehicle,
  deleteVehicle
} = require("../controllers/vehicle.controller");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router.post("/createVehicle", authenticateUser, createVehicle);
router.patch("/updateVehicle", authenticateUser, updateVehicle);
router.get("/getAllVehicle", authenticateUser, getAllVehicle);
router.delete("/deleteVehicle", authenticateUser, deleteVehicle);
module.exports = router;