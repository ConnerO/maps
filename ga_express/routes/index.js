var express = require('express');
var router = express.Router();

var Crime = require('../models/crime');
var User = require('../models/user');
var rest = require('../node_modules/restler');
var Promise = require('promise');
var moment = require('moment');
// var test = "";
addresses = [];
// coordResults = [];


// Get's the DWI information from the Austin API
router.get('/', function (req, res) {
// Once we get the information from the API, the addCoords function should run
	rest.get("https://data.austintexas.gov/resource/b4y9-5x39.json?$where=starts_with(crime_type, 'DWI')&$limit=10").on('complete', addCoords);
	
	Crime.find({}, function(err, dwidata){
  	// console.log('anything',err,dwidata);
      res.render('index', {
        title: '@ustin m@ps',
        crime: dwidata
      });
  });

});

// This function will run after we have gained the information from the API
function addCoords(data) {
	var promises = [];
	console.log("STEP 1: GET THE API INFO AND SEND TO FUNCTION addCoords(data): ",data);
	data.forEach(function(element, index) {
		if (!element.longitude || !element.latitude) {
			var obj = {
				crime_type: element.crime_type,
				time: element.time,
				address: element.address + ", Austin, Texas",
				lat: element.latitude,
				lng: element.longitude,
				date: element.date,
				incident_report_number: element.incident_report_number,
				index: index
			};
			console.log("STEP 2: INSIDE FUNCTION addCoords(data) SEPARATE THE ELEMENTS THAT DON'T HAVE LATS AND LNGS THEN SEND THOSE TO getCoords(obj): ",obj);		
			promises.push(getCoords(obj));
		}
		else {
			promises.push(formatCoords(index, parseFloat(element.latitude), parseFloat(element.longitude)));
		}

		return element;
	});
	Promise.all(promises).then(function(data) {
		// console.log("THIS IS THE INFORMATION FROM THE addCoords FUNCTION", data.obj);
	});
}

function getCoords(obj) {
	var address = obj.address
	return new Promise(function(resolve, reject) {
		rest.get("http://maps.googleapis.com/maps/api/geocode/json?address="+address+"&sensor=false").on('complete', function(geocodedData) {
				if (!geocodedData.results || !geocodedData.results.length) reject("No results available; check if you're over query limit");
				
				resolve(formatCoords(obj.index, obj.crime_type, obj.time, address, geocodedData.results[0].geometry.location.lat, geocodedData.results[0].geometry.location.lng, obj.date, obj.incident_report_number));
				console.log("STEP 3.5, INSIDE getCoords(obj) THESE THINGS ARE ABOUT TO BE SENT TO THE function formatCoords(obj, lat, lng): ",obj.index, obj.crime_type, obj.time, address, geocodedData.results[0].geometry.location.lat, geocodedData.results[0].geometry.location.lng);
		})
		console.log("STEP 3, INSIDE getCoords(obj) THESE OBJECTS DONT HAVE LATS AND LNGS: ", obj);
	})

}

function formatCoords(obj, crm, tme, add, lat, lng, dte, inc) {
	// test = formatCoords(obj, crm, tme, add, lat, lng, dte, inc);
	return {
		index: obj,
		crime_type: crm,
		time: tme,
		address: add,
		coords: {
			lat: lat,
			lng: lng
		},
		date: dte,
		incident_report_number: inc
	};
}


// console.log("STEP 4: ", test);

module.exports = router;
