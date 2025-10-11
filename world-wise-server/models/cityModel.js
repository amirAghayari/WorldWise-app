const mongoose = require('mongoose');
const citySchema = new mongoose.Schema({
  name: { type: String, required: [true, 'A city must have a name'] },
  country: {
    type: String,
    required: [true, 'A city must belong to a country'],
  },
  emoji: {
    type: String,
    default: '🏙️',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  notes: String,
  position: {
    lat: Number,
    lng: Number,
  },
});

const City = mongoose.model('City', citySchema);
module.exports = City;
