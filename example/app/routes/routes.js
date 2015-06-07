var React = require('react/addons')
var debug = require('debug')("react-accessible-forms:routes")

module.exports = function(app) {
	
	app.get('/', function(req, res){
		var App = require('../../build/components/App')
		var html = React.renderToStaticMarkup(React.createElement(App))
	    res.render('index', {content: html,  title: "Initial Test" })
	})

	app.get('/test1', function(req, res){
		var App = require('../../build/components/SwaggerFormApp')
		var html = React.renderToStaticMarkup(React.createElement(App))
	    res.render('swaggerform', {content: html, title: "Swagger 2.0 Based Validation" })
	})

	app.get('/test2', function(req, res){
		var App = require('../../build/components/BuildFormApp')
		var html = React.renderToStaticMarkup(React.createElement(App))
	    res.render('buildform', {content: html,  title: "Build form with swagger validation" })
	})

	app.get('/test3', function(req, res){
		var App = require('../../build/components/BuildAPIFormApp')
		var html = React.renderToStaticMarkup(React.createElement(App))
	    res.render('buildapiform', {content: html,  title: "Build form from api" })
	})

	/*app.get('/test4', function(req, res){
		var App = require('../../build/components/HelperFormApp')
		var html = React.renderToStaticMarkup(React.createElement(App))
	    res.render('helperform', {content: html,  title: "Object Generated form" })
	})*/

}