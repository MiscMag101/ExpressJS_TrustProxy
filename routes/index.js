var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express Trust Proxy Prototype' });
});

// Trust proxy
router.get('/proxy', function(req, res, next) {
  res.render('proxy', { ip: req.ip, hostname: req.hostname, protocol: req.protocol});
});

module.exports = router;
