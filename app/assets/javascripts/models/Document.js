import { Model } from 'backbone';
import t from 'tcomb-form';
import _ from 'underscore';

export default class Document extends Model{

  constructor(data) {
    super(data);
  }

  get entityTypeName() {
    return 'Document';
  }

  setClient(client) {
    this.client = client;
  }

  getFieldPrefix(id){
    return (this.schema[id].prefix != undefined) ? this.schema[id].prefix + ':' + id : id;
  }

  getFieldData(id, props, data){
    return (data[this.getFieldPrefix(id)] != undefined || data[props.alias] != undefined) ? (data[this.getFieldPrefix(id)] || data[props.alias]) : data.properties[this.getFieldPrefix(id)];
  }

  getFormSchema(values) {
    var formFields = {};

    _.each(this.schema, (function(fieldProps, fieldId){
      if (fieldProps.editable == true){
       formFields[this.getFieldPrefix(fieldId)] = fieldProps.type; 
      }
    }).bind(this));

    return t.struct(formFields);
  }

  getFormSchemaDefaults() {

    var formFieldDefaults = {};

    _.each(this.schema, (function(fieldProps, fieldId){
      var id = this.getFieldPrefix(fieldId);
      if (fieldProps.editable == true){
       formFieldDefaults[id] = this.get(id);
      }
    }).bind(this));

    return formFieldDefaults;
  }
  
  getFormSchemaOptions() {

    var formSchemaOptions = {};

    _.each(this.schema, (function(fieldProps, fieldId){
      var id = this.getFieldPrefix(fieldId);

      if (fieldProps.editable == true){

        var fieldObj = {};

        if (this.schema[fieldId].label != undefined) {
          fieldObj['label'] = this.schema[fieldId].label;
        }

        if (this.schema[fieldId].displayType != undefined) {
          fieldObj['type'] = this.schema[fieldId].displayType;
        }

        formSchemaOptions[id] = fieldObj;
      }
    }).bind(this));

    return formSchemaOptions;
  }
}