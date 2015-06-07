'use strict'

var argv = require('yargs').argv
process.env.DEBUG = (Boolean(argv.DEBUG) === true) ? "react-accessible-forms:*" : ""

var gulp = require('gulp')
var babel = require("gulp-babel")
var react = require("gulp-react")
var clean = require('gulp-clean')
var nodemon = require('gulp-nodemon')
var webpack = require('webpack')
var runSequence = require('run-sequence')
var fs = require('fs')
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
    runSequence('lib', 'App', 'main')
  })
})

gulp.task('default', () => {
  debug("Default task...")
  runSequence('lib', 'App', 'main', 'watch')
})

gulp.task("lib", ['clean-lib'], () => {
  debug("Build task...")
  return gulp.src("src/**/*")
    .pipe(react())
    .pipe(babel())
    .pipe(gulp.dest("lib"))
})

gulp.task('main', ['clean-public'], function () {
    var filenames = fs.readdirSync("example/app/client/")
    var entries = {}

    filenames.map(function(file){
      entries[file.replace(".jsx", "")] = "./example/app/client/" + file
    })

    webpack({
          resolve: {
            extensions: ['', '.js', '.jsx']
          },
          entry: entries,
          output: {
              path: __dirname + '/example/public',
              filename: '[name]Client.js'
          },
          module: {
            loaders: [
              {test: /\.json$/, loader: 'json-loader'},
              {test: /\.js$/, loader: 'jsx-loader?harmony'}
            ]
          },
          plugins: [
            /*new webpack.optimize.UglifyJsPlugin({
                mangle: {
                    except: ['$super', '$', 'exports', 'require']
                },
                compress: {
                    warnings: false
                }
            }),
            new webpack.optimize.DedupePlugin(),*/
            new webpack.optimize.CommonsChunkPlugin('common','common.js')
          ]
        },function(err, stats){
          debug(err ? err : "no errors");
        })
})

gulp.task("App", ['clean-build'], function() {
    debug("App task...")
    return gulp.src("example/app/components/**")
        .pipe(react())
        .pipe(babel())
        .pipe(gulp.dest('./example/build/components'))
})

gulp.task('clean-public', () => {
  debug("Cleaning public directory...")
  return gulp.src('example/public/**/*', {read: false})
    .pipe(clean())
})

gulp.task('clean-build', () => {
  debug("Cleaning public directory...")
  return gulp.src('example/build/**/*', {read: false})
    .pipe(clean())
})

gulp.task('clean-lib', () => {
  debug("Cleaning lib directory...")
  return gulp.src('lib/**/*', {read: false})
    .pipe(clean())
})
