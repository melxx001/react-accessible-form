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
    script: './example/app.js',
    "verbose": true,
  	env: {
      "NODE_ENV": "development",
  		"DEBUG": process.env.DEBUG
  	},
  	nodeArgs: [
  		'--debug=5858'
  	],
    ext: 'js jsx',
    "ignore": ["lib/*", "node_modules/*", "gulpfile.js", "*.json" , "example/public/*", "example/build/*"],
    stdout: true
  }).on('restart', () => {
    runSequence('App', 'main', 'lib', 'swagger', 'swagger-tools')
  })
})

gulp.task('default', () => {
  debug("Default task...")
  runSequence('App', 'main', 'lib', 'swagger', 'swagger-tools', 'watch')
})

gulp.task("lib", ['clean-lib'], () => {
  debug("Build task...")
  return gulp.src("src/**")
    .pipe(react())
    .pipe(babel())
    .pipe(gulp.dest("lib"))
})

gulp.task('main', ['clean-public'], function () {
    gulp.src('example/app/main.jsx')
        /*.pipe(react())
        .pipe(babel())
        .pipe(gulp.dest('./example/public/'))*/

        .pipe(webpack({
          resolve: {
            extensions: ['', '.js', ".jsx"]
          },
          entry: {
            main: __dirname + "/example/app/main.jsx"
          },
          output: {
              path: __dirname + "/example/public",
              filename: "[name].js"
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
        .pipe(gulp.dest('example/public/'))

})

gulp.task("App", ['clean-build'], function() {
    debug("App task...")
    return gulp.src("example/app/components/App.jsx")
        .pipe(react())
        .pipe(babel())
        .pipe(gulp.dest('./example/build/'))
})

gulp.task('swagger', () => {
  debug("Added swagger.json to public directory...")
  return gulp.src('examples/swagger.json')
    .pipe(gulp.dest('example/public/'))
})

gulp.task('swagger-tools', () => {
  debug("Added swagger tools to public directory...")
  return gulp.src('swaggertools/swaggertools.js')
    .pipe(gulp.dest('example/public/'))
})

gulp.task('clean-public', () => {
  debug("Cleaning public directory...")
  return gulp.src('example/public/**', {read: false})
    .pipe(clean())
})

gulp.task('clean-build', () => {
  debug("Cleaning public directory...")
  return gulp.src('example/build/**', {read: false})
    .pipe(clean())
})

gulp.task('clean-lib', () => {
  debug("Cleaning lib directory...")
  return gulp.src('lib/**', {read: false})
    .pipe(clean())
})
