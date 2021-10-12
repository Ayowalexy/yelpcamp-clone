const express = require('express')
const Review = require('../models/review')
const rounter = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campground')
const ExpressError = require('../utils/ExpressError')
const { reviewSchema } = require('../schemas');
const review = require('../controller/review')
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')


rounter.delete('/:reviewId',isLoggedIn, isReviewAuthor, catchAsync(review.deleteReview))

rounter.post('/',isLoggedIn, validateReview, catchAsync(review.createReview))


module.exports = rounter