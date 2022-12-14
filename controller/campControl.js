const Campground = require("../model/CampSchema")
const cloudinary = require('cloudinary').v2;
const mbxToken = process.env.MAPBOX_TOKEN;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoding = mbxGeocoding({ accessToken: mbxToken });

module.exports.index = async (req, res) => {
    // const campLocation = Campground.find({})
    const camps = await Campground.find({}) 
    res.render("campground/camp", {camps})
}

module.exports.campgroundNewForm = async (req, res) => {
    res.render("campground/newcamp")
}

module.exports.campgroundCreateForm = async (req, res) => {
    const geoData = await geocoding.forwardGeocode({
        query: req.body.location,
        limit: 1
      }).send()
    const newCamps = new Campground(req.body)
    newCamps.geometry = geoData.body.features[0].geometry
    newCamps.owner = req.user._id
    newCamps.image = req.files.map(img=>({url: img.path, filename: img.filename }))
    if (newCamps.image.length > 3){
        req.flash("error", "Image must not exceed 3")
        res.redirect("/campground/new"); } else {
    await newCamps.save()
    console.log(newCamps)
    req.flash("success", "Successfully Created")
    res.redirect("/campground");
}
}
  
module.exports.campgroundById = async (req, res) => {
    const {id} = req.params
    const idCamps = await Campground.findById(id).populate({
        path :'reviews',
        populate : {
            path : 'owner'}
        }).populate('owner')
    if(!idCamps) {
        req.flash("error", "No campground found")
        res.redirect("/campground")
    }
    res.render("campground/show", {idCamps})
}

module.exports.campgroundEditForm = async (req, res, next) => {
    const {id} = req.params
    const idCamps = await Campground.findById(id)
    if(!idCamps){
        req.flash("error", "No campground found")
        res.render("/campground")
    }
    res.render("campground/editcamp" , {idCamps}) 
}

module.exports.campgroundUpdateForm = async (req, res) => {
    const {id} = req.params
    const editCamps = await Campground.findByIdAndUpdate(id, req.body)
    const img = req.files.map(img=>({url: img.path, filename: img.filename }))
    editCamps.image.push(...img)
    const geoData = await geocoding.forwardGeocode({
        query: req.body.location,
        limit: 1
      }).send()
    editCamps.geometry = geoData.body.features[0].geometry
    await editCamps.save()
    if(req.body.deleteImages){
    await editCamps.updateOne({ $pull:{ image : { filename: { $in : req.body.deleteImages}}}})
    for (let filename of req.body.deleteImages){
        await cloudinary.uploader.destroy(filename)
    }
    }
    req.flash("success", "Successfully Updated")
    res.redirect(`/campground/${id}`);
}

module.exports.campgroundDelete = async (req, res) => {
    const {id} = req.params
    await Campground.findByIdAndDelete(id)
    req.flash("deleted", "Campground deleted!")
    res.redirect("/campground");
}

