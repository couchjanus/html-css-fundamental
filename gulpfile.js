'use strict';

const gulp = require('gulp');

const watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'), // plumber() - не выбрасывать из компилятора если есть ошибки
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var path = {

        build: {
            html: 'public/',
            css: 'public/css/',
        },
        src: {
            html: 'src/*.html',
            style: 'src/sass/main.scss',
        },
        watch: {
            html: 'src/**/*.html',
            style: 'src/sass/**/*.scss',
        },
        clean: './build'
    };
    
    var config = {
        server: {
            baseDir: "./public"
        },
        tunnel: true,
        host: 'localhost',
        port: 3000,
        logPrefix: "Frontend_Devil"
    };
    
    gulp.task('webserver', function () {
        browserSync(config);
    });
    
    gulp.task('clean', function (cb) {
        rimraf(path.clean, cb);
    });
    
    gulp.task('html:build', function () {
        gulp.src(path.src.html) 
            .pipe(rigger())
            .pipe(gulp.dest(path.build.html))
            .pipe(reload({stream: true}));
    });
    
    // errLogToConsole: true - выводить номер строки в которой допущена ошибка
    
    gulp.task('style:build', function () {
        gulp.src(path.src.style)
            .pipe(plumber())
            .pipe(sourcemaps.init())
            .pipe(sass({
                sourceMap: true,
                errLogToConsole: true
            }))
            .pipe(prefixer())
            .pipe(cssmin())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(path.build.css))
            .pipe(reload({stream: true}));
    });
    
    
    gulp.task('build', [
        'html:build',
        'style:build',
    ]);
    
    gulp.task('watch', function(){
        watch([path.watch.html], function(event, cb) {
            gulp.start('html:build');
        });
        watch([path.watch.style], function(event, cb) {
            gulp.start('style:build');
        });
    });
    
    gulp.task('default', ['build', 'webserver', 'watch']);
 
