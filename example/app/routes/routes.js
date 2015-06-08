var React = require('react/addons')
var debug = require('debug')("react-accessible-forms:routes")

module.exports = function(app) {
	
	app.get('/', function(req, res){
		var App = require('../../build/components/Index')
		var html = React.renderToStaticMarkup(React.createElement(App))
	    res.render('Index', {content: html,  title: "Initial Test" })
	})

	app.get('/test1', function(req, res){
		var App = require('../../build/components/SwaggerValidationForm')
		var html = React.renderToStaticMarkup(React.createElement(App))
	    res.render('SwaggerValidationForm', {content: html, title: "Form with Swagger 2.0 Based Validation" })
	})

	app.get('/test2', function(req, res){
		var App = require('../../build/components/BuildSwaggerForm')
		var html = React.renderToStaticMarkup(React.createElement(App))
	    res.render('BuildSwaggerForm', {content: html,  title: "Build form from Swagger Schema with swagger validation" })
	})

	app.get('/test3', function(req, res){
		var App = require('../../build/components/BuildJSONSchemaForm')
		var html = React.renderToStaticMarkup(React.createElement(App))
	    res.render('BuildJSONSchemaForm', {content: html,  title: "Build form from JSON Schema with regular validation" })
	})

	/*app.get('/test4', function(req, res){
		var App = require('../../build/components/HelperFormApp')
		var html = React.renderToStaticMarkup(React.createElement(App))
	    res.render('helperform', {content: html,  title: "Object Generated form" })
	})*/

}