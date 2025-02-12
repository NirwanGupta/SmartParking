const axios = require(`axios`);

const distGoogleMap = async (req, res) => {
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    const { origin, destination } = req.body;
    console.log(origin, destination);
    if(!origin || !destination) {
        return res.status(400).json({ error: "Please provide origin and destination" });
    }
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${API_KEY}`;
    try {
        const response = await axios.get(url);
        console.log(response.data);
        res.status(200).json(response.data);
    } 
    catch (error) {
        console.error("Error getting distance:", error);
        res.status(500).json({ error: "Could not get distance" });
    }
};

module.exports = {
    distGoogleMap,
};