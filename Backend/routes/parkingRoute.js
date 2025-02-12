const express = require("express");
const router = express.Router();
const { createParking } = require("../controllers/parkingController");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router.post("/createParking", authenticateUser,createParking);

module.exports = router;
