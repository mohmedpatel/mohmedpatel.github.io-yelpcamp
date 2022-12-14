if (process.env.NODE_ENV !== "production"){
    require("dotenv").config()
}
const dbUrl = process.env.DB_URL
const mongoose = require('mongoose');
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: :('));
db.once('open', function() {
 console.log('connected to mongoose');
});

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate")
const morgan = require('morgan')
const Joi = require('joi')
const session = require("express-session")
const MongoStore = require('connect-mongo')
const flash = require("connect-flash")
const LocalStrategy = require("passport-local")
const passport = require("passport")
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require("helmet");

// const cities = require("./seed/cities")
// const seedhelpers = require("./seed/seedhelpers");
const expressError = require("./utility/ExpressError")
const User = require("./model/userSchema.js")
const campRoutes = require("./Routes/Campground.js")
const reviewRoutes = require("./Routes/Review.js")
const signRoutes = require("./Routes/User.js")


app.engine("ejs", ejsMate)

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(morgan('tiny'));
app.use(flash())
app.use(
    mongoSanitize({
      replaceWith: '_sorrybadluck',
    }),
  );

const secret = process.env.SECRET || "donottellyoursecrettoanyone"
const store =  MongoStore.create({
    mongoUrl: dbUrl,
    secret})

store.on("error", function(e){
    console.log("SESSION STORE ERROR")
})
const sessionConfig = {
    name : "_session",
    secret,
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly : true,
        expires : Date.now() + 604800000,
        maxAge : 604800000
        // secure: true
    },
    store
}

app.use(session(sessionConfig))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req,res,next)=>{
    res.locals.signUser = req.user
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.deleted = req.flash("deleted")
    next()
})

app.get('/',(req, res) => {
    res.render("campground/home")
})
app.use("/campground", campRoutes)
app.use("/campground/:id", reviewRoutes)
app.use("/", signRoutes)

app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/da8iuzvkg/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.all('*', (req, res, next) => {
    next(new expressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    const goBack = req.originalUrl
    res.status(statusCode).render('error', { err, goBack })
})

const port = process.env.PORT || 3000
app.listen(port, (res,req) => {
    console.log(`listening on port ${port} ...`, "welcome :)");
})

