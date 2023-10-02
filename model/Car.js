// models/Car.js
const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  kms: { type: String, required: true },
  transmission: { type: String, required: true },
  exteriorcolor: { type: String, required: true },
  fuel: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
}, {
  versionKey: false,
});

module.exports = mongoose.model('Car', carSchema);
