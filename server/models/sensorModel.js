import mongoose from "mongoose";

const sensorSchema = new mongoose.Schema({
    type: { type: String, required: true },
    model: { type: String, required: true },
    location: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Sensor = mongoose.model("Sensor", sensorSchema);

export default Sensor;