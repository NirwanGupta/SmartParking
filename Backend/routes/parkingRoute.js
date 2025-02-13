const express = require("express");
const router = express.Router();
const {
  createParking,
  getAllParking,
} = require("../controllers/parkingController");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router.post(
  "/createParking",
  authenticateUser,
  authorizePermissions("owner"),
  createParking
);
router.get("/getAllParking", getAllParking);
module.exports = router;
