var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
    var data = {
        "title": "Velocity Template Language for JavaScript",
        "brief": "JavaScript版本VTL，Velocity是基于Java的模板引擎，veloctiy.js是JS版本的实现。",
        "features": [
            "语法分析和模板渲染分离(参考xtemplate方案)，本地编译模板",
            "基本完全支持velocity语法",
            "支持模板之间相互引用，依据kissy木块加载机制(可推及其他模块加载器)"
        ],
        "doc": {
            "title": "Documents",
            "link": "http://velocity.apache.org/engine/devel/user-guide.html",
            "text": "velocity user guide"
        },
        "meta": {
            "git": "https://github.com/shepherdwind/velocity.js"
        },
        "func": {
            getTitle: function(){
                return 'express-velocity'
            }
        }
    };
    res.render('index', data)
});

module.exports = router;
