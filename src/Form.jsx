var React = require('react');
var debug = require('debug')('react-accessible-form');
var http = require( 'http' );
var url = require( 'url' );
//var Actions = require('../../areas/shared/FormValidation/FormValidationActions');
var validator = require( './validation' );
var formValidation = new validator();

function getFormData( form = {} ){
    var formData = {
        postData: {},
        formData: {}
    };

    Object.keys( form ).forEach( ( item ) => {
        if( form[ item ].name ){
            formData.formData[ form[ item ].name ] = {
                value: form[ item ].value,
                dataset: form[ item ].dataset
            };

            formData.postData[ form[ item ].name ] = form[ item ].value;
        }
    });

    return formData;
}

var Form = React.createClass({
    propTypes: {
        schemaInfo: React.PropTypes.shape({
            schema: React.PropTypes.object.isRequired,
            definition: React.PropTypes.string.isRequired,
        }),
        formData: React.PropTypes.oneOfType([
            React.PropTypes.arrayOf(React.PropTypes.element)
            /*,React.PropTypes.shape({
                widget: React.PropTypes.string,
                type: React.PropTypes.string,
                label: React.PropTypes.string,
                placeHolder: React.PropTypes.string,
                id: React.PropTypes.string 
            })*/
        ]),
        formClassName: React.PropTypes.string, 
        method: React.PropTypes.string, 
        action: React.PropTypes.string,
        validationEvent: React.PropTypes.string,
        overrideValidation: React.PropTypes.func
    },
    getDefaultProps: function() {
        return {
            method: 'POST', 
            action: '',
            validationEvent: ''
        };
    },
    getInitialState: function() {
        return {
            errors: [],
            isValid: false,
            isSubmitting: false,
            reset: false,
            validation: {}
        };
    },
    _validate: function( event = { target: {} } ){
        var data = getFormData( event.target );
        var reactComponents = this.props.children;
        var validationResults = formValidation.serverValidate(
            data.formData,
            this.props.children, 
            this.props.overrideValidation
        );

        if( validationResults.length ){
            return validationResults;
        }else if( this.props.action ){
            // Api call
            var urlData = url.parse(this.props.action);
            var _this = this;
            var post_req = http.request({
                method: this.props.method || "POST",
                hostname: urlData.action,
                port: urlData.port,
                path: urlData.path,
                protocol: urlData.protocol
            }, function (response) {
                var str = '';
                response.on('data', function (chunk) {
                    str += chunk;
                });

                response.on('end', function () {
                    var json = JSON.parse( str );
                    _this.setState({
                        validation: formValidation.getApiValidationResults( json, data.formData, reactComponents )
                    });
                });
                
            });

            post_req.write(data.postData);
            post_req.end();
            return {};
        }

    },
    _onSubmit: function( event ){
        event.preventDefault();

        if( this.state.isSubmitting ){
            debug( 'Form already submitted' );
            return;
        }

        // This is because event.target is null when
        // doing var evt = event;
        var evt = { target: event.target };

        this.setState({
            isSubmitting: true,
            reset: false,
            isValid: false,
            errors: [],
            validation: (this.props.validation !== 'none') ?  this._validate( event ) : {}
        }, () => {
            // Run the parent onSubmit if it exists
            if( this.props.onSubmit ){
                debug( 'Running parent submit method' );
                this.props.onSubmit( this );
            }
        });
    },
    _onReset: function(){
        this.setState({
            isSubmitting: false,
            isValid: false,
            errors: [],
            reset: true 
        });
    },
    render: function () {
        var children = React.Children.map( this.props.children, ( child ) => {
            return React.cloneElement( child, { 
                reset: this.state.reset, 
                formValidation: ( this.state.reset ) ? {} : {
                    complete: true,
                    results: this.state.validation,
                    status: "FormValidation ended"
                }
            });
        });

        return (
            <form
                id = { this.props.id }
                className = { this.props.formClassName }
                action = { this.props.action }
                method = { this.props.method }
                onSubmit = { this._onSubmit }
                onReset = { this._onReset }
                data-is-valid = { this.state.isValid }
                data-is-submitting = { this.state.isSubmitting }
                validationEvent = { this.props.validationEvent }
            >
                { children }
            </form>
        );
    }
});

module.exports = Form;
