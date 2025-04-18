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
  uploadImages,
} = require("../controllers/auth.controller");
const {registerPartner}=require("../controllers/authPartner")
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const router = express.Router();

router.post("/register", register);
router.get("/check", authenticateUser, checkAuth);
router.post("/login", login);
router.post("/logout", authenticateUser,logout);
router.post("/verifyEmail", verifyEmail);
router.patch("/resetPassword", resetPassword);
router.post("/forgotPassword", forgotPassword);
router.post("/uploadImage", authenticateUser,uploadImages);
router.patch("/updateUser",authenticateUser, updateUser);
router.post("/registerPartner", authenticateUser,registerPartner);
module.exports = router;
