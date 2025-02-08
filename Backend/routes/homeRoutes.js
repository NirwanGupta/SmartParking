const express = require("express");
const router = express.Router();
const { getPosters } = require("../controllers/homePage.controller");

router.get("/getPosters", getPosters);

module.exports=router