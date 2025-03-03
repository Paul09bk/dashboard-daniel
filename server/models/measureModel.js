import mongoose from 'mongoose';

const measureSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['humidity', 'temperature', 'airPollution']
    },
    creationDate: {
        type: Date,
        required: true
    },
    sensorID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Sensor'
    },
    value: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Measure = mongoose.model('Measure', measureSchema); // Third parameter to match collection name

export default Measure;