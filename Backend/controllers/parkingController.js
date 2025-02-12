const Parking = require("../model/parking.model");

const createLocation = async (req, res) => {
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
          totalSlots: twoWheeler.totalSlots,
          occupiedSlots: twoWheeler.occupiedSlots || 0,
          ratePerHour: twoWheeler.ratePerHour,
        },
        fourWheeler: {
          totalSlots: fourWheeler.totalSlots,
          occupiedSlots: fourWheeler.occupiedSlots || 0,
          ratePerHour: fourWheeler.ratePerHour,
        },
      },
    });

    await newLocation.save();
    res
      .status(201)
      .json({
        message: "Parking location created successfully",
        data: newLocation,
      });
    res
      .status(500)
      .json({
        message: "Error creating parking location",
        error: error.message,
      });
};

module.exports = { createLocation };
