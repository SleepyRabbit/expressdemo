/**
 * Created by houenxing on 17/7/21.
 */
"use strict"
const express = require('express');
const router = express.Router();
const path = require("path");
const mime = require("mime");
const fs = require("fs");

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
    console.log(user);
    if(!!user) {
        let imgList = []

        let dir_path = path.join(__dirname, "../upload", user);
        // console.log(dir_path);

        let dirs = fs.readdirSync(dir_path);
        // console.log("dir:" + dirs);

        let src = "";

        dirs.forEach(dir => {
            // console.log(dir);
            let temp = path.join(dir_path, dir);
            // console.log(temp);
            let stat = fs.statSync(temp);
            // console.log(stat);
            // console.log(stat.isDirectory());
            // console.log(stat.isFile());

            if(stat.isFile()) {
                let type = mime.lookup(temp);
                console.log(type);
                let array = type.split('/');

                if(array[0] === "image") {
                    if(image_mime.indexOf(array[1]) > -1 ){
                        console.log("Image file!");
                        imgList.push(temp);
                    }
                }
                // if()
            }
            else {
                console.log("directory");
            }
        })
        res.send(imgList);
        // res.render('photo', {user: user, src: src});
    }
    else {
        res.send('no user');
    }
});

module.exports = router;