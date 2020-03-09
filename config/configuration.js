module.exports = {
  mongoDbUrl: "mongodb://hackathon:imizallah1990@ds041367.mlab.com:41367/fsi",
  PORT: process.env.PORT || 7000,

  globalVariables: (req, res, next) => { 
    res.locals.success_message = req.flash("success-message");
    res.locals.error_message = req.flash("error-message");
    res.locals.messages = require("express-messages")(req, res);
    res.locals.isAuthenticated = req.user ? true : false;
    res.locals.currentUser = req.user ? true : false;
    res.locals.user = req.user || null;
    res.locals.session = req.session; //making the session available in the view
    next();
  }
};
