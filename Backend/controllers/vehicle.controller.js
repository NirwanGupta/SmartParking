const Vehicle = require("../model/vehicle.model");
const customErrors = require(`../errors/index`);
const { StatusCodes } = require(`http-status-codes`);
const { createTokenUser, attachCookiesToResponse } = require(`../utils`);

const createVehicle = async (req, res) => {
  const owner = req.user.userId;
  const { registrationNumber, model, color } = req.body;
  const vehicle = await Vehicle.create({
    registrationNumber,
    model,
    owner,
    color,
    parkingSlot: "",
    isParked: false,
  });
  res.status(StatusCodes.CREATED).json(vehicle);
};

const getAllVehicle = async (req, res) => {
  const vehicle = await Vehicle.find({ owner: req.user.userId });
  res.status(StatusCodes.OK).json(vehicle);
};

module.exports = { createVehicle, getAllVehicle };
