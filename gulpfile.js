'use strict';

const { parallel, src, dest, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

function css() {
  return src('./sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([ autoprefixer(), cssnano() ]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./css'))
    .pipe(browserSync.stream({match: '**/*.css'}));
}

function javascript() {
  return src('./js/**/*.js')
    .pipe(dest('./js'))
    .pipe(browserSync.stream());
}

function html() {
  return src('./**/*.html')
    .pipe(dest('./'))
    .pipe(browserSync.stream());
}

function develop(){
  browserSync.init({
    server: "./"
  });

  watch('sass/*.scss', { ignoreInitial: false }, css);
  watch('js/*.js', { ignoreInitial: false }, javascript);
  watch('**/*.html',  { ignoreInitial: false }, html);

  watch([
    //'css/*.css',
    //'js/*.js',
    '**/*.html',
    'images/*.*'
  ]).on('change', browserSync.reload);

}


exports.build = parallel(css, javascript, html, images);
exports.develop = develop;
