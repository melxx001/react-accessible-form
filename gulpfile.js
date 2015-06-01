'use strict'

var gulp = require('gulp')
var babel = require("gulp-babel")
var react = require("gulp-react")
var clean = require('gulp-clean')
var nodemon = require('gulp-nodemon')
var webpack = require('gulp-webpack')
var runSequence = require('run-sequence');
var debug = require('debug')("react-accessible-forms:gulp")

gulp.task('watch', () => {
  debug("Starting gulp watch")
  nodemon({
    script: './examples/app.js',
    "verbose": true,
  	"env": {
  		"NODE_ENV": "development",
  		"NODE_DEBUG" : "react-accessible-forms:*"
  	},
  	nodeArgs: [
  		'--debug=5858'
  	],
    ext: 'js jsx',
    "ignore": ["lib/*", "node_modules/*", "gulpfile.js", "*.json" , "examples/public/*"],
    stdout: false
  }).on('restart', () => {
    runSequence('webpack', 'swagger')
  })
})

gulp.task('default', () => {
  debug("Default task...")
  runSequence('webpack', 'swagger', 'watch')
})

gulp.task('swagger', () => {
  debug("Added swagger.json to public directory...")
  return gulp.src('examples/swagger.json')
    .pipe(gulp.dest('examples/public/'));
})

gulp.task("webpack", ['build'], function() {
    return gulp.src('lib/index.js')
        .pipe(webpack({
          entry: "./lib",
          output: {
              path: __dirname + "/examples/public",
              filename: "bundle.js"
          }
        }))
        .pipe(gulp.dest('examples/public/'))
})

gulp.task("build", ['clean-lib', 'clean-public'], () => {
  debug("Build task...")
  return gulp.src("src/**")
    .pipe(react())
    .pipe(babel())
    .pipe(gulp.dest("lib"))
})

gulp.task('clean-lib', () => {
  debug("Cleaning lib directory...")
  return gulp.src('lib/**', {read: false})
    .pipe(clean());
})

gulp.task('clean-public', () => {
  debug("Cleaning public directory...")
  return gulp.src('examples/public/**', {read: false})
    .pipe(clean());
})