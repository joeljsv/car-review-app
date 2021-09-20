var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ReviewSchema = new Schema({
	title: {type: String, required: true},
	description: {type: String, required: true},
	rating: {type: String, required: true, default:"0"},
	car: { type: Schema.ObjectId, ref: "Car", required: true },
	user: { type: Schema.ObjectId, ref: "User", required: true },
}, {timestamps: true});

module.exports = mongoose.model("Review", ReviewSchema);