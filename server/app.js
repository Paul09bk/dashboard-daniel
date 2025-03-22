import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors"; // Ajout de l'import CORS

// Importation des routes
import userRoutes from "./routes/users.js";
import sensorRoutes from "./routes/sensors.js";
import measureRoutes from "./routes/measures.js";
//import Dashboard from "../web/src/components/Dashboard/Dashboard.jsx";


dotenv.config();


const app = express();
const port = 31356;

const db_uri = process.env.DB_URI;
const db_name = process.env.DB_NAME;

mongoose.connect(db_uri, { dbName: db_name })
  .then(() => console.log(db_name, 'Connected'))
  .catch(err => console.log('DB Connection Error:', err));

// Middlewares
app.use(cors()); // Ajout du middleware CORS
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