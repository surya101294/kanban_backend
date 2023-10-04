// models/Car.js
const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  
  year: { type: Number, required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  kms: { type: Number, required: true },
  transmission: { type: String, required: true },
  exteriorcolor: { type: String, required: true },
  fuel: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  image2: { type: String, required: true },
  image3: { type: String, required: true },
  image4: { type: String, required: true },
  image5: { type: String, required: false },
  image6: { type: String, required: false },
  booked: { type: String, required: false }
}, {
  versionKey: false,
});

module.exports = mongoose.model('Car', carSchema);

