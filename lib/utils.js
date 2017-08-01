/**
 * Created by houenxing on 17/7/29.
 */
"use strict";

const fs = require("fs");
const path = require("path");

module.exports = {
    mkdir: function (dstPath) {
        let arrays = dstPath.split("/");
        let tempDir = "";
        arrays.forEach( (arr) => {
            tempDir = path.join(tempDir, "/", arr);
            if(!fs.existsSync(tempDir)) {
                try {
                    fs.mkdirSync(tempDir);
                } catch (err) {
                    console.log(err);
                }
            }
        } );
    }
}