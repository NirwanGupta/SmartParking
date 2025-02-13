const Parking = require("../model/parking.model");
const createParking = async (req, res) => {
  const { address, latitude, longitude, twoWheeler, fourWheeler } = req.body;
  const ownerId = req.user.userId;
  const newLocation = new Parking({
    ownerId,
    address,
    coordinates: {
      latitude,
      longitude,
    },
    parkingInfo: {
      twoWheeler: {
        totalSlots: twoWheeler.totalSlots || 0,
        occupiedSlots: twoWheeler.occupiedSlots || 0,
        ratePerHour: twoWheeler.ratePerHour || 0,
      },
      fourWheeler: {
        totalSlots: fourWheeler.totalSlots || 0,
        occupiedSlots: fourWheeler.occupiedSlots || 0,
        ratePerHour: fourWheeler.ratePerHour || 0,
      },
    },
  });

  await Parking.create(newLocation);
  res.status(201).json({
    message: "Parking location created successfully",
    data: newLocation,
  });
};

const getAllParking = async (req, res) => {
  const parkingData = await Parking.find(
    {},
    {
      "coordinates.latitude": 1,
      "coordinates.longitude": 1,
      address: 1,
      _id: 0,
    }
  );

  const formattedData = parkingData.map((parking) => ({
    lat: parking.coordinates.latitude,
    lng: parking.coordinates.longitude,
    address: parking.address,
  }));

  res.status(200).json({
    locations: formattedData,
  });
};

module.exports = { createParking, getAllParking };
