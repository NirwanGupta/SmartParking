require(`dotenv`).config();
require(`express-async-errors`);
const cors = require(`cors`);
const express = require(`express`);
const app = express();
const connectDB = require(`./db/connect`);

const fileUpload = require(`express-fileupload`);

const cloudinary = require(`cloudinary`).v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

const authRoutes = require(`./routes/authRoutes`);
const parkingRoutes = require(`./routes/parkingRoute`);
const homeRoutes = require('./routes/homeRoutes');
const distanceRoutes = require(`./routes/distance.googleMap.route`);
const vehicleRoutes = require(`./routes/vehicleRoute`);


const errorHandlerMiddleware = require(`./middleware/error-handler`);
const notFoundMiddleware = require(`./middleware/not-found`);

const cookieParser = require(`cookie-parser`);
const morgan = require(`morgan`);

app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(morgan(`tiny`));

app.use(`/api/v1/auth`, authRoutes);
app.use('/api/v1/home', homeRoutes);
app.use('/api/v1/Parking', parkingRoutes);
app.use('/api/v1/distance', distanceRoutes);
app.use('/api/v1/vehicle', vehicleRoutes);

const port = process.env.PORT || 5000;

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("🚀 Connection established ✅");
    app.listen(port, console.log(`🚀 Server listening on port ${port} ✅`));
  } catch (error) {
    console.log(error);
  }
};


start();
