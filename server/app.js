//// filepath: /C:/GitLab-repo/prj-create-tw-2024-01-fromentin-vachez/server/app.js
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";

// Importation des routes
import userRoutes from "./routes/users.js";
import sensorRoutes from "./routes/sensors.js";
import measureRoutes from "./routes/measures.js";

dotenv.config();

const app = express();
const port = 31356;

const db_uri = process.env.DB_URI;

mongoose.connect(db_uri)
  .then(() => console.log('DB Connected'))
  .catch(err => console.log('DB Connection Error:', err));

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

// Raccorder les routes
app.use('/users', userRoutes);
app.use('/sensors', sensorRoutes);
app.use('/measures', measureRoutes);

app.get('/', (req, res) => {
  res.json({ message: "Welcome to my API" }).status(200);
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});