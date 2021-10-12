
const express = require('express')
const flash = require('connect-flash');
const rounter = express.Router()
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const campground = require('../controller/campground')
const Campground = require('../models/campground')
const {isLoggedIn,validateCampground, isAuthor} = require('../middleware');
const router = require('./user');
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({ storage })


rounter.get('/new',isLoggedIn, campground.newCampground)

rounter.route('/')
    .post(isLoggedIn, upload.array("image"),  catchAsync(campground.makeNewCampgroundForm))
    .get(catchAsync(campground.index))

//Form validation is commented out because it is affecting the import images using cloudinary 'validateCampground,'

rounter.route('/:id')
    .get(catchAsync(campground.getCampground))
    .put(isLoggedIn, isAuthor, upload.array("image"),  catchAsync(campground.editCampground))
    .delete(isLoggedIn,isAuthor, catchAsync(campground.deleteCampground))


rounter.get('/:id/edit',isLoggedIn,isAuthor, catchAsync(campground.editCampgroundForm))

rounter.get('/Makecampground',catchAsync(campground.makeCampground))


module.exports = rounter