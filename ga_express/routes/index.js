var express = require('express');
var router = express.Router();

var Dwi = require('../models/dwi');
var User = require('../models/user');
var rest = require('../node_modules/restler');
var Promise = require('promise');

addresses = [];
// coordResults = [];
function getCoords(obj) {
	var address = obj.address
	var promise = new Promise(function(resolve, reject) {
		rest.get("http://maps.googleapis.com/maps/api/geocode/json?address="+address+"&sensor=false").on('complete', function(coord) {
				console.log(coord.geometry)
				/*
				var coords = {
					lat: coord.geometry.lat,
					lng: coord.geometry.lng
				}
				var withCoords = {
					index: obj.index,
					coords: coords
				}
				resolve(withCoords)*/
		})
	})

	return promise
}

function addCoords(data) {
	var promises = []
	data.forEach(function(element, index) {
		if (!element.longitude || !element.latitude) {
			var obj = {
				address: element.address + ", Austin, Texas",
				index: index
			}			
			promises.push(getCoords(obj))
		}

		return element
	})
	Promise.all(promises).then(function(data) {
		console.log(data)
	})
}

router.get('/', function (req, res) {

	rest.get("https://data.austintexas.gov/resource/b4y9-5x39.json?$where=starts_with(crime_type, 'DWI')").on('complete', addCoords);

	Dwi.find({}, function(err, dwidata){
  	// console.log('anything',err,dwidata);
      res.render('index', {
        title: '@ustin m@ps',
        crime: dwidata
      });
  });

});



router.post('/', function (req, res) {



});


module.exports = router;
