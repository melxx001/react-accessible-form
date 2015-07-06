var React = require('react');
var debug = require('debug')('react-accessible-form:schema');
var { Input, Select, CheckBox, Button } = require('./FormFields');

var FormFieldTypes = {
    edit: function(options, key){
        return <Input type="text" key={ 'gen' + key } id={ '__' + options.name } {...options} />
    },
    time: function(options, key){
        return <Input type="time" key={ 'gen' + key } id={ '__' + options.name } {...options} />
    },
    datetime: function(options, key){
        return <Input type="datetime" key={ 'gen' + key } id={ '__' + options.name } {...options} />
    },
    datetimelocal: function(options, key){
        return <Input type="datetime-local" key={ 'gen' + key } id={ '__' + options.name } {...options} />
    },
    date: function(options, key){
        return <Input type="date" key={ 'gen' + key } id={ '__' + options.name } {...options} />
    },
    email: function(options, key){
        return <Input type="email" key={ 'gen' + key } id={ '__' + options.name } {...options} />
    },
    password: function(options, key){
        return <Input type="password" key={ 'gen' + key } id={ '__' + options.name } {...options} />
    },
    hidden: function(options, key){
        return <Input type="hidden" key={ 'gen' + key } id={ '__' + options.name } {...options} />
    },
    image: function(options, key){
        return <Input type="image" key={ 'gen' + key } id={ '__' + options.name } {...options} />
    },
    number: function(options, key){
        return <Input type="text" key={ 'gen' + key } id={ '__' + options.name } {...options} />
    },
    checkbox: function(options, key){
        return <CheckBox key={ 'gen' + key } id={ '__' + options.name } {...options} />
    },
    telephone: function(options, key){
        return <Input type="tel" key={ 'gen' + key } id={ '__' + options.name } {...options} />
    },
    url: function(options, key){
        return <Input type="url" key={ 'gen' + key } id={ '__' + options.name } {...options} />
    },
    button: function(options, key){
        return <Button key={ 'gen' + key } id={ '__' + options.name } {...options} />
    },
    picklist: function(options, key){
        return <Select key={ 'gen' + key } id={ '__' + options.name } {...options} />
    }
};

var FormFieldsSchema = React.createClass({
    propTypes: {
        schema: React.PropTypes.object.isRequired,
        definition: React.PropTypes.string.isRequired
    },
    _getData: function(){
        var formFields = [];
        var schema = this.props.schema;

        if( !schema.definitions || !this.props.definition ){
            return [];
        }

        var elements = schema.definitions[ this.props.definition ];

        if( !( elements && elements.properties ) ) {
            return [];
        }

        var requiredField = elements.required || [];
        var properties = elements.properties;

        Object.keys( properties ).forEach( ( property ) => {
            var field = properties[ property ];
            var options = field;
            options = {
                label: property,
                name: property,
                options: ( field.enum ) ? field.enum.map(function( value ){
                    return [value, value ];
                }) : '',
                validationPattern: field.pattern
            };

            formFields.push(
                FormFieldTypes[ field.enum ? 'picklist' : 'edit' ]( options, property )
            );
        });

        return formFields;
    },
    getDefaultProps: function(){
        return {
            schema: {},
            definition: ''
        };
    },
    render: function() {
        var formFields = this._getData();

        return (
            <div>
                { formFields } 
            </div>
        );
    }
});

module.exports = FormFieldsSchema;
