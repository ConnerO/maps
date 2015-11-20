var mongoose = require('mongoose');

var dwiSchema = new mongoose.Schema({
	crime_type: { type: String },
	time: { type: String },
	address: { type: String },
	date: { type: Number },
	incident_report_number: { type: String}
}, { collection: 'dwi' });

// Make this available to our other files
module.exports = mongoose.model('dwi', dwiSchema);