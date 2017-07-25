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
    res.render('login', {logInfo: ""});
});

router.post('/', function (req, res, next) {

    let username = req.body.username;
    let password = req.body.password;

    if(!username || !password) {
        console.log("Username or password can't be empty!");
        res.render('login', { logInfo: "Username or password can't be empty!" });
        return;
    }

    let url = db.dbUrl;
    var database = mongoose.connect(url, {useMongoClient: true}).then(() => {
        console.log('Login mongoose successful!');
        let col = database.collection('usermodel');
        console.log(col);
        col.find({"username": username}, function (err, docs) {
            if(err) {
                res.render('login', {logInfo: "Error exist!"});
                return
            }
            else {
                console.log(docs);
                docs.forEach( doc => {
                    console.log(doc);
                })
            }
        })
    });

});

module.exports = router;