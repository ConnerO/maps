var mongoose = require('mongoose');

var dwiSchema = new mongoose.Schema({
  name: { type: String }
});

var Dwi = mongoose.model('Dwi', dwiSchema);

// Make this available to our other files
module.exports = Dwi;