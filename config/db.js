/**
 * Created by houenxing on 17/7/24.
 */
"use strict";

var config = require("../config.json");
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// 由schema发布生成的模型，具有抽象属性和行为的数据库操作对
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    registerTime: Date
});

module.exports = {
    dbLogin: function(cb) {
        mongoose.connect(config.database.dbUrl,  { useMongoClient: true }).then(cb).catch( err => {
            console.log(err);
        } );;
    },
    // 由schema发布生成的模型，具有抽象属性和行为的数据库操作对
    userModel: mongoose.model(config.database.modelName, userSchema),
}