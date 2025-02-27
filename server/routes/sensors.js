import express from 'express';
import Sensor from '../models/sensorModel.js';

const router = express.Router();

// GET all sensors
router.get('/', async (req, res) => {
    try {
        const sensors = await Sensor.find();
        res.json(sensors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});

// GET sensor by ID
router.get('/:id', async (req, res) => {
  try {
    const sensor = await Sensor.findById(req.params.id);
    res.json(sensor);
  } catch (error) {
    res.status(404).json({ error: 'Sensor not found' });
  }
});

// POST new sensor
router.post('/', async (req, res) => {
  try {
    const newSensor = await Sensor.create(req.body);
    res.json(newSensor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update sensor
router.put('/:id', async (req, res) => {
  try {
    const updatedSensor = await Sensor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSensor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE sensor
router.delete('/:id', async (req, res) => {
  try {
    const deletedSensor = await Sensor.findByIdAndDelete(req.params.id);
    res.json(deletedSensor);
  } catch (error) {
    res.status(404).json({ error: 'Sensor not found' });
  }
});

export default router;