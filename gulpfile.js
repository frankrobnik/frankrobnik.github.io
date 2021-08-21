'use strict';

const { parallel, series, src, dest, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const webpack = require('webpack-stream');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const del = require('del');

function clean() {
  return del(['js/main.bundle.js']);
};

function css() {
  return src('./sass/**/*.scss')
    //.pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(postcss([ autoprefixer(), cssnano() ]))
    //.pipe(sourcemaps.write('.'))
    .pipe(dest('./css'))
    .pipe(browserSync.stream({match: '**/*.css'}));
}


function javascriptBuild() {
  return src('./js/main.js')
    .pipe(webpack({mode: 'production'}))
    .pipe(dest('./js/'))
    .pipe(rename('main.bundle.js'))
    .pipe(dest("./js"));
}


function javascriptDevelop() {
  return src('./js/main.js')
    .pipe(webpack({watch: true, mode: 'development'}))
    .pipe(dest('./js/'))
    .pipe(rename('main.bundle.js'))
    .pipe(dest("./js"))
    .pipe(browserSync.stream());
}


function develop(){
  browserSync.init({
    server: "./"
  });
  
  // watch('sass/*.scss', { ignoreInitial: false }, css);
  //watch('js/animations.js', { ignoreInitial: false }, series(clean, javascript, javascriptLibs));

  watch([
    'js/main.bundle.js',
    'index.html',
    'images/*.*'
  ]).on('change', browserSync.reload);

}


exports.build = series(clean, parallel(css, javascriptBuild));
exports.develop = parallel(develop, javascriptDevelop);
