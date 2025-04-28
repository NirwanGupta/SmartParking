const Parking = require("../model/parking.model");
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
  const { name } = req.body;

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
const showParkingFloor = async (req, res) => {
  const locationId = req.query.locationId;
  const { floor } = req.body;
  if (!locationId || !floor) {
    throw new customErrors.BadRequestError("locationId and floor are required");
  }
  const currentParking = await Parking.findOne({ locationId });
  if (!currentParking) {
    throw new customErrors.notFoundError("Parking location not found");
  }

  const currentFloor = currentParking.parkingInfo.floors.find(
    (f) => f.name.toLowerCase() === floor.toLowerCase()
  );

  if (!currentFloor) {
    throw new customErrors.notFoundError("Floor not found");
  }

  res.status(StatusCodes.OK).json({
    floor: currentFloor,
  });
};

const bookParking = async (req, res) => {
  const { locationId, floor, vehicleType, slotNumber } = req.body;

  if (!locationId || !floor || !vehicleType || typeof slotNumber !== "number") {
    throw new customErrors.BadRequestError("All booking details are required");
  }

  const parking = await Parking.findOne({ locationId });
  if (!parking) {
    throw new customErrors.notFoundError("Parking location not found");
  }

  const currentFloor = parking.parkingInfo.floors.find(
    (f) => f.name.toLowerCase() === floor.toLowerCase()
  );

  if (!currentFloor) {
    throw new customErrors.notFoundError("Floor not found");
  }

  const vehicle = currentFloor[vehicleType];
  if (!vehicle) {
    throw new customErrors.BadRequestError("Invalid vehicle type");
  }

  if (vehicle.occupiedSlotNumbers.includes(slotNumber)) {
    throw new customErrors.BadRequestError("Slot already occupied");
  }

  if (slotNumber < 1 || slotNumber > vehicle.totalSlots) {
    throw new customErrors.BadRequestError("Invalid slot number");
  }

  // Book the slot
  vehicle.occupiedSlotNumbers.push(slotNumber);
  vehicle.occupiedSlots += 1;

  await parking.save();

  res.status(StatusCodes.OK).json({
    message: `Slot ${slotNumber} for ${vehicleType} booked successfully on floor ${floor}`,
    updatedSlots: vehicle.occupiedSlotNumbers,
  });
};

module.exports = {
  createParking,
  getAllParkingGoogleMap,
  addFloor,
  showParkingFloor,
  bookParking,
  getMyParking,
  getSingleParking,
  deleteFloor
};
