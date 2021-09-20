var express = require("express");
const CarControllers = require("../controllers/CarControllers");
const reviewController = require("../controllers/reviewController");
var router = express.Router();

router.get("/", CarControllers.carList);
router.get("/:id", CarControllers.carDetails);
router.post("/", CarControllers.carStore);
router.put("/:id", CarControllers.carUpdate);
router.delete("/:id", CarControllers.carDelete);
// Reviews
router.post("/review/:id", reviewController.reviewStore); //id = id of car
router.put("/review/:id", reviewController.reviewUpdate); // id = id of review
router.delete("/review/:id", reviewController.reviewDelete); // id = id of review
module.exports = router;