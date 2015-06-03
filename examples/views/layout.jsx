var React = require('react');

var DefaultLayout = React.createClass({
  render: function() {
    return (
      <html>
        <head>
        	<title>Form Test</title>
        </head>
        <body>
          <div id="content" dangerouslySetInnerHTML={{__html: this.props.content}}></div>
          <script src="/common.js"></script>
          <script src="/index-bundle.js"></script>
          <script src="/client-bundle.js"></script>
        </body>
      </html>
    );
  }
});

module.exports = DefaultLayout;