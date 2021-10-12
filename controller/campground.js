const Campground = require('../models/campground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mbxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({accessToken: mbxToken})
const {cloudinary} = require('../cloudinary/index')

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}

module.exports.newCampground = (req, res) => {
    res.render('campgrounds/new')  
  }

  module.exports.makeNewCampgroundForm = async (req, res) => {
    const geodata = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground)
    campground.geometry = geodata.body.features[0].geometry
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.author = req.user._id
    await campground.save();
    console.log(campground)
    req.flash('success', 'succesfully created a new Campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.getCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if(!campground){
        req.flash('error', 'cannot find that campground')
        return res.redirect('/campgrounds')
    }
 
    res.render('campgrounds/show', { campground })
    
}

module.exports.editCampgroundForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'cannot Find that campground');
       return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}

module.exports.makeCampground = async (req, res) => {
    const camp = new Campground({title: 'First'})
    await camp.save()
    res.send(camp)
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
 
    const campground = await Campground.findById(id)
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/campgrounds/${id}`)
    }
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
    camp.images.push(...imgs)
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull: { images : { filename : { $in: req.body.deleteImages}}}})
    }
    
    await camp.save()
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}