const Parking = require("../model/parking.model");
const customErrors = require("../errors/index");
const { StatusCodes } = require("http-status-codes");

// Create a new parking location
const createParking = async (req, res) => {
  const { address, latitude, longitude } = req.body;
  const ownerId = req.user.userId;

  if (
    !address ||
    typeof latitude !== "number" ||
    typeof longitude !== "number"
  ) {
    throw new customErrors.BadRequestError("All fields are required");
  }

  const newParking = await Parking.create({
    ownerId,
    address,
    coordinates: {
      latitude,
      longitude,
    },
    parkingInfo: {
      floors: [], // Initially empty
    },
  });

  res.status(StatusCodes.CREATED).json({
    message: "Parking location created successfully",
    data: newParking,
  });
};

// Add a floor to an existing parking location
const addFloor = async (req, res) => {
  const { locationId } = req.params;
  const { name, twoWheeler, fourWheeler } = req.body;

  if (!name || !twoWheeler || !fourWheeler) {
    throw new customErrors.BadRequestError("Incomplete floor information");
  }

  const parkingLocation = await Parking.findById(locationId);
  if (!parkingLocation) {
    throw new customErrors.NotFoundError("Parking location not found");
  }

  // Check for duplicate floor name
  const floorExists = parkingLocation.parkingInfo.floors.some(
    (floor) => floor.name.toLowerCase() === name.toLowerCase()
  );
  if (floorExists) {
    throw new customErrors.BadRequestError(
      "Floor with this name already exists"
    );
  }

  // Add the new floor
  parkingLocation.parkingInfo.floors.push({
    name,
    twoWheeler,
    fourWheeler,
  });

  await parkingLocation.save();

  res.status(StatusCodes.OK).json({
    message: "Floor added successfully",
    floors: parkingLocation.parkingInfo.floors,
  });
};


const getAllParking = async (req, res) => {
  const parkingData = await Parking.find(
    {}
  );

  const formattedData = parkingData.map((parking) => ({
    lat: parking.coordinates.latitude,
    lng: parking.coordinates.longitude,
    address: parking.address,
    locationId:parking.locationId,
  }));

  res.status(200).json({
    locations: formattedData,
  });
};

module.exports = { createParking, getAllParking ,addFloor};
