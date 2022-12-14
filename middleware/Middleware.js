const { campgroundSchema, reviewSchema } = require('../utility/JoiSchema.js');
const Campground = require("../model/CampSchema")
const Review = require('../model/reviewSchema')
const ExpressError = require("../utility/ExpressError")

module.exports.isLogin = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnPage = req.originalUrl
        req.flash("error", "You are not login")
        return res.redirect("/login")
    } else {
        next()
    }
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    console.log(error)
    if (error) {
        const msg = error.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async(req, res, next)=>{
    const {id} = req.params
    const idCamps = await Campground.findById(id)
    if(!idCamps.owner.equals(req.user._id)){
        req.flash("error", "Sorry, You do not have permission to access")
        res.redirect(`/campground/${id}`)
    } else {
        next() }
}

module.exports.isReviewOwner = async(req, res, next)=>{
    const {id, reviewid} = req.params
    const review = await Review.findById(reviewid)
    if(!review.owner.equals(req.user._id)){
        req.flash("error", "Sorry, You do not have permission to access")
        res.redirect(`/campground/${id}`)
    } else {
    next() }
}
module.exports.reviewValid = async function (req,res,next){
    const {error} = reviewSchema.validate(req.body)
    if (error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else{
    next()
    }
}
