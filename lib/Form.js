'use strict';

var React = require('react');
//var Actions = require('../../areas/shared/FormValidation/FormValidationActions');

var Form = React.createClass({ displayName: 'Form',
    propTypes: {
        schemaInfo: React.PropTypes.shape({
            schema: React.PropTypes.object.isRequired,
            definition: React.PropTypes.string.isRequired }),
        formData: React.PropTypes.oneOfType([React.PropTypes.arrayOf(React.PropTypes.element)
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
    getDefaultProps: function getDefaultProps() {
        return {
            method: 'POST',
            action: '',
            validationEvent: ''
        };
    },
    getInitialState: function getInitialState() {
        return {
            errors: [],
            isValid: false,
            isSubmitting: false
        };
    },
    _validate: function _validate(event) {},
    _onSubmit: function _onSubmit(event) {
        var _this = this;

        event.preventDefault();

        if (this.state.isSubmitting) {
            return;
        }

        // This is because event.target is null when
        // doing var evt = event;
        var evt = { target: event.target };

        this.setState({
            isSubmitting: true,
            isValid: false,
            errors: []
        }, function () {
            if (_this.props.validation !== 'none') {
                _this._validate(evt);
            }

            // Run the parent onSubmit if it exists
            if (_this.props.onSubmit) {
                _this.props.onSubmit(_this);
            }
        });
    },
    _getStoreData: function _getStoreData() {
        var formValidationStore = this.props.context.getStore('FormValidationStore');
        if (formValidationStore && formValidationStore.data) {
            return formValidationStore.data;
        }

        return null;
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        var formValidationStore = this._getStoreData();
        if (formValidationStore && formValidationStore.complete) {
            var results = formValidationStore.results;

            this.setState({
                isSubmitting: false,
                isValid: results && results.length ? false : true,
                errors: results
            });
        }
    },
    render: function render() {
        var formValidationStore = this._getStoreData();
        var children = React.Children.map(this.props.children, function (child) {
            return React.cloneElement(child, { formValidation: formValidationStore });
        });

        return React.createElement('form', {
            id: this.props.id,
            className: this.props.formClassName,
            action: this.props.action,
            method: this.props.method,
            onSubmit: this._onSubmit,
            'data-is-valid': this.state.isValid,
            'data-is-submitting': this.state.isSubmitting,
            validationEvent: this.props.validationEvent
        }, children);
    }
});

module.exports = Form;

/*this.props.context.executeAction(Actions.storeFormValidation, { 
    formChildren: this.props.children,
    formData: event.target,
    overrideValidation: this.props.overrideValidation
});*/