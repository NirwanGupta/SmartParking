const express = require("express");
const router = express.Router();
const {
  createParking,
  getAllParking,
  addFloor,
  showParking,
  bookParking,
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

router.get("/getAllParking", getAllParking);
router.post("/bookParking", authenticateUser, bookParking);

router.post(
  "/addFloor",
  authenticateUser,
  authorizePermissions("owner", "admin"),
  addFloor
);

router.post("/showParking", showParking);
module.exports = router;
