/**
 * Created by houenxing on 17/7/17.
 */
/**
 * Useage:
     * var addr = require("addr.js");
     * addr.getIP();
 *
 * Return:
     * addr: {
     *      intranet: String,
     *      internet: String
     * }
 **/
"use strict";
const os = require('os');

module.exports = {
getIP: function() {
        let addr = {
            intranet: String,
            internet: String
        }

        let ifaces = os.networkInterfaces();
        // console.log(ifaces);
        for (let dev in ifaces) {
            if (dev.indexOf('eth0') != -1) {
                let tokens = dev.split(':');
                let dev2 = null;
                if (tokens.length == 2) {
                    dev2 = 'eth1:' + tokens[1];
                } else if (tokens.length == 1) {
                    dev2 = 'eth1';
                }
                if (null == ifaces[dev2]) {
                    continue;
                }
                // 找到eth0和eth1分别的ip
                let ip = null, ip2 = null;
                ifaces[dev].forEach(function(details) {
                    if (details.family == 'IPv4') {
                        ip = details.address;
                    }
                });
                ifaces[dev2].forEach(function(details) {
                    if (details.family == 'IPv4') {
                        ip2 = details.address;
                    }
                });
                if (null == ip || null == ip2) {
                    continue;
                }

                // 将记录添加到addr中去
                if (ip.indexOf('10.') == 0 ||
                    ip.indexOf('172.') == 0 ||
                    ip.indexOf('192.') == 0) {
                    addr.intranet = ip;
                    addr.internet = ip2;
                } else {
                    addr.intranet = ip2;
                    addr.internet = ip;
                }
            }
        }
        return addr;
    }
}