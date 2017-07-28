var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session);
  let islogin = !!req.session.user;
  res.render('index', { title: 'Express', isLogin: islogin });
});

module.exports = router;
