var gulp = require("gulp"),
    sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    minifycss = require("gulp-minify-css"),
    jshint = require("gulp-jshint"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    del = require("del"),
    lazypipe = require("lazypipe"),
    debug = require("gulp-debug"),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var src = "src/**/*",
    bld = "bld",
    dist = "dist";

var srcCss = src + ".css",
    srcScss = src + ".scss",
    srcJs = src + ".js",
    srcStatic = src + ".+(html|jpg|png|gif)";

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
    return gulp.src(srcCss)
        .pipe(cssPipe());
});

gulp.task("scss", function() {
    return gulp.src(srcScss)
        .pipe(sass())
        .pipe(cssPipe());
});

gulp.task("js", function() {
    return gulp.src(srcJs)
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
    return gulp.src(srcStatic)
        .pipe(gulp.dest(bld));
});

gulp.task("clean", function(cb) {
    del(bld, cb);
});

gulp.task("default", ["clean"], function() {
    gulp.start("static", "js", "css", "scss");
});

gulp.task("watch", ["browser-sync"], function() {
    gulp.watch(srcCss, ["css"]);
    gulp.watch(srcScss, ["scss"]);
    gulp.watch(srcJs, ["js", reload]);
    gulp.watch(srcStatic, ["static", reload]);
});
