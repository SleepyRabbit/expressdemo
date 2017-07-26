/**
 * Created by houenxing on 17/7/21.
 */
"use strict"

var express = require('express');
var router = express.Router();
var db = require('../config/db');

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
    
    db.dbLogin(function () {
        console.log('Login mongoose successful!');
        db.userModel.find({"username": username}, function (err, docs) {
            if (err) {
                res.render('login', {logInfo: "Error exist!"});
                return;
            }
            else {
                let len = docs.length;
                if(len > 1) {
                    console.log('More than 2 username exist!');
                    res.render('login', {logInfo: "Username error exist!"});
                }
                else if(len === 0) {
                    console.log("No username exist!");
                    res.render('login', {logInfo: "Wrong username or password!"})
                }
                else {
                    if((docs[0].username === username) && (docs[0].password) === password) {
                        console.log("Right username and password!");
                        res.send("Login successful!");
                    }
                    else {
                        console.log("Wrong username or password!");
                        res.render('login', {logInfo: "Wrong username or password!"})
                    }
                }
            }
        })
    })

});

module.exports = router;