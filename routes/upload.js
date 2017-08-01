/**
 * Created by houenxing on 17/7/21.
 */
"use strict"

var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var utils = require("../lib/utils")

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        let user = req.session.user;
        let photo_path = path.join(__dirname, `../upload/${user}`);
        console.log("path: " + photo_path);

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

router.post('/', upload.array('photo', 12), function (req, res, next) {
    if(req.files) {
        console.log("multiple files upload processing...");
        // console.log(req.files);
        res.send('File upload successful!');
    }
});

module.exports = router;