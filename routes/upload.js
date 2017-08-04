/**
 * Created by houenxing on 17/7/21.
 */
"use strict"

var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var utils = require("../lib/utils");
var formidable = require('formidable');

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        // 构建文件存储目录
        let user = req.body.user;
        console.log(req);
        let photo_path = path.join(__dirname, `../upload/${user}`);
        // let photo_path = path.join(__dirname, `../upload/1`);
        console.log("path: " + photo_path);
        // 检查存储目录是否存在，不存在就建立目录
        if(!fs.existsSync(photo_path)) {
            utils.mkdir(photo_path);
        }
        cb(null, photo_path);
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({
    storage: storage
})

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

    // let tmpPath = path.join(__dirname, '../tmp');
    // // 检查存储目录是否存在，不存在就建立目录
    // if(!fs.existsSync(tmpPath)) {
    //     utils.mkdir(tmpPath);
    // }
    // form.uploadDir = tmpPath;

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

                let files = data.file;
                files.forEach(file => {
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
                })
                console.log("File save successful!");
                res.send("succeed");
            }
        }
    });
})

// router.post('/', upload.array('file', 12), function (req, res, next) {
//     console.log(req.body);
//     console.log("upload");
//     // if(req.files) {
//     //     console.log("multiple files upload processing...");
//     //     // console.log(req.files);
//     //     res.send('File upload successful!');
//     // }
// });

module.exports = router;