const { gulp, watch, series, parallel } = require('gulp');

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const inject = require('gulp-inject');
const htmlmin = require('gulp-htmlmin');
const cache = require('gulp-cache');
const del = require('del');

// Compiles and prefixes scss files.
function cssCompile() {
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass({outputStyle: 'nested'}))
        .pipe(autoprefixer({
            browsers: ['last 10 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('app/css'));
}

// Minifies css files.
function cssMinify() {
    return gulp.src('app/css/*.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
}

// Concatenates all custom scripts into one file.
function jsBuildMain() {
    return gulp.src(['app/js/*', '!app/js/main.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('app/js/'));
}

// Minifies js files.
function jsMinify() {
    return gulp.src(['app/js/main.js'])
        .pipe(minify({ext: {min:'.min.js'}, noSource: true}))
        .pipe(gulp.dest('dist/js'));
}

// Optimizes image files.
function imgCompression() {
    return gulp.src(['app/img/**/*'])
        .pipe(cache(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })
        ])))
        .pipe(gulp.dest('./dist/img'));
}

// Copies fonts.
function copyFonts() {
    return gulp.src('app/font/**/*')
        .pipe(gulp.dest('dist/font'));
}

// Copies index.html
function copyIndex() {
    return gulp.src('app/index.html')
        .pipe(gulp.dest('dist'));
}

// Replaces references to css and js files and minifies index.html.
function htmlMinify() {
    let css = gulp.src('./dist/css/*.min.css');
    let js = gulp.src('./dist/js/*.min.js');

    return gulp.src('./dist/index.html')
        .pipe(inject(css, {relative: true}))
        .pipe(inject(js, {relative: true}))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./dist'));
}

// Spins up a web server.
function serve() {
    browserSync.init({
        server: {
            baseDir: './dist',
            index: "index.html",
            directory: true
        },
        notify: false,
        reloadDebounce: 2000
    });
}

// Deletes the contents of dist directory.
function cleanDist() {
    return del.sync(['./dist', '/app/js/main.js']);
}

// Clears all cache files.
function clearCache() {
    cache.clearAll();
}

// Watches project for changes.
watch('app/scss/**/*.scss', cssCompile);
watch('app/css/*.css', cssMinify);
watch(['app/js/*.js', '!app/js/main.js'], jsBuildMain);
watch(['app/js/main.js'], jsMinify).on('change', browserSync.reload);
watch(['app/img/**/*'], imgCompression).on('change', browserSync.reload);
watch('app/font/**/*', copyFonts).on('change', browserSync.reload);
watch('app/index.html', series(copyIndex, htmlMinify)).on('change', browserSync.reload);

exports.clearCache = clearCache();

// Builds everything
exports.build = series(
    cleanDist, cssCompile, jsBuildMain,
    parallel(
        cssMinify, jsMinify, imgCompression, copyFonts
    ),
    copyIndex, htmlMinify
);

// Creates default task.
exports.default = series(serve, watch);
