'use strict'
var express = require('express')
var app = require('../lib/index.js')
var React = require('react')
var debug = require('debug')("react-accessible-forms:app")
var server = express()
// var swaggerTools = require('swagger-tools')
// var fs = require('fs')
// var path = require('path')
// var xml2js = require('xml2js')
/*var parser = new xml2js.Parser({
    explicitArray: false,
    mergeAttrs: true
})*/
server.use(express.static(__dirname + '/public'));
//server.set('views', __dirname + '/views');
//server.set('view engine', 'jsx');
//server.engine('jsx', require('express-react-views').createEngine({ beautify: true }));

var layout = require("./build/layout")

server.get("/", function(req, res) {
	var json = require(__dirname + '/swagger.json')
	var page =  require("./build/client")
	debugger
	var html = "<!Doctype html>" + React.renderToStaticMarkup(
		React.createElement(layout, {
			// state: 'window.App = {}',
			content: React.renderToString(page({})),
			clientJs: "client.js",
			commonJs: "common.js"
		})
	)
	res.send(html)
})

debug("Server is listening")

server.listen(2000)