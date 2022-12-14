const express = require('express');
const router = express.Router();

const campgroundControl = require("../controller/campControl.js")
const catchError = require("../utility/catchError")
const {isLogin, validateCampground, isAuthor} = require("../middleware/Middleware")

const multer  = require('multer')
const {storage} = require("../cloud/cloud.js")
const upload = multer({ storage })


router.route('/')
        .get(catchError(campgroundControl.index))
        .post(isLogin, upload.array('image'), validateCampground, catchError(campgroundControl.campgroundCreateForm))
        

router.get('/new', isLogin, catchError(campgroundControl.campgroundNewForm))

router.route('/:id')
        .get(catchError(campgroundControl.campgroundById))
        .put(isLogin, isAuthor, upload.array('image'), validateCampground, catchError(campgroundControl.campgroundUpdateForm))
        .delete(isLogin, isAuthor, catchError(campgroundControl.campgroundDelete))

router.get('/:id/edit', isLogin, isAuthor, catchError(campgroundControl.campgroundEditForm))

module.exports = router


// app.get("/search", catchError(async (req, res) => {
//     const camps = await Campground.find({location : req.query.q}) 
//     res.redirect(`/campground/${camps[0]._id}`);
// }))