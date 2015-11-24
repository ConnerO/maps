var express = require('express');
var router = express.Router();

var Dwi = require('../models/dwi');
var User = require('../models/user');
var rest = require('../node_modules/restler');
var Promise = require('promise');

addresses = [];
// coordResults = [];


// Get's the DWI information from the Austin API
router.get('/', function (req, res) {
// Once we get the information from the API, the addCoords function should run
	rest.get("https://data.austintexas.gov/resource/b4y9-5x39.json?$where=starts_with(crime_type, 'DWI')&$limit=10").on('complete', addCoords);
	Dwi.find({}, function(err, dwidata){
  	// console.log('anything',err,dwidata);
      res.render('index', {
        title: '@ustin m@ps',
        crime: dwidata
      });
  });

});



function getCoords(obj) {
	var address = obj.address
	return new Promise(function(resolve, reject) {
		rest.get("http://maps.googleapis.com/maps/api/geocode/json?address="+address+"&sensor=false").on('complete', function(geocodedData) {
				if (!geocodedData.results || !geocodedData.results.length) reject("No results available; check if you're over query limit");
				
				resolve(formatCoords(obj.index, geocodedData.results[0].geometry.location.lat, geocodedData.results[0].geometry.location.lng));
		})
	})

}

function formatCoords(idx, lat, lng) {
	return {
		index: idx,
		coords: {
			lat: lat,
			lng: lng
		}
	};
}

// This function will run after we have gained the information from the API
function addCoords(data) {
	var promises = [];
	data.forEach(function(element, index) {
		if (!element.longitude || !element.latitude) {
			var obj = {
				address: element.address + ", Austin, Texas",
				index: index
			};		
			promises.push(getCoords(obj));
		}
		else {
			promises.push(formatCoords(index, parseFloat(element.latitude), parseFloat(element.longitude)));
		}

		return element;
	});
	Promise.all(promises).then(function(data) {
		console.log("THIS IS THE INFORMATION FROM THE addCoords FUNCTION", data);
	});
}





router.post('/', function (req, res) {



});


module.exports = router;
