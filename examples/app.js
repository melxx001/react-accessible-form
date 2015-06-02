'use strict'
var express = require('express')
var app = require('../lib/index.js')
var server = express()
// var swaggerTools = require('swagger-tools')
// var fs = require('fs')
// var path = require('path')
// var xml2js = require('xml2js')
/*var parser = new xml2js.Parser({
    explicitArray: false,
    mergeAttrs: true
})*/
var debug = require('debug')("react-accessible-forms:app")
server.use(express.static(__dirname + '/public'));
server.set('views', __dirname + '/views');
server.set('view engine', 'jsx');
server.engine('jsx', require('express-react-views').createEngine({ beautify: true }));


server.get("/", function(req, res) {
	var json = require(__dirname + '/swagger.json')
	res.render('index', json)
});

server.listen(2000)
console.log("Server is listening")
debug("Server is listening")