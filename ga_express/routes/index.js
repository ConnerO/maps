var express = require('express');
var router = express.Router();

var Dwi = require('../models/dwi');
var User = require('../models/user');

router.get('/', function (req, res) {

  Dwi.find({}, function(err, dwidata){
  	console.log('anything',err,dwidata);
      res.render('index', {
        user : req.user,
        title: '@ustin m@ps',
        dwis: dwidata
      });
  });

});

module.exports = router;
