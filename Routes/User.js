const express = require('express');
const router = express.Router();
const passport = require("passport")

const User = require("../model/userSchema")


router.get("/signup", (req, res) => {
    res.render("account/register")
}) 

router.post("/signup", async (req, res, next) => {
    try {
    const { email, username, password } = req.body
    const newUser = new User({email, username})
    const regUser = await User.register(newUser, password)
    req.login(regUser, (err)=>{
        if (err){return next(err)} 
        else {
        req.flash('success', "Welcome to Yelp Camp")
        res.redirect("/campground")}
    })} catch (e){
    req.flash('error', e.message)
    res.redirect("/signup")
    }
})

router.get("/login", (req, res) => {
    res.render("account/login")
})

router.post("/login", passport.authenticate("local", {failureFlash : true, failureRedirect : "/login" }),(req, res) => {
    req.flash('success', `Welcome Back ${req.user.username}`)
    const redirectUrl = req.session.returnPage || "/campground"
    delete req.session.returnPage
    res.redirect(redirectUrl)
})

router.get("/logout", (req,res)=>{
    req.logout();
    req.flash("success", "Successfully Logout")
    res.redirect("/")
})
module.exports = router

