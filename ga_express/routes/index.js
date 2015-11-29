var express = require('express');
var router = express.Router();

var Crime = require('../models/crime');
var User = require('../models/user');
var rest = require('../node_modules/restler');
var Promise = require('promise');
var moment = require('moment');


addresses = [];

router.get('/', function (req, res) {
	rest.get("https://data.austintexas.gov/resource/b4y9-5x39.json?$where=starts_with(crime_type, 'DWI')&$limit=10").on('complete', addCoords);
	
	Crime.find({}, function(err, dwidata){
  	console.log('ORINIGAL DB DATA GETTING PULLED IN',err,dwidata);

  		// for (var x=0; x < dwidata.length; x++) {
	      res.render('index', {
	        title: '@ustin m@ps',
	        crime: dwidata
	      });
		  // }
  });

});

router.get('/test', function(req, res) {   
	
	// console.log("HERE GOES ELEMENT: ", element);

	finalArray.forEach(function(element) {
			if (element) {
				console.log("THIS IS WHAT SHOULD BE GOING TO MONGO", element);
				var finalDwis = Crime({
					crime_type: element.crime_type,
					time: element.time,
					address: element.address,
					lat: element.lat,
					lng: element.lng,
					date: element.date,
					incident_report_number: element.incident_report_number
				});
			}

	    finalDwis.save(function(err) {
	        if (err) console.log(err);

	        res.send('User created!');
	    });
	});
});


function addCoords(data) {
	promises = [];
	finalArray = [];
	
	// console.log("STEP 1: GET THE API INFO AND SEND TO FUNCTION addCoords(data) TO BE SORTED: ",data);
	data.forEach(function(element, index) {
		if (!element.longitude || !element.latitude) {
			var obj = {
				crime_type: element.crime_type,
				time: element.time,
				address: element.address + ", Austin, Texas",
				lat: element.latitude,
				lng: element.longitude,
				date: element.date,
				incident_report_number: element.incident_report_number
			};
			// console.log("STEP 2: INSIDE FUNCTION addCoords(data) SEPARATE THE ELEMENTS THAT DON'T HAVE LATS AND LNGS THEN SEND THOSE TO getCoords(obj): ",obj);		
			promises.push(getCoords(obj));
		}
		else {
			promises.push(formatCoords(element.crime_type, element.time, element.address+", Austin, Texas", parseFloat(element.latitude), parseFloat(element.longitude), element.date, element.incident_report_number));
		}

		return element;
	});
	Promise.all(promises).then(function(data) {
		finalArray = data;
		console.log(data);
	});
}

function getCoords(obj) {
	var address = obj.address
	return new Promise(function(resolve, reject) {
		// for (var x=0; resolve.length; x++) {

		// 	setInterval(function(x){
				rest.get("http://maps.googleapis.com/maps/api/geocode/json?address="+address+"&sensor=false").on('complete', function(geocodedData) {
						if (!geocodedData.results || !geocodedData.results.length) reject("No results available; check if you're over query limit!!!");
						
						resolve(formatCoords(obj.crime_type, obj.time, address, geocodedData.results[0].geometry.location.lat, geocodedData.results[0].geometry.location.lng, obj.date, obj.incident_report_number));

						// console.log("STEP 3.5, INSIDE getCoords(obj) THESE THINGS ARE ABOUT TO BE SENT TO THE function formatCoords(obj, lat, lng): ",obj.index, obj.crime_type, obj.time, address, geocodedData.results[0].geometry.location.lat, geocodedData.results[0].geometry.location.lng);

				}) // end of rest.get

		// 	},1000);	

		// } //end of for loop

		// console.log("STEP 3, INSIDE getCoords(obj) THESE OBJECTS DONT HAVE LATS AND LNGS: ", obj);
	})

}

function formatCoords(crm, tme, add, lat, lng, dte, inc) {
	// console.log("STEP 4: THESE ADDRESSES SHOULD HAVE LATS AND LNGS: ",promises);
	return {
		crime_type: crm,
		time: tme,
		address: add,
		lat: lat,
		lng: lng,
		date: dte,
		incident_report_number: inc
	};
}

module.exports = router;