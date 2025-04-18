const Vehicle = require("../model/vehicle.model");
const customErrors = require(`../errors/index`);
const { StatusCodes } = require(`http-status-codes`);
const { createTokenUser, attachCookiesToResponse } = require(`../utils`);

const createVehicle = async (req, res) => {
  const ownerId = req.user.userId;
  const { registrationNumber, model, color } = req.body;
  const vehicle = await Vehicle.create({
    registrationNumber,
    model,
    ownerId,
    color,
    parkingSlot: "",
    isParked: false,
  });
  res.status(StatusCodes.CREATED).json(vehicle);
};

const getAllVehicle = async (req, res) => {
  const vehicle = await Vehicle.find({ ownerId: req.user.userId });
  res.status(StatusCodes.OK).json(vehicle);
};

const updateVehicle = async (req, res) => {
  const ownerId = req.user.userId;
  const { previousRegistrationNumber, registrationNumber, model, color } =
    req.body;

  const vehicle = await Vehicle.findOne({
    registrationNumber: previousRegistrationNumber,
    ownerId,
  });

  if (!vehicle) {
    throw new customErrors.notFoundError("Vehicle not found");
  }

  if (registrationNumber) vehicle.registrationNumber = registrationNumber;
  if (model) vehicle.model = model;
  if (color) vehicle.color = color;

  await vehicle.save();

  res.status(StatusCodes.OK).json(vehicle);
};

const deleteVehicle = async (req, res) => {
  const ownerId = req.user.userId;
  const { registrationNumber } = req.body;

  console.log(registrationNumber, ownerId);

  const vehicle = await Vehicle.findOneAndDelete({
    registrationNumber,
    ownerId,
  });

  if (!vehicle) {
    throw new customErrors.notFoundError("Vehicle not found");
  }

  res.status(StatusCodes.OK).json({ msg: "Vehicle deleted successfully" });
};

module.exports = { createVehicle, getAllVehicle ,updateVehicle, deleteVehicle };
