const express = require("express"),
    router = express.Router(),
    session = require('express-session'),
    flash = require('connect-flash'),
    passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
    bcrypt = require('bcrypt'),
    User = require('../models/user'),
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

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use(new localStrategy(function (username, password, done) {
	User.findOne({ username: username }, function (err, user) {
		if (err) return done(err);
		if (!user) return done(null, false, { message: 'Incorrect username.' });

		bcrypt.compare(password, user.password, function (err, res) {
			if (err) return done(err);
			if (res === false) return done(null, false, { message: 'Incorrect password.' });
			
			return done(null, user);
		});
	});
}));

function isLoggedOut(req, res, next) {
    if (!req.isAuthenticated()) return next();
    req.flash('error', 'need to log out first');
    res.redirect('/admin');
}


router.get('/',isLoggedOut, (req, res) => {
    const response = {
        title: "Login",
        error: req.query.error
    }

    res.render('login', response);
});
router.post('/', passport.authenticate('local', {
    failureRedirect: '/login?error=true'
}), (req, res) => {
    req.flash('success', 'Successfully logged in');
    res.redirect('/admin');
});



module.exports = router;