// routes/cars.js
const express = require('express');
const router = express.Router();
const Car = require('../model/Car');

// GET all cars
router.get('/', async (req, res) => {
    try {
      const {
        make,
        year,
        minPrice,
        maxPrice,
        sort,
        page,
        limit,
      } = req.query;
  
      // Create a filter object based on query parameters
      const filter = {};
      if (make) filter.make = make;
      if (year) filter.year = year;
      if (minPrice && maxPrice) {
        filter.price = {
          $gte: parseFloat(minPrice),
          $lte: parseFloat(maxPrice),
        };
      }
  
      // Create a sort object based on query parameter "sort"
      const sortOptions = {};
      if (sort === 'asc') {
        sortOptions.price = 1;
      } else if (sort === 'desc') {
        sortOptions.price = -1;
      }
  
      // Calculate skip value for pagination
      const skip = (page - 1) * limit;
  
      // Query the database with filters, sorting, and pagination
      const cars = await Car.find(filter)
        .sort(sortOptions)
        .limit(parseInt(limit))
        .skip(skip);
  
      // Count total cars without pagination
      const totalCars = await Car.countDocuments(filter);
  
      res.json({
        cars,
        totalCars,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCars / limit),
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });

// GET car by ID
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST a new car
router.post('/', async (req, res) => {
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// PUT (update) car by ID
router.put('/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json(car);
  } catch (error) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// DELETE car by ID
router.delete('/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
