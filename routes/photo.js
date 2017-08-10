/**
 * Created by houenxing on 17/7/21.
 */
"use strict"
const express = require('express');
const router = express.Router();
const path = require("path");
const mime = require("mime");
const fs = require("fs");
const addr = require('../lib/addr');        // addr目前只在linux平台有效
const config = require('../config/config.json');

var image_mime = ["jpeg", "gif", "bmp"];

/* GET home page. */
router.get('/', function(req, res, next) {
    let user = req.session.user;
    if(!!user) {
        console.log(user);
        res.render('photo', {user: user});
    }
    else {
        res.redirect('/');
    }
});

router.post('/', function (req, res, next) {
    let user = req.body.username;
    console.log("user: "+ user + " visit photos!");

    if(!!user) {
        let port = normalizePort(process.env.PORT || config.main.port);
        let ip = "http://localhost:"
        // let ip = addr.getIP().intranet;           //linux下可以使用
        let host = ip + port;

        let imgList = [];

        let dir_path = path.join(__dirname, "../upload", user);
        // console.log(dir_path);
        // 检查存储文件夹是否存在，不存在说明该用户之前未存储过图片
        if(!fs.existsSync(dir_path)) {
            console.log("no photo here!");
            return;
        }

        let dirs = fs.readdirSync(dir_path);
        // console.log("dir:" + dirs);
        dirs.forEach(dir => {
            // console.log(dir);
            let tempPath = path.join(dir_path, dir);
            let stat = fs.statSync(tempPath);
            if(stat.isFile()) {
                let type = mime.lookup(tempPath);
                // console.log(type);
                let array = type.split('/');
                if(array[0] === "image") {
                    if(image_mime.indexOf(array[1]) > -1 ){
                        let relativePath = "/" + user + "/" +dir;
                        imgList.push(host + relativePath);      // 格式：http://localhost:3006/22/WechatIMG1.jpeg
                    }
                }
            }
            else {
                console.log("directory");
            }
        })
        res.send(imgList);
    }
    else {
        console.log("no user");
        res.send('no user');
    }
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

module.exports = router;