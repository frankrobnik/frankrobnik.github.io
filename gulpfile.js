'use strict';

const { series, parallel, src, dest, watch } = require('gulp');
const del = require('del');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

function clean() {
  return del(['public/**', '!public']);
}

function css() {
  return src('./src/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([ autoprefixer(), cssnano() ]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./public/css'))
    .pipe(browserSync.stream({match: '**/*.css'}));
}

function javascript() {
  return src('./src/**/*.js')
    .pipe(dest('./public'))
    .pipe(browserSync.stream());
}

function html() {
  return src('./src/**/*.html')
    .pipe(dest('./public'))
    .pipe(browserSync.stream());
}

function images() {
  return src([
      './src/images/*.jpg', 
      './src/images/*.png',
      './src/images/*.gif',
      './src/images/*.svg',
      './src/images/*.webp'
    ])
    .pipe(dest('./public/images'))
    .pipe(browserSync.stream());
}

function develop(){
  browserSync.init({
    server: "./public/"
  });

  watch('src/sass/*.scss', { ignoreInitial: false }, css);
  watch('src/js/*.js', { ignoreInitial: false }, javascript);
  watch('src/**/*.html',  { ignoreInitial: false }, html);
  watch('src/images/*.*',  { ignoreInitial: false }, images);

  watch([
    'public/css/*.css',
    'public/js/*.js',
    'public/**/*.html',
    'public/images/*.*'
  ]).on('change', browserSync.reload);

}


exports.build = series(clean, parallel(css, javascript, html, images));
exports.clean = clean;
exports.develop = develop;
