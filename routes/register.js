/**
 * Created by houenxing on 17/7/24.
 */
"use strict";

var express = require('express');
var router = express.Router();
var db = require('../config/db');
var mongoose = require('mongoose');

router.get('/', function(req, res, next) {
    res.render('register');
});

router.post('/', function (req, res, next) {
    console.log(req.body.username);
    console.log(req.body.password);

    let username = req.body.username;
    let password = req.body.password;

    if(!username || !password) {
        res.send("Username or password can't be empty!");
        return;
    }

    let url = db.dbUrl;
    let database = mongoose.createConnection(url, { useMongoClient: true }).then(() => {
        console.log('Login mongodb successful!');
    });
    // mongoose.connect(url, {useMongoClient: true}).then(() => {
    //     console.log('Login mongodb successful!');
    // });

    let schema = mongoose.Schema;

    let userSchema = new schema({
        username: String,
        password: String
    });

    let userModel = mongoose.model('usermodel', userSchema);
    userModel.findByName('ddd', function (err, data) {
        if(err) {
            console.log("Can't find it");
        }
        else {
            console.log(data);
        }
    })
});

module.exports = router;