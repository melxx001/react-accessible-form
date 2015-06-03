'use strict'

var argv = require('yargs').argv
process.env.DEBUG = (Boolean(argv.DEBUG) === true) ? "react-accessible-forms:*" : ""

var gulp = require('gulp')
var babel = require("gulp-babel")
var react = require("gulp-react")
var clean = require('gulp-clean')
var nodemon = require('gulp-nodemon')
var webpack = require('gulp-webpack')
var uglify = require('gulp-uglify')
var uglify = require('gulp-uglify')
var runSequence = require('run-sequence')
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin")
var debug = require('debug')("react-accessible-forms:gulp")

gulp.task('watch', () => {
  debug("Starting gulp watch")
  nodemon({
    script: './examples/app.js',
    "verbose": true,
  	env: {
      "NODE_ENV": "development",
  		"DEBUG": process.env.DEBUG
  	},
  	nodeArgs: [
  		'--debug=5858'
  	],
    ext: 'js jsx',
    "ignore": ["lib/*", "node_modules/*", "gulpfile.js", "*.json" , "examples/public/*"],
    stdout: true
  }).on('restart', () => {
    runSequence('webpack', 'clientjs', 'swagger')
  })
})

gulp.task('default', () => {
  debug("Default task...")
  runSequence('webpack', 'clientjs', 'swagger', 'watch')
})

gulp.task('swagger', () => {
  debug("Added swagger.json to public directory...")
  return gulp.src('examples/swagger.json')
    .pipe(gulp.dest('examples/public/'));
})

gulp.task('clientjs', () => {
  debug("Added clientjs.json to public directory...")
  /*return gulp.src('examples/client.js')
    .pipe(react())
    .pipe(babel())
    .pipe(gulp.dest('examples/public/'));*/
})

gulp.task("webpack", ['build'], function() {
    return gulp.src('lib/index.js')
        .pipe(webpack({
          resolve: {
            extensions: ['', '.js', ".jsx"]
          },
          entry: {
            index: "./lib/index.js",
            client: "./examples/client.jsx"
          },
          output: {
              path: __dirname + "/examples/public",
              filename: "[name]-bundle.js"
          },
          module: {
            loaders: [
              {test: /\.json$/, loader: "json-loader"},
              {test: /\.jsx$/, loader: "jsx-loader"}
            ],
            noParse: ".md,LICENSE"
          },
          plugins: [
            new CommonsChunkPlugin('common.js')
          ]
        }))
        //.pipe(uglify())
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