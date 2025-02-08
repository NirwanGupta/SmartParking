const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2;

const getPosters = async (req, res) => {
  const result = await cloudinary.search
    .expression("folder:smartParkingPosters")
    .max_results(10)
    .execute();
  const imageUrls = result.resources.map((file) => file.secure_url);

  return res.status(StatusCodes.OK).json({ posters: imageUrls });
};

module.exports = { getPosters };
