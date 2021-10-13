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

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

router.get("/", isLoggedIn, (req, res) => {
      res.render('Admin', { title: "Admin" });
})


// router.get('/setup', async (req, res) => {
// 	const exists = await User.exists({ username: ADMIN_USERNAME });

// 	if (exists) {
// 		res.redirect('/login');
// 		return;
// 	};

// 	bcrypt.genSalt(8, function (err, salt) {
// 		if (err) return next(err);
// 		bcrypt.hash(ADMIN_KEY, salt, function (err, hash) {
// 			if (err) return next(err);
            
// 			const newAdmin = new User({
// 				username: ADMIN_USERNAME,
// 				password: hash
// 			});

// 			newAdmin.save();

// 			res.redirect('/login');
// 		});
// 	});
// });

module.exports = router;