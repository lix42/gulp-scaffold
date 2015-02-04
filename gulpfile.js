"use strict";

var gulp = require("gulp"),
    sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    minifycss = require("gulp-minify-css"),
    browserify = require("browserify"),
    transform = require("vinyl-transform"),
    jshint = require("gulp-jshint"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    del = require("del"),
    lazypipe = require("lazypipe"),
//debug = require("gulp-debug"),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var src = "./src",
    srcFiles = src + "/**/*",
    bld = "./bld",
    dist = "./dist",
    srcCss = srcFiles + ".css",
    srcScss = srcFiles + ".scss",
    srcJs = srcFiles + ".js",
    srcStatic = srcFiles + ".+(html|jpg|png|gif|svg)",
    appJs = "src/app/**/*.js",
    cssPipe;

gulp.task("browser-sync", function () {
    browserSync({
                    server: {
                        baseDir: [bld, src]
                    },
                    files:  [
                        bld + "/**",
                        "!" + bld + "/**.map"
                    ]
                });
});

cssPipe = lazypipe()
    // .pipe(debug, {
    //     verbose: true
    // })
    .pipe(autoprefixer, "{ browsers: ['last 2 version'] }")
    .pipe(gulp.dest, bld)
    .pipe(reload, {
              stream: true
          })
    .pipe(rename, {
              suffix: ".min"
          })
    .pipe(minifycss)
    .pipe(gulp.dest, bld)
    .pipe(reload, {
              stream: true
          });

gulp.task("css", function () {
    return gulp.src(srcCss)
        .pipe(cssPipe());
});

gulp.task("scss", function () {
    return gulp.src(srcScss)
        .pipe(sass())
        .pipe(cssPipe());
});

gulp.task("js", function () {
    return gulp.src(srcJs)
        .pipe(jshint())
        .pipe(jshint.reporter("default"));
});

gulp.task("appJs", ["js"], function () {
    var browserified = transform(function (filename) {
        var b = browserify(filename);
        return b.bundle();
    });

    return gulp.src(appJs)
        .pipe(browserified)
        .pipe(gulp.dest(bld + "/app"))
        .pipe(rename({
                         suffix: ".min"
                     }))
        .pipe(uglify())
        .pipe(gulp.dest(bld + "/app"));
});

gulp.task("static", function () {
    return gulp.src(srcStatic)
        .pipe(gulp.dest(bld));
});

gulp.task("clean", function (cb) {
    del(bld, cb);
});

gulp.task("default", ["clean"], function () {
    gulp.start("static", "js", "appJs", "css", "scss");
});

gulp.task("watch", ["browser-sync"], function () {
    gulp.watch(srcCss, ["css"]);
    gulp.watch(srcScss, ["scss"]);
    gulp.watch(srcJs, ["js"]);
    gulp.watch(srcStatic, ["static", reload]);
});
