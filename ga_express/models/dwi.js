var mongoose = require('mongoose');

var dwiSchema = new mongoose.Schema({
  name: { type: String }
}, { collection: 'dwi' });

// Make this available to our other files
module.exports = mongoose.model('dwi', dwiSchema);