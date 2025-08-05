const Parking = require("../model/parking.model");
const ParkingSlot = require("../model/parkingSlots");
const Vehicle=require("../model/vehicle.model")
const customErrors = require("../errors/index");
const User = require("../model/user.model");
const { StatusCodes } = require("http-status-codes");
const mongoose = require('mongoose');

// Create a new parking location
const createParking = async (req, res) => {
  const { organization, buildingName, address, latitude, longitude } = req.body;
  const ownerId = req.user.userId;

  if (
    !organization ||
    !buildingName ||
    !address ||
    typeof latitude !== "number" ||
    typeof longitude !== "number"
  ) {
    throw new customErrors.BadRequestError("All fields are required");
  }

  const newParking = await Parking.create({
    organization,
    buildingName,
    ownerId,
    address,
    coordinates: {
      latitude,
      longitude,
    },
    parkingInfo: {
      floors: [],
    },
  });

  res.status(StatusCodes.CREATED).json({
    message: "Parking location created successfully",
    data: newParking,
  });
};

// const createParking = async (req, res) => {
//   const userId = req.user.userId;

//   const data = Array.isArray(req.body) ? req.body : [req.body];

//   const parkingsToCreate = [];

//   for (const parking of data) {
//     const { organization, address, latitude, longitude,buildingName } = parking;

//     if (
//       !organization ||
//       !address ||
//       typeof latitude !== "number" ||
//       typeof longitude !== "number" || !buildingName
//     ) {
//       throw new customErrors.BadRequestError(
//         "All fields are required for each parking object"
//       );
//     }

//     parkingsToCreate.push({
//       organization,
//       buildingName,
//       ownerId:userId,
//       address,
//       coordinates: { latitude, longitude },
//       parkingInfo: { floors: [] },
//     });
//   }

//   const created = await Parking.insertMany(parkingsToCreate);

//   res.status(StatusCodes.CREATED).json({
//     message: `${created.length} parking location(s) created successfully`,
//     data: created,
//   });
// };

const updateParking = async (req, res) => {
  const locationId = req.query.locationId;
  const { organization, buildingName, address, latitude, longitude } = req.body;

  if (!locationId) {
    throw new customErrors.BadRequestError("Location ID is required");
  }

  const parkingLocation = await Parking.findById(locationId);
  if (!parkingLocation) {
    throw new customErrors.NotFoundError("Parking location not found");
  }

  // Update fields if they are provided
  if (organization) parkingLocation.organization = organization;
  if (buildingName) parkingLocation.buildingName = buildingName;
  if (address) parkingLocation.address = address;
  if (typeof latitude === "number")
    parkingLocation.coordinates.latitude = latitude;
  if (typeof longitude === "number")
    parkingLocation.coordinates.longitude = longitude;

  await parkingLocation.save();

  res.status(StatusCodes.OK).json({
    message: "Parking location updated successfully",
    data: parkingLocation,
  });
};

// Add a floor to an existing parking location
const addFloor = async (req, res) => {
  const locationId = req.query.locationId;
  const { name, twoWheeler, fourWheeler } = req.body;

  if (!name || !twoWheeler || !fourWheeler) {
    throw new customErrors.BadRequestError("Incomplete floor information");
  }

  const parkingLocation = await Parking.findById(locationId);
  if (!parkingLocation) {
    throw new customErrors.notFoundError("Parking location not found");
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

const deleteFloor = async (req, res) => {
  const locationId = req.query.locationId;
  const name = req.query.name;

  if (!name) {
    throw new customErrors.BadRequestError("Floor name is required to delete");
  }

  const parkingLocation = await Parking.findById(locationId);
  if (!parkingLocation) {
    throw new customErrors.NotFoundError("Parking location not found");
  }

  const floors = parkingLocation.parkingInfo.floors;
  const floorIndex = floors.findIndex(
    (floor) => floor.name.toLowerCase() === name.toLowerCase()
  );

  if (floorIndex === -1) {
    throw new customErrors.NotFoundError("Floor not found");
  }

  // Remove the floor
  floors.splice(floorIndex, 1);

  await parkingLocation.save();

  res.status(StatusCodes.OK).json({
    message: "Floor deleted successfully",
    floors: parkingLocation.parkingInfo.floors,
  });
};

const getAllParkingGoogleMap = async (req, res) => {
  try {
    const parkingData = await Parking.find({});
    const formattedData = parkingData.map((parking) => ({
      lat: parking.coordinates.latitude,
      lng: parking.coordinates.longitude,
      address: parking.address,
      locationId: parking._id,
      buildingName: parking.buildingName,
    }));
    console.log(formattedData);
    res.status(200).json({ locations: formattedData });
  } catch (err) {
    console.error("Error fetching parking data:", err);
    res.status(500).json({ error: "Failed to fetch parking locations." });
  }
};

const getMyParking = async (req, res) => {
  const userId = req.user.userId;
  const myParking = await Parking.find({ ownerId: userId });
  res.status(StatusCodes.OK).json({ myParking });
};

const getSingleParking = async (req, res) => {
  const locationId = req.query.locationId;
  console.log("locationId:", locationId);
  if (!locationId)
    throw customErrors.BadRequestError("location id is required");
  const currentParking = await Parking.findOne({ _id: locationId });
  if (!currentParking) {
    throw new customErrors.notFoundError("Parking location not found");
  }
  res.status(StatusCodes.OK).json({ currentParking });
};

const getSlotsForFloor = async (req, res) => {
  const { locationId, floor } = req.query;
  console.log("Fetching slots for floor:", { locationId, floor });

  if (!locationId || !floor) {
    throw new customErrors.BadRequestError("Location ID and floor are required");
  }

  let locationObjectId = new mongoose.Types.ObjectId(locationId);

  const slots = await ParkingSlot.find({ locationId: locationObjectId, floor: floor });

  if (!slots || slots.length === 0) {
    throw new customErrors.notFoundError("No slots found for this floor");
  }

  res.status(StatusCodes.OK).json({ slots });
};


const bookParking = async (req, res) => {
  const { floor, slot, registrationNumber, duration, paymentStatus } = req.body;
  const { locationId } = req.query;
  const userId = req.user?.userId;

  console.log(floor, slot, registrationNumber, duration, paymentStatus, locationId);

  // Validate required fields
  if (
    locationId === undefined ||
    floor === undefined ||
    slot === undefined ||
    !registrationNumber ||
    !duration ||
    !paymentStatus
  ) {
    throw new customErrors.BadRequestError("Missing booking details");
  }

  const parking = await Parking.findById(locationId);
  if (!parking) {
    throw new customErrors.NotFoundError("Parking location not found");
  }

  const floors = parking.parkingInfo?.floors;
  if (!floors || floor < 0 || floor >= floors.length) {
    throw new customErrors.NotFoundError("Invalid floor number");
  }

  const floorData = floors[floor];

  // Determine vehicle type based on slot number
  let vehicleType = null;
  if (slot <= floorData.twoWheeler.totalSlots) {
    vehicleType = "twoWheeler";
  } else if (slot <= floorData.twoWheeler.totalSlots + floorData.fourWheeler.totalSlots) {
    vehicleType = "fourWheeler";
  } else {
    throw new customErrors.BadRequestError("Invalid slot number for this floor");
  }

  const typeData = floorData[vehicleType];

  // Prevent duplicates
  if (typeData.occupiedSlotNumbers.includes(slot)) {
    throw new customErrors.BadRequestError("This slot is already occupied");
  }

  // Book the slot
  typeData.occupiedSlots += 1;
  typeData.occupiedSlotNumbers.push(slot);

  await parking.save();

  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + duration * 1000); // duration is in seconds

  res.status(StatusCodes.OK).json({
    message: `Slot ${slot} booked successfully on floor ${floor}`,
    booking: {
      userId,
      locationId,
      floor,
      floorName: floorData.name,
      slot,
      vehicleType,
      registrationNumber,
      duration,
      paymentStatus,
      startTime,
      endTime,
    },
  });
};



module.exports = {
  createParking,
  getAllParkingGoogleMap,
  addFloor,
  bookParking,
  getMyParking,
  getSingleParking,
  deleteFloor,
  updateParking,
  getSlotsForFloor,
};
