if(process.env.NODE_ENV !=="production") {
  require('dotenv').config();
}

const express = require('express');
const app =  express();     
const mongoose = require('mongoose');                    
const fs = require("fs");
const methodOverride = require("method-override");
const session = require('express-session')
const flash = require('connect-flash')
const ejsMate = require('ejs-mate')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/user')

require("./db/conn");
const { connect } = require('http2');
const showRoutes = require('./routes/show');
const mailRoutes = require('./routes/mailRoute');
const { getMaxListeners } = require('process');

app.use('ejs', ejsMate)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

const sessionConfig = { 
  secret: 'thisshouldbeabettersecret!', 
  resave: false, 
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 *60 *24 * 7,
    maxAge: 1000 * 60 *60 *24 * 7
  }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req,res, next) => {
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



function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('/login');
}
function isLoggedOut(req, res, next) {
	if (!req.isAuthenticated()) return next();
  req.flash('error', 'need to log out first');
	res.redirect('/admin');
}


app.get('/login',isLoggedOut, (req, res) => {
	const response = {
		title: "Login",
		error: req.query.error
	}

	res.render('login', response);
});
app.post('/login', passport.authenticate('local', {
  failureRedirect: '/login?error=true'
}), (req, res) => {
    req.flash('success', 'Successfully logged in');
    res.redirect('/admin');
});

app.get('/logout', function (req, res) {
	req.logout();
  req.flash('success', 'Sucessfully logged out');
	res.redirect('/');
});


app.get('/setup', async (req, res) => {
	const exists = await User.exists({ username: ADMIN_USERNAME });

	if (exists) {
		res.redirect('/login');
		return;
	};

	bcrypt.genSalt(8, function (err, salt) {
		if (err) return next(err);
		bcrypt.hash(ADMIN_KEY, salt, function (err, hash) {
			if (err) return next(err);
			
			const newAdmin = new User({
				username: ADMIN_USERNAME,
				password: hash
			});

			newAdmin.save();

			res.redirect('/login');
		});
	});
});


//routes
app.use('/', mailRoutes);
app.use('/show', showRoutes);

//other routes

app.get("/about", (req, res)=> {
  res.render('about');
})

app.get("/Contact", (req, res)=> {
  res.render('Contact');
})
app.get("/Work", (req, res)=> {
  res.render('Work');
})
app.get("/admin", isLoggedIn, (req, res) => {
  res.render('Admin', { title: "Admin" });
})


//video routes
//video routes
//video routes

app.get("/video", function (req, res) {
    // Ensure there is a range given for the video
    const range = req.headers.range;
    if (!range) {
      res.status(400).send("Requires Range header");
    }
  
    // get video stats (about 61MB)
    const videoPath = "./public/videos/healthcare.mp4";
    const videoSize = fs.statSync("./public/videos/healthcare.mp4").size;
  
    // Parse Range
    // Example: "bytes=32324-"
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  
    // Create headers
    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };
  
    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);
  
    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });
  
    // Stream the video chunk to the client
    videoStream.pipe(res);
});
app.get("/bgvideo", function (req, res) {
    // Ensure there is a range given for the video
    const range = req.headers.range;
    if (!range) {
      res.status(400).send("Requires Range header");
    }
  
    // get video stats (about 61MB)
    const videoPath = "./public/videos/background.mp4";
    const videoSize = fs.statSync("./public/videos/background.mp4").size;
  
    // Parse Range
    // Example: "bytes=32324-"
    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  
    // Create headers
    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };
  
    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);
  
    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });
  
    // Stream the video chunk to the client
    videoStream.pipe(res);
});

app.use((req,res,next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 
              'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if(req.method === 'OPTIONS') {
    res.header('Access-Control-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.sendStatus(200).json({});
  }
  next();
})

const port = process.env.PORT || 3000;
app.listen(port, (error) => {
    console.log("app started");
})