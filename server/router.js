var path = require('path');
var zip = require("node-native-zip");

var gulp = require('gulp');
var zip = require('gulp-zip');
//uui定制
var customized = require("./customized");
var down = require("./down");

// 新定制
var concat = require('gulp-concat');
var fs = require('fs');



module.exports = {

  setRouters: function(router ,ctx){
    router.get('/loadMenu', function *(next) {
        var demos = require('../conf/snippets.conf.json');
        this.body = demos;//JSON.stringify('test');
    });

    var getTpl = function(styles,htmls,scripts){

      var ctxPath='http://design.yyuap.com/static/uui-original/stable';
    //    var ctxPath='/dist/vendor/uui';
      var tpl = [
        '<!DOCTYPE html>',
        '<html lang="en">',
        '<head>',
        '<meta charset="UTF-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        '<title>Title</title>',
        '<link rel="stylesheet" href="http://design.yyuap.com/static/uploader/css/webuploader.css">',
        '<link rel="stylesheet" href="'+ ctxPath +'/css/font-awesome.css">',
        '<link rel="stylesheet" type="text/css" href="'+ ctxPath +'/css/u.css">',
        '<link rel="stylesheet" type="text/css" href="'+ ctxPath +'/css/tree.css">',
        '<link rel="stylesheet" type="text/css" href="'+ ctxPath +'/css/grid.css">',
        '<style id="demo-style" media="screen">',
        styles,
        '</style>',
        '</head>',
        '<body style="background-color: #eceff1;margin-left: 20px;width: calc(100% - 20px );">',
        htmls,
        '<script src="http://design.yyuap.com/static/jquery/jquery-1.11.2.js"></script>',
        '<script src="http://design.yyuap.com/static/uploader/js/webuploader.js"></script>',
        '<script src="http://design.yyuap.com/static/knockout/knockout-3.2.0.debug.js"></script>',
        '<script src="'+ ctxPath +'/js/u-polyfill.js"></script>',
        '<script src="'+ ctxPath +'/js/u.js"></script>',
        '<script src="'+ ctxPath +'/js/u-tree.js"></script>',
        '<script src="'+ ctxPath +'/js/u-grid.js"></script>',
        '<script src="http://design.yyuap.com/static/requirejs/require.debug.js"></script>',
        '<script>',
        scripts,
        '</script>',
        '</body>',
        '</html>'
      ]
      return tpl;

    };
    router.post('/getWidgets', function *(next) {
      var fs = require("fs");
      var url = this.request.body.wUrl;
      var datas = {}
      var _html  = _css = _script = '';

      // 相对于当前执行文件的目录
      var widgetPath = path.resolve(__dirname, '../dist/pages/webIDE/' + url + '/widget.html');
      var cssPath = path.resolve(__dirname, '../dist/pages/webIDE/' + url + '/widget.css');
      var scriptPath = path.resolve(__dirname, '../dist/pages/webIDE/' + url + '/widget.js');

      if (fs.existsSync( widgetPath ))
        _html = fs.readFileSync( widgetPath );
      if (fs.existsSync( cssPath ))
        _css = fs.readFileSync( cssPath );
      if (fs.existsSync( scriptPath ))
        _script = fs.readFileSync( scriptPath );

      datas.html = _html.toString();
      datas.css = _css.toString();
      datas.script = _script.toString();
      this.body = datas;
    });

    router.post('/runDemo', function *(next) {
        // this.request.body;
        // console.log(this.request.body.html_code);
        var styles = this.request.body.css_code;
        var htmls = this.request.body.html_code;
        var scripts = this.request.body.script_code;

        var tpl = getTpl(styles,htmls,scripts);

        this.body = tpl.join("");//JSON.stringify('test');
    });

    //uui定制相关
    router.post('/customized', function *(next) {
      var self = this;
      yield function(cb){
          customized.run(self,cb);
      }

    });

    // 新定制
    router.post('/package', function *(next) {
      var self = this;
      console.log(this.request.body);

      var data = this.request.body;
      var pack = require('./pack.js');
      yield function(cb) {
        pack(data,self,cb);
      };
      // this.body = pack(data);
    });

    router.post('/downloadDemo',function *(next) {
        var viewCode = "",zipName='';
        var styles = this.request.body.cssCode;
        var htmls = this.request.body.htmlCode;
        var scripts = this.request.body.jsCode;

         var tpl = getTpl(styles,htmls,scripts);
        viewCode = tpl.join('\r\n');
        var fs = require("fs");
        var downPath = '../dist/pages/webIDE/temp';
        var tempDir = path.resolve(__dirname, downPath);
        fs.exists( tempDir, function(exist) {
          if(!exist){
            fs.mkdirSync(tempDir);
          }
        });

        fs.writeFile(downPath+'/download.html', viewCode ,  function(err) {
           if (err) {
               return console.error(err);
           }
        });

        // zipName = 'download'+new Date().getTime()+'.zip';
        zipName = 'download.zip';
        // 生成zip
        gulp.task('downzip',function(){
          return  gulp.src(downPath+'/download.html')
                .pipe(zip(zipName))
                .pipe(gulp.dest(downPath))
        });

        gulp.run('downzip');

        this.body = downPath+"/"+zipName;

    });

    router.get('/down', function *(next) {
      var self = this;
      yield function(cb){
          down.run(self,cb);
      }
    });

  }

}
