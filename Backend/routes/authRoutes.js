const express = require("express");
const {
  register,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
  updateUser,
} = require("../controllers/auth.controller");
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();

router.post("/register", register);
router.get("/check", authenticateUser,checkAuth);
router.post("/login", login);
router.post("/logout", authenticateUser,logout);
router.post("/verifyEmail", verifyEmail);
router.patch("/resetPassword", resetPassword);
router.post("/forgotPassword", forgotPassword);
router.post("/updateUser",authenticateUser, updateUser)
module.exports = router;
