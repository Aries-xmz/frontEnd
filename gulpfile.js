// commonjs
const path=require("path")
const { src, dest, series, parallel,watch } = require('gulp')
const connect = require('gulp-connect')
const sass = require('gulp-sass')
const webpack =require("webpack-stream")
const proxy = require('http-proxy-middleware')



// copyhtml
function copyhtml() {
  return src('./src/*.html')
    .pipe(dest('./dev/'))
    .pipe(connect.reload())
}

// copylibs
function copylibs(){
  return src('./src/libs/**/*')
  .pipe(dest('./dev/libs'))
  .pipe(connect.reload())
}

//
function copyassets() {
  return src('./src/assets/**/*')
    .pipe(dest('./dev/assets'))
}

// JS模块化
function packJS(){
  return src("./src/scripts/app.js")
  .pipe(webpack({
    mode:"development",
    entry:"./src/scripts/app.js",
    output:{
      path: path.resolve(__dirname, './dev'),
      filename:"app.js",
    },
    module:{
      rules:[
        {
          test:/\.html$/,
          loader:"string-loader"
        },
        {
          test:/\.art$/,
          loader:"art-template-loader"
        }
      ]
    }
  }))
  .pipe(dest("./dev/scripts/"))
  .pipe(connect.reload())
}

// 编译sass
function packSCSS() {
  return src(['./src/styles/**/*.scss', '!./src/styles/yo/**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('./dev/styles/'))
    .pipe(connect.reload())
}
// 启动server
function gulpServer() {
  return connect.server({
    name: 'Dist App',
    root: './dev',
    port: 8000,
    // host:'10.9.49.180',
    livereload: true,
    middleware: () => {
      return [
        proxy('/api', {
          target: 'http://localhost:3000',
          changeOrigin: true
        })
      ]
    }
  })
}

// watch
function watchFiles(){
  watch("./src/*.html",copyhtml)
  watch("./src/**/*.scss",packSCSS)
  watch("./src/**/*",packJS)
  watch('./src/libs/*', series(copylibs))
  watch('./src/assets/*', series(copyassets))
}

exports.default = series(parallel(copyhtml, packSCSS,packJS,copylibs,copyassets), parallel(gulpServer,watchFiles))

