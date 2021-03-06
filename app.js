var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Plane  = require("./models/plane"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")
    
//requiring route
var commentRoutes    = require("./routes/comments"),
    planeRoutes = require("./routes/planes"),
    indexRoutes      = require("./routes/index");
 
var url = process.env.DATABASEURL || "mongodb://localhost/plane_geek_v3";
mongoose.connect(url);
// mongoose.connect("mongodb://macmcauley:euph9999@ds151544.mlab.com:51544/planegeek");
mongoose.Promise = global.Promise;


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/planes", planeRoutes);
app.use("/planes/:id/comments", commentRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
  console.log("The PlaneGeek Server Has Started!");
});