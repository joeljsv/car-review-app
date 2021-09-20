const Review = require("../models/RevieModel");
const { body, validationResult } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
const auth = require("../middlewares/jwt");
var mongoose = require("mongoose");
const Car = require("../models/CarModel");

// Review Schema
function ReviewData(data) {
	this.id = data._id;
	this.title = data.title;
	this.description = data.description;
	this.rating = data.rating;
	this.car = data.car;
	this.user = data.user;
	this.createdAt = data.createdAt;
}

/**
 * Review List.
 * 
 * @returns {Object}
 */
exports.reviewList = [
	auth,
	function (req, res) {
		try {
			Review.find({},).populate("user").then((reviews) => {
				if (reviews.length > 0) {
					return apiResponse.successResponseWithData(res, "Operation success", reviews);
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
 * Review Detail.
 * 
 * @param {string}      id of Car
 * 
 * @returns {Object}
 */
exports.reviewDetail = [
	auth,
	function (req, res) {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return apiResponse.successResponseWithData(res, "Operation success", {});
		}
		try {
			Review.findOne({ _id: req.params.id, user: req.user._id }, "_id title description isbn createdAt").then((review) => {
				if (review !== null) {
					let reviewData = new ReviewData(review);
					return apiResponse.successResponseWithData(res, "Operation success", reviewData);
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
 * Review store.
 * 
 * @param {string}      title 
 * @param {string}      description
 * @param {string}      rating
 * 
 * @returns {Object}
 */
exports.reviewStore = [
	auth,
	body("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
	body("description", "Description must not be empty.").isLength({ min: 1 }).trim(),
	body("rating", "Rating must not be empty").isLength({ min: 1 }).trim(),
	body("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var review = new Review(
				{
					title: req.body.title,
					user: req.user._id,
					description: req.body.description,
					rating: req.body.rating,
					car: req.params.id, // id of the car
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				// Find car
				Car.findOne({ _id: req.params.id }, "review").then((carReviews) => {
					if (carReviews !== null) {
						var carReviewsData = carReviews.review;
						console.log(carReviewsData);
						//Save review.
						review.save(function (err) {
							if (err) { return apiResponse.ErrorResponse(res, err); }
							Car.findByIdAndUpdate(req.params.id,{$push: { review: review._id  }}).then(
								car=>{
									console.log(car);
									let reviewData = new ReviewData(review);
									return apiResponse.successResponseWithData(res, "Review add Success.", reviewData);
								}
							).catch(e=>{throw e;});
                        
						});
					} else {
						return apiResponse.notFoundResponse(res, "No Cars found with this id");
					}
				});

			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Review update.
 * 
 * @param {string}      title 
 * @param {string}      description
 * @param {string}      rating
 * 
 * @returns {Object}
 */
exports.reviewUpdate = [
	auth,
	body("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
	body("description", "Description must not be empty.").isLength({ min: 1 }).trim(),
	body("rating", "Rating must not be empty").isLength({ min: 1 }).trim(),
	body("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var review = new Review(
				{
					title: req.body.title,
					user: req.user._id,
					description: req.body.description,
					rating: req.body.rating,
					_id: req.params.id, // Id pf the review
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				} else {
					Review.findById(req.params.id, function (err, foundReview) {
						if (foundReview === null) {
							return apiResponse.notFoundResponse(res, "Review not exists with this id");
						} else {
							//Check authorized user
							if (foundReview.user.toString() !== req.user._id) {
								return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
							} else {
								//update review.
								Review.findByIdAndUpdate(req.params.id, review, {}, function (err) {
									if (err) {
										return apiResponse.ErrorResponse(res, err);
									} else {
										let reviewData = new ReviewData(review);
										return apiResponse.successResponseWithData(res, "Review update Success.", reviewData);
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
 * Review Delete.
 * 
 * @param {string}      id of the review
 * 
 * @returns {Object}
 */
exports.reviewDelete = [
	auth,
	function (req, res) {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			Review.findById(req.params.id, function (err, foundReview) {
				if (foundReview === null) {
					return apiResponse.notFoundResponse(res, "Review not exists with this id");
				} else {
					//Check authorized user
					if (foundReview.user.toString() !== req.user._id) {
						return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
					} else {

						// update Car
						Car.findByIdAndUpdate(foundReview.car,{$pull:{review:req.params.id}}).then(car=>{
							//delete review.
							Review.findByIdAndRemove(req.params.id, function (err) {
								if (err) {
									return apiResponse.ErrorResponse(res, err);
								} else {
									return apiResponse.successResponse(res, "Review delete Success. for "+ car.name);
								}
							});
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