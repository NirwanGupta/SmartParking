const express = require("express");
const router = express.Router();
const {
  createParking,
  getAllParkingGoogleMap,
  addFloor,
  showParking,
  bookParking,
  getMyParking,
} = require("../controllers/parkingController");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router.post(
  "/createParking",
  authenticateUser,
  authorizePermissions("owner", "admin"),
  createParking
);

router.get("/getAllParking", getAllParkingGoogleMap);
router.post("/bookParking", authenticateUser, bookParking);
router.get(
  "/getMyParking",
  authenticateUser,
  authorizePermissions("owner", "admin"),
  getMyParking
);
router.post(
  "/addFloor",
  authenticateUser,
  authorizePermissions("owner", "admin"),
  addFloor
);

router.post("/showParking", showParking);
module.exports = router;
