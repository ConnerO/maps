var mongoose = require('mongoose');

var crimeSchema = new mongoose.Schema({
	crime_type: { type: String, index: true, required: true },
	time: { type: String, required: true  },
	address: { type: String, required: true  },
	lat: { type: Number, required: true },
	lng: { type: Number, required: true },
	date: { type: String, index: true, required: true  },
	incident_report_number: { type: String, index: true, required: true }
});

// Make this available to our other files
module.exports = mongoose.model('crime', crimeSchema);