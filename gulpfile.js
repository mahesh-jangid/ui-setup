var gulp = require("gulp");
var gulp_concat = require("gulp-concat");
var gulp_rename = require("gulp-rename");
var gulp_uglify = require("gulp-uglify");
var uglifycss = require("gulp-uglifycss");
var htmlreplace = require("gulp-html-replace");
var wait = require("gulp-wait");

var destDir = "./assets/";
var tempDir = "./temp/";
var production = "./production/";

gulp.task("js-uglify", function (cb) {
  return gulp
    .src([
      "./scripts/jquery-3.6.0.min.js",
      "./scripts/bootstrap.bundle.min.js",
      "./scripts/app.js",
    ]) //Use wildcards to select all files in a particular folder or be specific
    .pipe(gulp_concat("concat.js")) //this will concat all the files into concat.js
    .pipe(gulp.dest(tempDir)) //this will save concat.js in a temp directory defined above
    .pipe(gulp_rename("scripts.min.js")) //this will rename concat.js to uglify.js
    .pipe(gulp_uglify()) //this will uglify/minify uglify.js
    .pipe(gulp.dest(destDir)); //this will save uglify.js into destination Directory defined above
  cb();
});

//To Concat and Uglify all CSS files in a particular folder
gulp.task("css-uglify", function (cb) {
  gulp
    .src([
      "./css/bootstrap.min.css",
      "./css/themify-icons.css",
      "./css/styles.css",
    ]) //Use wildcards to select all files in a particular folder or be specific
    .pipe(gulp_concat("concat.css")) //this will concat all the source files into concat.css
    .pipe(gulp.dest(tempDir)) //this will save concat.css into a temp Directory
    .pipe(gulp_rename("styles.min.css")) //this will rename concat.css into uglify.css, but will not replace it yet.
    .pipe(
      uglifycss({
        maxLineLen: 0,
        uglyComments: true,
      })
    ) //uglify uglify.css file
    .pipe(gulp.dest(destDir)); //save uglify.css
  cb();
});

gulp.task("move-all-html-to-production", function () {
  return gulp.src("./*.html").pipe(gulp.dest(production)).pipe(wait(20000));
});

gulp.task("replace-css-js-links-to-builds", function (cb) {
  gulp
    .src("./production/*.html")
    .pipe(wait(2000))
    .pipe(
      htmlreplace({
        css: "./assets/styles.min.css",
        js: "./assets/scripts.min.js",
      })
    )
    .pipe(gulp.dest("./production/"));
  cb();
});

gulp.task("move-assets-to-production", function (cb) {
  gulp
    .src("./assets/**/**/**/**/**/**/**/**/**/**/*", { base: "." })
    .pipe(gulp.dest(production));
  cb();
});

gulp.task("move-fonts-to-production", function (cb) {
  gulp.src("./fonts/*", { base: "." }).pipe(gulp.dest(production));
  cb();
});

gulp.task("move-other-required-files-to-production", function (cb) {
  gulp
    .src([
      "./browserconfig.xml",
      "./manifest.json",
      "./robots.txt",
      "./sitemap.xml",
    ])
    .pipe(gulp.dest(production));
  cb();
});

gulp.task(
  "build",
  gulp.series(
    "js-uglify",
    "css-uglify",
    "move-all-html-to-production",
    "replace-css-js-links-to-builds",
    "move-assets-to-production",
    "move-fonts-to-production",
    "move-other-required-files-to-production",
    function (cb) {
      cb();
    }
  )
);
