var React = require('react');
//var Actions = require('../../areas/shared/FormValidation/FormValidationActions');

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
        customValidation: React.PropTypes.func
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
            isSubmitting: false
        };
    },
    _validate: function( event ){
        //this.props.context.executeAction(Actions.storeFormValidation, { formChildren: this.props.children, formData: event.target });
    },
    _onSubmit: function( event ){
        event.preventDefault();

        /*this.setState({
            isSubmitting: true
        });*/

        if(this.props.validation !== 'none'){
            this._validate(event);
        }
    },
    render: function () { 
        return (
            <form 
                className = { this.props.formClassName }
                action = { this.props.action }
                method = { this.props.method }
                onChange = { this._onChange }
                onSubmit = { this._onSubmit }
                data-is-valid = { this.state.isValid }
                data-is-submitting = { this.state.isSubmitting }
                customValidation = { this.props.customValidation }
                validationEvent = { this.props.validationEvent }
            > 
                { this.props.children }
            </form>
        );
    }
});

module.exports = Form;
