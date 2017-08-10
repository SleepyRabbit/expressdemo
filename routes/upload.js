/**
 * Created by houenxing on 17/7/21.
 */
"use strict"

var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var utils = require("../lib/utils");
var formidable = require('formidable');

/* GET home page. */
router.get('/', function(req, res, next) {
    let user = req.session.user;
    if(!!user) {
        res.render('upload');
    }
    else {
        res.redirect('/');
    }
});

router.post('/', function (req, res, next) {
    console.log("upload");
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;  // 保留文件后缀
    form.multiples = true;

    form.parse(req, function (err, fields, data) {
        // 检查是否有错
        if(err) {
            console.log("Form parse occured:" + err);
            res.send("error");
            return;
        }
        // 提取用户名
        let user = fields.user;
        console.log(user);
        if(!user) {
            console.log("No user!");
            res.send("no user");
            return;
        }
        else {
            if(!data.file) {
                console.log("No file upload!");
                res.send("no file");
                return;
            }
            else {
                let photo_path = path.join(__dirname, `../upload/${user}`);
                console.log("path: " + photo_path);
                // 检查存储文件夹是否存在，不存在就建立
                if(!fs.existsSync(photo_path)) {
                    utils.mkdir(photo_path);
                }

                // 妈的，这里的data是个坑，如果前端上传的是一个文件，data的格式是：
                // {file:
                //   FILE {...}}
                // 如果前端上传的是多个文件，data的格式是：
                // {file: [
                //     FILE {...}, FILE {}
                // ]}
                // 需要根据data.file的类型来选择不同的处理方式，但是如果使用typeof，那么对象数组和对象返回的都是object。。。

                let files = data.file;
                // console.log(Object.prototype.toString.call(files));
                switch(Object.prototype.toString.call(files)) {
                    case "[object Array]":
                        files.forEach(file => {
                            // console.log(file);
                            // 设置文件存储路径
                            let newPath = path.join(photo_path, file.name);
                            // 存储文件
                            fs.rename(file.path, newPath, err => {
                                if(err) {
                                    console.log("File save error!");
                                    res.send("save error");
                                    return;
                                }
                            });
                        });
                        break;
                    case "[object Object]":
                        // 设置文件存储路径
                        let newPath = path.join(photo_path, files.name);
                        // 存储文件
                        fs.rename(files.path, newPath, err => {
                            if(err) {
                                console.log("File save error!");
                                res.send("save error");
                                return;
                            }
                        });
                        break;
                    default:
                        break;
                }
                // // console.log(files);
                console.log("File save successful!");
                res.send("succeed");
            }
        }
    });
})

module.exports = router;