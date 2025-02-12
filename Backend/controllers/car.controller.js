const User = require(`../model/user.model`);
const Car = require("../model/cars.model");
const customErrors = require(`../errors/index`);
const { StatusCodes } = require(`http-status-codes`);
const { createTokenUser, attachCookiesToResponse } = require(`../utils`);

const createCar = async (req, res) => {
  const id = req.user.userID;
};
