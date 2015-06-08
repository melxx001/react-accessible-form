var React = require('react')

var DefaultLayout = React.createClass({
  render: function() {
    return (
      <html>
        <head>
        	<title>Form Validation Tests</title>
        </head>
        <body>
          <h1>{this.props.title}</h1>
          <div id="content" dangerouslySetInnerHTML={{__html: this.props.content}}></div>
          <script src="/common.js"></script>
          <script src={"/" + this.props.client + ".js"}></script>
        </body>
      </html>
    )
  }
})

module.exports = DefaultLayout