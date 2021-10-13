const express = require("express"),
    router = express.Router(),
    session = require('express-session'),
    flash = require('connect-flash'),
    passport = require('passport'),
    sessionConfig = require('../models/sessionConfig');
    
router.use(session(sessionConfig));
router.use(flash());
router.use(passport.initialize());
router.use(passport.session());

router.use((req,res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
  })

router.get('/', function (req, res) {
    req.logout();
    req.flash('success', 'Sucessfully logged out');
    res.redirect('/');
});

module.exports = router;