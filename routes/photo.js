/**
 * Created by houenxing on 17/7/21.
 */
"use strict"

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    let user = req.session.user;
    console.log(user);
    res.render('photo', {user: user});
});

router.post('/', function (req, res, next) {

});

module.exports = router;