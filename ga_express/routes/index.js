var express = require('express');
var router = express.Router();

var Dwi = require('../models/dwi');
var User = require('../models/user');

router.get('/', function (req, res) {

  // Dwi.find({}, function(err, dwidata){
  //     res.render('index', {
  //       user : req.user,
  //       title: '@ustin m@ps',
  //       dwis: dwidata.name
  //     });
  // });

  Dwi.find({}), (function (err, result) {
    if (err) {
      console.log(err);
    } else if (result.length) {
      console.log('Found:', result);
    } else {
      console.log('No document(s) found with defined "find" criteria!');
    }
    //Close connection
    db.close();
  });

});

module.exports = router;
