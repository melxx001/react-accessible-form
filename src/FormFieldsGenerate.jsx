var React = require('react');
var debug = require('debug')('react-accessible-form:generate');
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

var GenerateFormFields = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired
    },
    _getData: function( definitions ){
        var formFields = [];

        if( definitions ){
            definitions.sort( ( a, b ) => {
                if (a.sequence > b.sequence) {
                    return 1;
                }

                if (a.sequence < b.sequence) {
                    return -1;
                }

                return 0;
            }).forEach( ( fieldInfo, i ) => {
                var ctrlType = fieldInfo.ctrlType.toLowerCase();
                if( fieldInfo.pattern ){
                    fieldInfo['validationPattern'] = fieldInfo.pattern;
                }

                formFields.push(
                    FormFieldTypes[ctrlType](fieldInfo, i)
                )
            });
        }

        return formFields;
    },
    getDefaultProps: function(){
        return {
            data: {
                formDef: []
            }
        };
    },
    render: function() {
        var formFields = this._getData( this.props.data.formDef );

        return (
            <div>
                { formFields } 
            </div>
        );
    }
});

module.exports = GenerateFormFields;
