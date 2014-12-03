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
    debug = require("gulp-debug");

var src = "src/**/*",
    bld = "bld",
    dist = "dist";

var cssPipe = lazypipe()
    // .pipe(debug, {
    //     verbose: true
    // })
    .pipe(autoprefixer, "'last 2 version'")
    .pipe(gulp.dest, bld)
    .pipe(rename, {
        suffix: ".min"
    })
    .pipe(minifycss)
    .pipe(gulp.dest, bld);

gulp.task("css", function() {
    return gulp.src(src + ".css")
        .pipe(cssPipe());
});

gulp.task("scss", function() {
    return gulp.src(src + ".scss")
        .pipe(sass())
        .pipe(cssPipe());
});

gulp.task("js", function() {
    return gulp.src(src + ".js")
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
    return gulp.src([src + ".html", src + ".jpg", src + ".png", src + ".gif"])
        .pipe(gulp.dest(bld));
});

gulp.task("clean", function(cb) {
    del(bld, cb);
})

gulp.task("default", ["clean"], function() {
    gulp.start("static", "js", "css", "scss");
})
