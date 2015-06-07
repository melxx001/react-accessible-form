var React = require('react/addons')
var debug = require('debug')("react-accessible-forms:routes")

module.exports = function(app) {
	app.get('/', function(req, res){
		var App = require('../../build/components/SwaggerFormApp')
		var html = React.renderToStaticMarkup(React.createElement(App))
	    res.render('swaggerform', {content: html, title: "Swagger 2.0 Based Validation" })
	})

	app.get('/test1', function(req, res){
		var App = require('../../build/components/App')
		var html = React.renderToStaticMarkup(React.createElement(App))
	    res.render('index', {content: html,  title: "Swagger 2.0 Based Validation" })
	})

	app.get('/test2', function(req, res){
		var App = require('../../build/components/BuildFormApp')
		var html = React.renderToStaticMarkup(React.createElement(App))
	    res.render('buildform', {content: html,  title: "Built form with validation" })
	})

	app.get('/test3', function(req, res){
		var App = require('../../build/components/BuildSwaggerFormApp')
		var html = React.renderToStaticMarkup(React.createElement(App))
	    res.render('buildswaggerform', {content: html,  title: "Swagger Built form with validation" })
	})

}