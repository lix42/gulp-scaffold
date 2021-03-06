"use strict";

var _ = require("lodash"),
    gulp = require("gulp"),
    sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    minifycss = require("gulp-minify-css"),
    browserify = require("browserify"),
    transform = require("vinyl-transform"),
    jshint = require("gulp-jshint"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    sourcemaps = require("gulp-sourcemaps"),
    del = require("del"),
    lazypipe = require("lazypipe"),
//debug = require("gulp-debug"),
    browserSync = require("browser-sync"),
    reload = browserSync.reload,
    watchify = require("watchify"),
    browserifyOptions = _.extend({debug: true}, watchify.args);

var src = "./src",
    srcFiles = src + "/**/*",
    bld = "./bld",
    dist = "./dist",
    srcCss = srcFiles + ".css",
    srcScss = srcFiles + ".scss",
    srcJs = srcFiles + ".js",
    srcStatic = srcFiles + ".+(html|jpg|png|gif|svg)",
    appJs = "src/app/**/*.js",
    watching = false,
    cache = {},
    cssPipe;

gulp.task("browser-sync", function () {
    browserSync({
                    server:       {
                        baseDir: [bld, src]
                    },
                    ui:           {
                        port: 8000
                    },
                    files:        [
                        bld + "/**",
                        "!" + bld + "/**.map"
                    ],
                    watchOptions: {
                        debounceDelay: 1000
                    },
                    open:         false
                });
});

cssPipe = lazypipe()
    // .pipe(debug, {
    //     verbose: true
    // })
    .pipe(autoprefixer, "{ browsers: ['last 2 version'] }")
    .pipe(sourcemaps.write)
    .pipe(gulp.dest, bld)
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
        .pipe(sourcemaps.init())
        .pipe(cssPipe());
});

gulp.task("scss", function () {
    return gulp.src(srcScss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(cssPipe());
});

gulp.task("js", function () {
    return gulp.src(srcJs)
        .pipe(jshint())
        .pipe(jshint.reporter("default"));
});

gulp.task("appJs", ["js"], function () {
    var bundle = function () {
        var browserified = transform(function (filename) {
            if (cache[filename]) {
                return cache[filename].bundle();
            }
            var b = browserify(filename, browserifyOptions);
            //b.transform("debowerify");
            if (watching) {
                b = watchify(b);
                b.on("update", bundle);
                cache[filename] = b;
            }
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
    };

    return bundle();
});

gulp.task("static", function () {
    return gulp.src(srcStatic)
        .pipe(gulp.dest(bld));
});

gulp.task("clean", function (cb) {
    del(bld, cb);
});

gulp.task("build", ["clean"], function () {
    gulp.start("static", "js", "appJs", "css", "scss");
});

gulp.task("watch", ["browser-sync"], function () {
    watching = true;
    gulp.watch(srcCss, ["css"]);
    gulp.watch(srcScss, ["scss"]);
    gulp.watch(srcJs, ["js"]);
    gulp.watch(srcStatic, ["static", reload]);
    gulp.start("appJs");
});

gulp.task('default', function () {
    console.log('Run "gulp watch or gulp build"');
});
