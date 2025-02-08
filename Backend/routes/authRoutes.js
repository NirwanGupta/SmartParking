const express = require("express");
const {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticateUser,logout);
router.post("/verifyEmail", verifyEmail);
router.patch("/resetPassword", resetPassword);
router.post("/forgotPassword", forgotPassword);

module.exports = router;
