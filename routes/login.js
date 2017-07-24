/**
 * Created by houenxing on 17/7/21.
 */
"use strict"

var express = require('express');
var router = express.Router();
var db = require('../config/db');
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login');
});

router.post('/', function (req, res, next) {
    console.log(req.body.username);
    console.log(req.body.password);

    let url = db.dbUrl;
    mongoose.connect(url, {useMongoClient: true}).then(() => {
        console.log('Login mongoose successful!');
    });

});

module.exports = router;