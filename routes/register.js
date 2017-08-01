/**
 * Created by houenxing on 17/7/24.
 */
"use strict";

var express = require('express');
var router = express.Router();
var db = require('../config/db');


router.get('/', function(req, res, next) {
    res.render('register', { regInfo: "" });
});

router.post('/', function (req, res, next) {
    console.log(req.body.username);
    console.log(req.body.password);

    let username = req.body.username;
    let password = req.body.password;

    if(!username || !password) {
        console.log("Username or password can't be empty!");
        res.render('register', { regInfo: "Username or password can't be empty!" });
        return;
    }

    db.dbLogin(function () {
        console.log('Login mongodb successful!');
        db.userModel.find({"username": username}, function (err, docs) {
            if(err) {
                res.render('register', {regInfo: "Error exist!"});
                return
            }
            else {
                if(docs.length>0) {
                    console.log(docs);
                    res.render('register', {regInfo: "The username already exist!"});
                }
                else {
                    console.log('Start saving!');
                    let user = new db.userModel({
                        username: username,
                        password: password,
                        registerTime: new Date()
                    });

                    // console.log(user);

                    user.save(function (err) {
                        console.log('save!');
                        if(err) {
                            console.log(err);
                            res.send('Register failed!');
                        }
                        else {
                            console.log('Register successful!');

                            req.session.user = username;
                            req.session.regenerate(function (err) {
                                if(err) {
                                    console.log("session重新初始化失败.");
                                }
                                else {
                                    console.log("session被重新初始化.");
                                }
                            });
                            // res.redirect('/');
                            // res.send("succed!");
                        }
                    })
                }
            }
        })
    })


    // mongoose.connect(url, {useMongoClient: true}).then(() => {
    //     console.log('Login mongodb successful!');
    // });

    // userModel.findByName('ddd', function (err, data) {
    //     if(err) {
    //         console.log("Can't find it");
    //     }
    //     else {
    //         console.log(data);
    //     }
    // })
});

module.exports = router;