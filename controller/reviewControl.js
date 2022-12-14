const Campground = require("../model/CampSchema")
const Review = require('../model/reviewSchema')

module.exports.createReview = async (req, res) => {
    const {id} = req.params
    const campReview = await Campground.findById(id)
    const review = await new Review(req.body)
    review.owner = req.user._id
    campReview.reviews.push(review)
    await campReview.save();
    await review.save()
    res.redirect(`/campground/${id}`)
}

module.exports.deleteReview = async (req, res)=>{
    const {id, reviewid} = req.params
    await Campground.findByIdAndUpdate(id, {$pull : {reviews : reviewid}})
    await Review.findByIdAndDelete(reviewid)
    res.redirect(`/campground/${id}`)
}