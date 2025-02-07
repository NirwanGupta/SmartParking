const express = require("express");
const {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout); 
router.post("/verifyEmail", verifyEmail);
router.patch("/resetPassword", resetPassword);
router.post("/forgotPassword", forgotPassword); 

module.exports = router;
