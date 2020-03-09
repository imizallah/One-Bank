/* Importing Different Modules */

const { globalVariables } = require("./config/configuration");

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { mongoDbUrl, PORT } = require("./config/configuration");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const logger = require("morgan");
const MongoStore = require("connect-mongo")(session); //MongoDBSession Store

//Express Init
const app = express();

// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

// Configure Mongoose to Connect to MongoDB
mongoose.connect(mongoDbUrl, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(response => console.log(`RANNYSOFT CONNECTED AT: ${mongoDbUrl}`))
  .catch(err => console.log(`RANNYSOFT DATABASE ERROR: ${err.message}`));

/* Configure express*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// More Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express Validator Middleware
// app.use(expressValidator());

/*  Flash and Session*/
app.use(
  session({
    // Each request contains a unique cookie to identify the session
    secret: "anysadhjh*(gu*g6y82i7gGUguyihuiecret",
    saveUninitialized: true, //If set to true, This seesion will be saved on the server on each request no matter if something changed or not
    resave: true, //If set to true, This seesion will be saved on the server on each request no matter if something changed or not
    store: new MongoStore({ mongooseConnection: mongoose.connection }), //mongooseConnection tells it not to open a new connection on its own. Only to use the mongoose connection
    cookie: { maxAge: 3600000 } // The session  will last for 10 minutes [in miliseconds]
  })
);


/* Passport Initialize */
app.use(passport.initialize());
app.use(passport.session());

app.use(logger("dev"));
app.use(flash());

/* Use Global Variables */
app.use(globalVariables);

/* Setup View Engine To Use EJS */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/* Method Override Middleware*/
// app.use(methodOverride("_method"));

/* Routes */
const defaultRoutes = require("./routes/defaultRoutes");
const sterlingRoute = require("./routes/sterling");

 
app.use("/", defaultRoutes);
app.use("/sterling", sterlingRoute);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  let pageTitle = "Not found";
  res.render("error404", { pageTitle: pageTitle });
  next();
});

/* Start The Server */
app.listen(PORT, () => console.log(`SPEAK TO RANNY ON: ${PORT}`));
