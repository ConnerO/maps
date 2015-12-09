var express = require('express');
var router = express.Router();

var Crime = require('../models/crime');
var User = require('../models/user');
var rest = require('../node_modules/restler');
var Promise = require('promise');
var moment = require('moment');


addresses = [];

router.get('/', function (req, res) {
	rest.get("https://data.austintexas.gov/resource/b4y9-5x39.json?$where=starts_with(crime_type, 'DWI')&$limit=60").on('complete', addCoords);
	
	Crime.find({}, function(err, dwidata){
    res.render('index', {
      title: '@ustin m@ps',
      crime: dwidata
    });
  });

});

router.get('/test', function(req, res) {   

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
	// console.log("ORIGINAL DATA COMING IN: ", data.length);
	var promises = [];
	var queue = [];
	var tempArray = [];

	var count = 0;
	// looping through data we get from Austin API
	data.forEach(function(element, index) {
		if (!element.longitude || !element.latitude) {
			count++;

			// var tempArray = tempArray || [];
			tempArray = tempArray || [];

			// creating template object for lats and lngs and others
			var obj = {
				crime_type: element.crime_type,
				time: element.time,
				address: element.address + ", Austin, Texas",
				lat: element.latitude,
				lng: element.longitude,
				date: element.date,
				incident_report_number: element.incident_report_number
			};
			// passing objs to tempArray
			tempArray.push(obj);
			// conditional, if theres 5 things in tempArray,
			if (tempArray.length === 5) {
				// push tempArray into queue
				queue.push(tempArray);
				// set tempArray to null
				tempArray = null;
			}
		}
		else {
			promises.push(formatCoords(element.crime_type, element.time, element.address+", Austin, Texas", parseFloat(element.latitude), parseFloat(element.longitude), element.date, element.incident_report_number));
		}

		return element;
	});

	processQueue(queue, promises, function (promises) {
		Promise.all(promises).then(function (data) {
			console.log(data);
		});
	});
}

function processQueue(queue, promises, cb) {
	// check if queue array is empty, if it is then we're done, return the promises array 
	if (queue.length <= 0) {
		cb(promises);
		return true;
	}

	// setTimeout for 1 second function around everything
	setTimeout(function() {
		// pop off first element(array) of queue array
		var popOff = queue.shift();
		// loop through the array of 5 objects
		for (var x = 0; x < popOff.length; x++) {
			// send those 5 objects to getCoords
			promises.push(getCoords(popOff[x]));	
		}
		// recall processQueue(queue) to restart timer
		processQueue(queue, promises, cb);
	}, 1000);
}

function getCoords(obj) {
	var address = obj.address
	return new Promise(function(resolve, reject) {
		rest.get("http://maps.googleapis.com/maps/api/geocode/json?address="+address+"&sensor=false").on('complete', function(geocodedData) {
			if (!geocodedData.results || !geocodedData.results.length) {
				reject("No results available; check if you're over query limit!!!");
			}
			else {
				resolve(formatCoords(obj.crime_type, obj.time, address, geocodedData.results[0].geometry.location.lat, geocodedData.results[0].geometry.location.lng, obj.date, obj.incident_report_number));
			}
		});
	});
}

function formatCoords(crm, tme, add, lat, lng, dte, inc) {
	var res = {
		crime_type: crm,
		time: tme,
		address: add,
		lat: lat,
		lng: lng,
		date: dte,
		incident_report_number: inc
	};
	return res;
}

module.exports = router;