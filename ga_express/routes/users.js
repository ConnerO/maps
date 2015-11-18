var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// method="post" action="/users"
router.post('/', function(req, res, next) {
  res.render('users/show', {
      name: req.body.name,
      favorite: req.body.favorite
  });

	res.end();
});

router.get('/new', function(req, res, next) {
    res.render('users/new');
});


module.exports = router;
