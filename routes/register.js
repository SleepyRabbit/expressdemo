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
    // console.log(req.body.username);
    // console.log(req.body.password);

    // 获取用户注册的用户名和密码
    let username = req.body.username;
    let password = req.body.password;

    // 判断一下用户名和密码是否为空
    if(!username || !password) {
        // console.log("Username or password can't be empty!");
        // res.render('register', { regInfo: "Username or password can't be empty!" });
        res.send("empty");
        return;
    }

    // 登陆mongodb
    db.dbLogin(function () {
        console.log('Login mongodb successful!');

        // 查询一下该用户名是否被注册过
        db.userModel.find({"username": username}, function (err, docs) {
            // 查询出错
            if(err) {
                // res.render('register', {regInfo: "Error exist!"});
                res.send("error");
                return;
            }
            else {
                // 该用户名已经被注册过了
                if(docs.length>0) {
                    // console.log(docs);
                    console.log("The username already exist!");
                    res.send("conflict");
                    return;
                    // res.render('register', {regInfo: "The username already exist!"});
                }
                // 用户名没问题
                else {
                    console.log('Start saving!');
                    let user = new db.userModel({
                        username: username,
                        password: password,
                        registerTime: new Date()
                    });

                    // console.log(user);

                    // 将用户名和密码保存至mongodb
                    user.save(function (err) {
                        // console.log('save!');
                        // 保存出现错误
                        if(err) {
                            // console.log(err);
                            res.send('failed!');
                        }
                        else {
                            // console.log('Register successful!');
                            res.send("succeed");

                            // 保存成功，更新session
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