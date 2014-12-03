var gulp = require("gulp"),
    sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    minifycss = require("gulp-minify-css"),
    jshint = require("gulp-jshint"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    concat = require("gulp-concat"),
    notify = require("gulp-notify"),
    cache = require("gulp-cache"),
    del = require("del"),
    lazypipe = require("lazypipe"),
    debug = require("gulp-debug"),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var src = "src/**/*",
    bld = "bld",
    dist = "dist";

var srccss = src + ".css",
    srcscss = src + ".scss",
    srcjs = src + ".js",
    srcstatic = [src + ".html", src + ".jpg", src + ".png", src + ".gif"];

var cssPipe = lazypipe()
    // .pipe(debug, {
    //     verbose: true
    // })
    .pipe(autoprefixer, "'last 2 version'")
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

gulp.task("browser-sync", function() {
    browserSync({
        server: {
            baseDir: bld
        }
    });
});

gulp.task("css", function() {
    return gulp.src(srccss)
        .pipe(cssPipe());
});

gulp.task("scss", function() {
    return gulp.src(srcscss)
        .pipe(sass())
        .pipe(cssPipe());
});

gulp.task("js", function() {
    return gulp.src(srcjs)
        .pipe(jshint())
        .pipe(jshint.reporter("default"))
        .pipe(gulp.dest(bld))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(uglify())
        .pipe(gulp.dest(bld));
});

gulp.task("static", function() {
    return gulp.src(srcstatic)
        .pipe(gulp.dest(bld))
        .pipe(reload({
            stream: true
        }));
});

gulp.task("clean", function(cb) {
    del(bld, cb);
});

gulp.task("default", ["clean"], function() {
    gulp.start("static", "js", "css", "scss");
});

gulp.task("watch", ["browser-sync"], function() {
    gulp.watch(srccss, ["css"]);
    gulp.watch(srcscss, ["scss"]);
    gulp.watch(srcjs, ["js", reload]);
    gulp.watch(srcstatic, ["static", reload]);
});
