var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    // 因为是单页应用 所有请求都走/dist/index.html
    const html = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf-8')
    res.send(html)
});

module.exports = router;
