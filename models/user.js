const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
    title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default:"Published",
    required: true
  },
  image: {
    type: String,
    required: true
  }
});

// Export the User model
module.exports = mongoose.model('Blogs', userSchema);
