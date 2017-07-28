/**
 * Created by houenxing on 17/7/21.
 */
"use strict"

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    req.session.user = null;
    req.session.regenerate(function (err) {
        if(err) {
            console.log("session重新初始化失败.");
        }
        else {
            console.log("session被重新初始化.");
        }
    });
    res.redirect('/');

});

router.post('/', function (req, res, next) {

});

module.exports = router;