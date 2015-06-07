var React = require('react/addons')
var App = require('../../build/components/SwaggerformApp')
var debug = require('debug')("react-accessible-forms:routes")

module.exports = function(app) {

	app.get('/', function(req, res){
		var html = React.renderToStaticMarkup(React.createElement(App))
	    res.render('swaggerform', {content: html})
	})

}