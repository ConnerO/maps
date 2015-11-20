var express = require('express');
var router = express.Router();

var Dwi = require('../models/dwi');
var User = require('../models/user');
var rest = require('../node_modules/restler');


addresses = [];

router.get('/', function (req, res) {

	rest.get("https://data.austintexas.gov/resource/b4y9-5x39.json?$where=starts_with(crime_type, 'DWI')").on('complete', function(result) {
	  if (result instanceof Error) {
	    console.log('Error:', result.message);
	    this.retry(5000); // try again after 5 sec
	  } else {

	  	for (var x = 0; x < result.length; x++) {
      	var crime = result[x].crime_type;
        var time = result[x].time;
        var address = result[x].address;
        var date = new Date(result[x].date*1000);
        addresses.push([address+", Austin, Texas",crime, time, date]);



      }
	    console.log(result);
	  }
	});

	Dwi.find({}, function(err, dwidata){
  	console.log('anything',err,dwidata);
      res.render('index', {
        title: '@ustin m@ps',
        crime: dwidata
      });
  });

});



router.post('/', function (req, res) {



});


module.exports = router;
