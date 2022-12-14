const express = require('express');
const router = express.Router({mergeParams : true});

const review = require("../controller/reviewControl.js")
const catchError = require("../utility/catchError")
const {reviewValid, isLogin, isReviewOwner} = require("../middleware/Middleware")

router.post('/review', isLogin, reviewValid, catchError(review.createReview))

router.delete('/review/:reviewid', isLogin, isReviewOwner, catchError(review.deleteReview))

module.exports = router