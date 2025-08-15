const Parking = require("../model/parking.model");
const ParkingSlot = require("../model/parkingSlots");
const Vehicle = require("../model/vehicle.model");
const customErrors = require("../errors/index");
const User = require("../model/user.model");
const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");

// Helper: remove expired bookings from a floor/type in-place
function pruneExpired(typeData, now = Date.now()) {
  if (!typeData || !Array.isArray(typeData.occupiedSlotNumbers)) return false;
  const before = typeData.occupiedSlotNumbers.length;
  typeData.occupiedSlotNumbers = typeData.occupiedSlotNumbers.filter(
    (s) => s && s.occupiedUntil && new Date(s.occupiedUntil).getTime() > now
  );
  return typeData.occupiedSlotNumbers.length !== before; // changed?
}

// Helper: check if a slot is currently occupied
function isSlotActive(typeData, slotNumber, now = Date.now()) {
  if (!typeData || !Array.isArray(typeData.occupiedSlotNumbers)) return false;
  return typeData.occupiedSlotNumbers.some(
    (s) =>
      s &&
      Number(s.slotNumber) === Number(slotNumber) &&
      new Date(s.occupiedUntil).getTime() > now
  );
}

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
    coordinates: { latitude, longitude },
    parkingInfo: { floors: [] },
  });

  res.status(StatusCodes.CREATED).json({
    message: "Parking location created successfully",
    data: newParking,
  });
};

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

  if (organization) parkingLocation.organization = organization;
  if (buildingName) parkingLocation.buildingName = buildingName;
  if (address) parkingLocation.address = address;
  if (typeof latitude === "number") parkingLocation.coordinates.latitude = latitude;
  if (typeof longitude === "number") parkingLocation.coordinates.longitude = longitude;

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

  if (!locationId) {
    throw new customErrors.BadRequestError("Location ID is required");
  }
  if (!name || !twoWheeler || !fourWheeler) {
    throw new customErrors.BadRequestError("Incomplete floor information");
  }

  const parkingLocation = await Parking.findById(locationId);
  if (!parkingLocation) {
    throw new customErrors.NotFoundError("Parking location not found");
  }

  const floorExists = parkingLocation.parkingInfo.floors.some(
    (floor) => floor.name.toLowerCase() === String(name).toLowerCase()
  );
  if (floorExists) {
    throw new customErrors.BadRequestError("Floor with this name already exists");
  }

  // Normalize structures: no occupiedSlots; ensure occupiedSlotNumbers array exists
  const normalizeType = (t) => ({
    totalSlots: Number(t.totalSlots),
    ratePerHour: Number(t.ratePerHour),
    occupiedSlotNumbers: [],
  });

  parkingLocation.parkingInfo.floors.push({
    name,
    twoWheeler: normalizeType(twoWheeler),
    fourWheeler: normalizeType(fourWheeler),
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

  if (!locationId) {
    throw new customErrors.BadRequestError("Location ID is required");
  }
  if (!name) {
    throw new customErrors.BadRequestError("Floor name is required to delete");
  }

  const parkingLocation = await Parking.findById(locationId);
  if (!parkingLocation) {
    throw new customErrors.NotFoundError("Parking location not found");
  }

  const floors = parkingLocation.parkingInfo.floors;
  const floorIndex = floors.findIndex(
    (floor) => floor.name.toLowerCase() === String(name).toLowerCase()
  );

  if (floorIndex === -1) {
    throw new customErrors.NotFoundError("Floor not found");
  }

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
  if (!locationId) {
    throw new customErrors.BadRequestError("location id is required");
  }

  const currentParking = await Parking.findById(locationId);
  if (!currentParking) {
    throw new customErrors.NotFoundError("Parking location not found");
  }

  // Prune expired bookings before returning (and persist cleanup)
  const now = Date.now();
  let changed = false;
  for (const floor of currentParking.parkingInfo.floors) {
    if (floor.twoWheeler) changed = pruneExpired(floor.twoWheeler, now) || changed;
    if (floor.fourWheeler) changed = pruneExpired(floor.fourWheeler, now) || changed;
  }
  if (changed) await currentParking.save();

  res.status(StatusCodes.OK).json({ currentParking });
};

const getSlotsForFloor = async (req, res) => {
  const { locationId, floor } = req.query;

  if (!locationId || floor === undefined) {
    throw new customErrors.BadRequestError("Location ID and floor are required");
  }

  const locationObjectId = new mongoose.Types.ObjectId(locationId);
  const slots = await ParkingSlot.find({ locationId: locationObjectId, floor: floor });

  if (!slots || slots.length === 0) {
    throw new customErrors.NotFoundError("No slots found for this floor");
  }

  res.status(StatusCodes.OK).json({ slots });
};

const bookParking = async (req, res) => {
  // Expect floor (0-based), slot (1-based across the floor), duration (seconds)
  const { floor, slot, registrationNumber, duration, paymentStatus } = req.body;
  const { locationId } = req.query;
  const userId = req.user?.userId;

  const floorNum = Number(floor);
  const slotNum = Number(slot);
  const durationSec = Number(duration);

  if (
    !locationId ||
    Number.isNaN(floorNum) ||
    Number.isNaN(slotNum) ||
    !registrationNumber ||
    Number.isNaN(durationSec) ||
    !paymentStatus
  ) {
    throw new customErrors.BadRequestError("Missing booking details");
  }

  const parking = await Parking.findById(locationId);
  if (!parking) {
    throw new customErrors.notFoundError("Parking location not found");
  }

  const floors = parking.parkingInfo?.floors;
  if (!floors || floorNum < 0 || floorNum >= floors.length) {
    throw new customErrors.notFoundError("Invalid floor number");
  }

  const floorData = floors[floorNum];

  // Determine vehicle type based on slot number range (1..N)
  const twTotal = floorData.twoWheeler.totalSlots;
  const fwTotal = floorData.fourWheeler.totalSlots;

  let vehicleType = null;
  if (slotNum >= 1 && slotNum <= twTotal) {
    vehicleType = "twoWheeler";
  } else if (slotNum > twTotal && slotNum <= twTotal + fwTotal) {
    vehicleType = "fourWheeler";
  } else {
    throw new customErrors.BadRequestError("Invalid slot number for this floor");
  }

  const typeData = floorData[vehicleType];

  // Clean expired first, then check occupancy
  const now = Date.now();
  pruneExpired(typeData, now);

  if (isSlotActive(typeData, slotNum, now)) {
    const active = typeData.occupiedSlotNumbers.find(
      (s) => Number(s.slotNumber) === slotNum
    );
    const until = active?.occupiedUntil
      ? new Date(active.occupiedUntil).toLocaleString()
      : "later";
    throw new customErrors.BadRequestError(
      `This slot is already occupied until ${until}`
    );
  }

  // Book: push a new entry with expiry
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + durationSec * 1000);

  typeData.occupiedSlotNumbers.push({
    slotNumber: slotNum,
    occupiedUntil: endTime,
    // easy to extend later: userId, registrationNumber, paymentId, etc.
  });

  await parking.save();

  res.status(StatusCodes.OK).json({
    message: `Slot ${slotNum} booked successfully on floor ${floorNum}`,
    booking: {
      userId,
      locationId,
      floor: floorNum,
      floorName: floorData.name,
      slot: slotNum,
      vehicleType,
      registrationNumber,
      duration: durationSec,
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
