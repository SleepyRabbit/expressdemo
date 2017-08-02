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

    // 用户名或者密码为空
    if(!username || !password) {
        console.log("Username or password can't be empty!");
        res.send("empty");
        // res.render('login', { logInfo: "Username or password can't be empty!" });
        return;
    }

    // 登录mongodb
    db.dbLogin(function () {
        console.log('Login mongoose successful!');

        // 在mongodb中查找是否有该用户
        db.userModel.find({"username": username}, function (err, docs) {
            // 查找出现错误
            if (err) {
                res.send("error");
                return;
            }
            else {
                let len = docs.length;
                // 查找到2个以上的同名用户
                if(len > 1) {
                    console.log('More than 2 username exist!');
                    res.send("conflict");
                    // res.render('login', {logInfo: "Username error exist!"});
                }
                // 找不到该用户名的用户
                else if(len === 0) {
                    console.log("No username exist!");
                    res.send('not found')
                    // res.render('login', {logInfo: "Wrong username or password!"})
                }
                else {
                    // 用户名和密码匹配
                    if((docs[0].username === username) && (docs[0].password) === password) {
                        console.log("Right username and password!");
                        res.send("succeed");

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
                        // res.send("Login successful!");
                    }
                    // 用户名和密码不匹配
                    else {
                        console.log("Wrong username or password!");
                        res.send("failed");
                        // res.render('login', {logInfo: "Wrong username or password!"})
                    }
                }
            }
        })
    })

});

module.exports = router;