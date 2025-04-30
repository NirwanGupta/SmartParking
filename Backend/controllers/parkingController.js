const Parking = require("../model/parking.model");
const ParkingSlot = require("../model/parkingSlots");
const Vehicle=require("../model/vehicle.model")
const customErrors = require("../errors/index");
const User = require("../model/user.model");
const { StatusCodes } = require("http-status-codes");

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
  if (!locationId)
    throw customErrors.BadRequestError("location id is required");
  const currentParking = await Parking.findOne({ _id: locationId });
  if (!currentParking) {
    throw new customErrors.notFoundError("Parking location not found");
  }
  res.status(StatusCodes.OK).json({ currentParking });
};

const bookParking = async (req, res) => {
  const { locationId, floor, vehicleType, slotId ,totaltime } = req.body;
  const userId = req.user.userId;

  if (!locationId || !floor || !vehicleType || !slotId) {
    throw new customErrors.BadRequestError("All booking details are required");
  }

  // Find the parking location
  const parking = await Parking.findById({_id:locationId});
  if (!parking) {
    throw new customErrors.NotFoundError("Parking location not found");
  }

  // Find the parking slot
  const slot = await ParkingSlot.findById({_id:slotId});
  if (!slot) {
    throw new customErrors.NotFoundError("Parking slot not found");
  }

  if (slot.isOccupied) {
    throw new customErrors.BadRequestError("Slot is already occupied");
  }

  // Validate floor and vehicle type from parking (if your Parking model supports it)
  const currentFloor = parking.parkingInfo.floors.find(
    (f) => f.name.toLowerCase() === floor.toLowerCase()
  );

  if (!currentFloor) {
    throw new customErrors.NotFoundError("Floor not found in parking location");
  }

  const vehicle = currentFloor[vehicleType];
  if (!vehicle) {
    throw new customErrors.BadRequestError(
      "Invalid vehicle type for this floor"
    );
  }

  if (vehicle.occupiedSlots >= vehicle.totalSlots) {
    throw new customErrors.BadRequestError(
      "No available slots for this vehicle type"
    );
  }

  slot.isOccupied=false;
  slot.isOccupied = true;
  slot.parkingInfo.push({
    userId: userId,
    vehicleId: req.body.vehicleId, // Make sure vehicleId is sent in request body!
    startTime: new Date(),
    endTime: new Date(Date.now() + totaltime* 1000), // Example: 2 hours later, adjust as needed
  });

  await slot.save();

  // Update parking location occupancy
  vehicle.occupiedSlots += 1;
  await parking.save();

  res.status(StatusCodes.OK).json({
    message: `Slot booked successfully on floor ${floor} for ${vehicleType}`,
    slotDetails: {
      slotId: slot._id,
      floor: slot.floor,
      slotNumber: slot.slot,
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
};
