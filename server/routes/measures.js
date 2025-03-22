import express from 'express';
import Measure from '../models/measureModel.js';

const router = express.Router();

// GET all measures
router.get('/', async (req, res) => {
  try {
    const measures = await Measure.find();
    console.log('Measures found:', measures.length);
    console.log('Measure collection name:', Measure.collection.name);
    res.json(measures);
  } catch (error) {
    console.error('Error fetching measures:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET measures with filter options 
router.get('/filter', async (req, res) => {
  try {
    const { type, startDate, endDate, sensorID, minValue, maxValue } = req.query;
    
    // Build query object
    const query = {};
    
    if (type) query.type = type;
    if (sensorID) query.sensorID = sensorID;
    
    // Handle date range
    if (startDate || endDate) {
      query.creationDate = {};
      if (startDate) query.creationDate.$gte = new Date(startDate);
      if (endDate) query.creationDate.$lte = new Date(endDate);
    }
    
    // Handle value range
    if (minValue || maxValue) {
      query.value = {};
      if (minValue) query.value.$gte = Number(minValue);
      if (maxValue) query.value.$lte = Number(maxValue);
    }
    
    const measures = await Measure.find(query);
    res.json(measures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET measure by ID
router.get('/:id', async (req, res) => {
  try {
    const measure = await Measure.findById(req.params.id);
    if (!measure) {
      return res.status(404).json({ error: 'Measure not found' });
    }
    res.json(measure);
  } catch (error) {
    res.status(404).json({ error: 'Measure not found' });
  }
});

// POST new measure
router.post('/', async (req, res) => {
  try {
    const newMeasure = await Measure.create(req.body);
    res.status(201).json(newMeasure);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT update measure
router.put('/:id', async (req, res) => {
  try {
    const updatedMeasure = await Measure.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedMeasure) {
      return res.status(404).json({ error: 'Measure not found' });
    }
    res.json(updatedMeasure);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE measure
router.delete('/:id', async (req, res) => {
  try {
    const deletedMeasure = await Measure.findByIdAndDelete(req.params.id);
    if (!deletedMeasure) {
      return res.status(404).json({ error: 'Measure not found' });
    }
    res.json(deletedMeasure);
  } catch (error) {
    res.status(404).json({ error: 'Measure not found' });
  }
});

export default router;