'use strict';

var React = require('react');
var debug = require('debug')('react-accessible-form');
var http = require('http');
var url = require('url');
//var Actions = require('../../areas/shared/FormValidation/FormValidationActions');
var validator = require('./validation');
var formValidation = new validator();

function getFormData() {
    var form = arguments[0] === undefined ? {} : arguments[0];

    var formData = {
        postData: {},
        formData: {}
    };

    Object.keys(form).forEach(function (item) {
        if (form[item].name) {
            formData.formData[form[item].name] = {
                value: form[item].value,
                dataset: form[item].dataset
            };

            formData.postData[form[item].name] = form[item].value;
        }
    });

    return formData;
}

function getAllChildren(_x3) {
    var _again = true;

    _function: while (_again) {
        var element = _x3;
        arr = undefined;
        _again = false;

        if (element && element.props && element.props.children) {
            _x3 = element.props.children;
            _again = true;
            continue _function;
        } else if (Array.isArray(element)) {
            var arr = element.map(function (item) {
                if (item && item.props && item.props.children) {
                    return getAllChildren(item.props.children);
                }

                return item;
            });

            return arr;
        }

        return element;
    }
}

function flattenArray(arr) {
    if (Array.isArray(arr)) {
        return arr.reduce(function (a, b) {
            return a.concat(Array.isArray(b) ? flattenArray(b) : b);
        }, []);
    }

    return arr;
}

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
        customValidation: React.PropTypes.func,
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
            isSubmitting: false,
            reset: false,
            validation: {}
        };
    },
    _validate: function _validate() {
        var event = arguments[0] === undefined ? { target: {} } : arguments[0];

        var data = getFormData(event.target);
        var reactComponents = getAllChildren(this.props.children);
        var validationResults = formValidation.serverValidate(data.formData, reactComponents, this.props.customValidation, this.props.overrideValidation);

        if (validationResults.length) {
            return validationResults;
        } else if (this.props.action) {
            // Api call
            var urlData = url.parse(this.props.action);
            var _this = this;
            var post_req = http.request({
                method: this.props.method || 'POST',
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
                    var json = JSON.parse(str);
                    _this.setState({
                        validation: formValidation.getApiValidationResults(json, data.formData, reactComponents)
                    });
                });
            });

            post_req.write(data.postData);
            post_req.end();
            return {};
        }
    },
    _onSubmit: function _onSubmit(event) {
        var _this2 = this;

        event.preventDefault();

        if (this.state.isSubmitting) {
            debug('Form already submitted');
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
            validation: this.props.validation !== 'none' ? this._validate(event) : {}
        }, function () {
            // Run the parent onSubmit if it exists
            if (_this2.props.onSubmit) {
                debug('Running parent submit method');
                _this2.props.onSubmit(_this2);
            }
        });
    },
    _onReset: function _onReset() {
        this.setState({
            isSubmitting: false,
            isValid: false,
            errors: [],
            reset: true
        });
    },
    render: function render() {
        var _this3 = this;

        var children = React.Children.map(getAllChildren(this.props.children), function (child) {
            return React.cloneElement(child, {
                reset: _this3.state.reset,
                formValidation: _this3.state.reset ? {} : {
                    complete: true,
                    results: _this3.state.validation,
                    status: 'FormValidation ended'
                }
            });
        });

        return React.createElement('form', {
            id: this.props.id,
            className: this.props.formClassName,
            action: this.props.action,
            method: this.props.method,
            onSubmit: this._onSubmit,
            onReset: this._onReset,
            'data-is-valid': this.state.isValid,
            'data-is-submitting': this.state.isSubmitting,
            validationEvent: this.props.validationEvent
        }, children);
    }
});

module.exports = Form;