var React = require('react/addons');
var App = require('../build/App');
window.React = React
var mountNode = document.getElementById("content");

React.render(React.createElement(App), mountNode);
