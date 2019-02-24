//boolean for saved, default false, onclick of save button, saved = true, populate
var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  title: String,
  body: String
 
});

// This creates our model from the above schema, using mongoose's model method
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Note model
module.exports = Comment;