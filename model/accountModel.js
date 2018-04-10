var mongoose = require("mongoose");

var Schema = mongoose.Schema;

//Create the Account schema in MongoDb
var accSchema = new Schema({
  name: {type: String, required:true},
  email: {type: String, required:true},
  address: {type: String, required:true},
  phone: {type: String, required:true},
  owner: {type: String, required:true},
  created_at: {type: Date},
  updated_at: {type: Date}
});

accSchema.pre('save',function(next){
  if(!this.created_at){
  this.created_at = new Date();
  }

  this.updated_at = new Date();
  next();
});

module.exports = mongoose.model("Account",accSchema);
