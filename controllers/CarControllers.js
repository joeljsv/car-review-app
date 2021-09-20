const { body, validationResult } = require("express-validator");
//helper file to prepare responses.
const apiResponse = require("../helpers/apiResponse");
var mongoose = require("mongoose");
const Car = require("../models/CarModel");
const auth = require("../middlewares/jwt");

function CarData(data) {
	this.id = data._id;
	this.name = data.name;
	this.modelNo = data.modelNo;
	this.company = data.company;
	this.category = data.category;
	this.imageUrl = data.imageUrl;
	this.power = data.power;
	this.engineType = data.engineType;
	this.seating = data.seating;
	this.fuelType = data.fuelType;
	this.torque = data.torque;
	this.price = data.price;
	this.rating = data.rating;
	this.review = data.review;
	this.milage = data.milage;
	this.user = data.user;
}


/**
 * Cars List.
 * 
 * @returns {Object}
 */
exports.carList = [
	// auth,
	function (req, res) {
		try {
			// console.log(req.user.isAdmin)
			Car.find().then((cars) => {
				if (cars.length > 0) {
					return apiResponse.successResponseWithData(res, "Operation success", cars);
				} else {
					return apiResponse.successResponseWithData(res, "Operation success", []);
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];


/**
 * car Detail.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.carDetails = [
	auth,
	function (req, res) {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return apiResponse.successResponseWithData(res, "Operation success", {});
		}
		try {
			Car.findOne({ _id: req.params.id }).populate("review").then((car) => {
				if (car !== null) {
					let carData = new CarData(car);
					return apiResponse.successResponseWithData(res, "Operation success", carData);
				} else {
					return apiResponse.successResponseWithData(res, "Operation success", {});
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];


/**
 * Car create.
 * 
 * @param {string} 		name
 * @param {string} 		modelNo
 * @param {string} 		company
 * @param {string} 		category
 * @param {string} 		imageUrl
 * @param {string} 		power
 * @param {string} 		engineType
 * @param {string} 		seating
 * @param {string} 		fuelType
 * @param {string} 		torque
 * @param {string} 		price
 * @param {string} 		rating
 * @param {string} 		milage
 * 
 * @returns {Object}
 */
exports.carStore = [
	auth,
	body("name", "name must not be empty.").isLength({ min: 1 }).trim(),
	body("modelNo", "modelNo must not be empty.").isLength({ min: 1 }).trim(),
	body("company", "company must not be empty.").isLength({ min: 1 }).trim(),
	body("category", "category must not be empty.").isLength({ min: 1 }).trim(),
	body("imageUrl", "imageUrl must not be invalid URL").isURL(),
	body("power", "power must not be empty.").isLength({ min: 1 }).trim(),
	body("engineType", "engineType must not be empty.").isLength({ min: 1 }).trim(),
	body("seating", "seating must not be empty.").isLength({ min: 1 }).trim(),
	body("fuelType", "fuelType must not be empty.").isLength({ min: 1 }).trim(),
	body("torque", "torque must not be empty.").isLength({ min: 1 }).trim(),
	body("price", "price must not be empty.").isLength({ min: 1 }).trim(),
	body("rating", "rating must not be empty.").isLength({ min: 1 }).trim(),
	body("milage", "milage must not be empty.").isLength({ min: 1 }).trim(),
	body("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var car = new Car(
				{
					name: req.body.name,
					modelNo: req.body.modelNo,
					company: req.body.company,
					category: req.body.category,
					imageUrl : req.body.imageUrl.toString().replace(/&#x2F;/gi, "/"),
					power: req.body.power,
					engineType: req.body.engineType,
					seating: req.body.seating,
					fuelType: req.body.fuelType,
					torque: req.body.torque,
					price: req.body.price,
					rating: req.body.rating,
					milage: req.body.milage,
					user:req.user._id,
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				//Save Car.
				car.save(function (err) {
					if (err) { return apiResponse.ErrorResponse(res, err); }
					let carData = new CarData(car);
					return apiResponse.successResponseWithData(res, "Car add Success.", carData);
				});
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Car update.
 * 
 * @param {string} 		name
 * @param {string} 		modelNo
 * @param {string} 		company
 * @param {string} 		category
 * @param {string} 		imageUrl
 * @param {string} 		power
 * @param {string} 		engineType
 * @param {string} 		seating
 * @param {string} 		fuelType
 * @param {string} 		torque
 * @param {string} 		price
 * @param {string} 		rating
 * @param {string} 		milage
 * 
 * @returns {Object}
 */
exports.carUpdate = [
	auth,
	body("name", "name must not be empty.").isLength({ min: 1 }).trim(),
	body("modelNo", "modelNo must not be empty.").isLength({ min: 1 }).trim(),
	body("company", "company must not be empty.").isLength({ min: 1 }).trim(),
	body("category", "category must not be empty.").isLength({ min: 1 }).trim(),
	body("imageUrl", "imageUrl must not be invalid URL").isURL(),
	body("power", "power must not be empty.").isLength({ min: 1 }).trim(),
	body("engineType", "engineType must not be empty.").isLength({ min: 1 }).trim(),
	body("seating", "seating must not be empty.").isLength({ min: 1 }).trim(),
	body("fuelType", "fuelType must not be empty.").isLength({ min: 1 }).trim(),
	body("torque", "torque must not be empty.").isLength({ min: 1 }).trim(),
	body("price", "price must not be empty.").isLength({ min: 1 }).trim(),
	body("rating", "rating must not be empty.").isLength({ min: 1 }).trim(),
	body("milage", "milage must not be empty.").isLength({ min: 1 }).trim(),
	body("*").escape(),
	(req, res) => {
		try {
			console.log(req.body.imageUrl);
			const errors = validationResult(req);
			var car = new Car(
				{ 	name: req.body.name,
					modelNo: req.body.modelNo,
					company: req.body.company,
					category: req.body.category,
					imageUrl : req.body.imageUrl.toString().replace(/&#x2F;/gi, "/"),
					power: req.body.power,
					engineType: req.body.engineType,
					seating: req.body.seating,
					fuelType: req.body.fuelType,
					torque: req.body.torque,
					price: req.body.price,
					rating: req.body.rating,
					milage: req.body.milage,
					_id:req.params.id,
					user:req.user._id,
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				}else{
					Car.findById(req.params.id, function (err, founCar) {
						if(founCar === null){
							return apiResponse.notFoundResponse(res,"Car not exists with this id");
						}else{
							//Check authorized user
							if(founCar.user.toString() !== req.user._id){
								return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
							}
							else{
								//update Car.
								Car.findByIdAndUpdate(req.params.id, car, {},function (err) {
									if (err) { 
										return apiResponse.ErrorResponse(res, err); 
									}else{
										let carData = new CarData (car);
										return apiResponse.successResponseWithData(res,"Car update Success.", carData);
									}
								});
							}
						}
					});
				}
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Car Delete.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.carDelete = [
	auth,
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			Car.findById(req.params.id, function (err, carfound) {
				if(carfound === null){
					return apiResponse.notFoundResponse(res,"Car not exists with this id");
				}else{
					//Check authorized user
					if(carfound.user.toString() !== req.user._id){
						return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
					}else{
						//delete car.
						Car.findByIdAndRemove(req.params.id,function (err) {
							if (err) { 
								return apiResponse.ErrorResponse(res, err); 
							}else{
								return apiResponse.successResponse(res,"Car delete Success.");
							}
						});
					}
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];