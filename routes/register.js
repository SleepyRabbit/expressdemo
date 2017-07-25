/**
 * Created by houenxing on 17/7/24.
 */
"use strict";

var express = require('express');
var router = express.Router();
var db = require('../config/db');
var mongoose = require('mongoose');

// 由schema发布生成的模型，具有抽象属性和行为的数据库操作对
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    registerTime: Date
});

// 由schema发布生成的模型，具有抽象属性和行为的数据库操作对
var userModel = mongoose.model('usermodel', userSchema);

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

    mongoose.Promise = global.Promise;

    let url = db.dbUrl;
     console.log(url);
    let database = mongoose.connect(url, { useMongoClient: true }).then(() => {

        console.log('Login mongodb successful!');

        userModel.find({"username": username}, function (err, docs) {
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
                    let user = new userModel({
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
                            res.send('Register successful!');
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