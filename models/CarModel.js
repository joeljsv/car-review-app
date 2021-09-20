var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CarSchema = new Schema({
	name:{type: String, required: true},
	modelNo:{type: String, required: true},
	company:{type: String, required: true},
	category:{type: String, required: true},
	imageUrl:{type: String, required: true},
	power:{type: String, required: true},
	engineType:{type: String, required: true},
	seating:{type: String, required: true},
	fuelType:{type: String, required: true},
	torque:{type: String, required: true},
	price:{type: String, required: true},
	rating:{type: String, required: true},
	review:[{ type: Schema.ObjectId, ref: "Review"}],
	milage:{type: String, required: true},
	user: { type: Schema.ObjectId, ref: "User", required: true },
}, {timestamps: true});

module.exports = mongoose.model("Car", CarSchema);