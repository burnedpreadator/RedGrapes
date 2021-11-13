require('dotenv').config();
const express = require('express'),
      app =  express(),
      session = require('express-session'),
      flash = require('connect-flash'),
      ejsMate = require('ejs-mate'),
      showRoutes = require('./routes/show'),
      mailRoutes = require('./routes/mailRoute'),
      loginRoutes = require('./routes/loginRoute'),
      adminRoutes = require('./routes/adminRoute'),
      logoutRoutes = require('./routes/logoutRoute'),
      sessionConfig = require('./models/sessionConfig'),
      bgvideoRoute = require('./routes/videos/bgVideo'),
      videoRoute = require('./routes/videos/video'),
      Work = require('./models/show');

require("./db/conn");

app.use('ejs', ejsMate)
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({limit: '50mb'}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

app.use(session(sessionConfig));
app.use(flash());
app.use((req,res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

//routes
app.use('/Contact', mailRoutes);
app.use('/show', showRoutes);
app.use('/admin', adminRoutes);
app.use('/login', loginRoutes);
app.use('/logout', logoutRoutes);
app.use('/video', videoRoute);
app.use('/bgvideo', bgvideoRoute);

//other routes

app.get('/', async(req, res, next) => {
  Work.find({}, function(err, allWork) {
      if(err){
          console.log(err);
      }else{
          res.render('Home', {work: allWork});
      }
  });
});

app.get("/about", (req, res)=> {
  res.render('about');
})

app.get("/Contact", (req, res)=> {
  res.render('Contact');
})
app.get("/Work", (req, res)=> {
  res.render('Work');
})

const port = process.env.PORT || 3000;
app.listen(port, (error) => {
    console.log("app started");
})