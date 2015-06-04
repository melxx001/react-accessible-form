var React = require('react/addons')
var App = require('../../build/App')
var debug = require('debug')("react-accessible-forms:routes")

module.exports = function(app) {

	app.get('/', function(req, res){
		var html = React.renderToStaticMarkup(React.createElement(App))
		debug("Getting '/'... html: ", html)
	    res.render('index', {content: html})
	})

}