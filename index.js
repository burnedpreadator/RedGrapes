if(process.env.NODE_ENV !=="production") {
  require('dotenv').config();
}
const express = require('express'),
      app =  express(),         
      fs = require("fs"),
      methodOverride = require("method-override"),
      session = require('express-session'),
      flash = require('connect-flash'),
      ejsMate = require('ejs-mate'),
      showRoutes = require('./routes/show'),
      mailRoutes = require('./routes/mailRoute'),
      loginRoutes = require('./routes/loginRoute'),
      adminRoutes = require('./routes/adminRoute')
      logoutRoutes = require('./routes/logoutRoute')
      sessionConfig = require('./models/sessionConfig');

require("./db/conn");

app.use('ejs', ejsMate)
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({limit: '50mb'}));
app.use(methodOverride('_method'));
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
app.use('/', mailRoutes);
app.use('/show', showRoutes);
app.use('/admin', adminRoutes);
app.use('/login', loginRoutes);
app.use('/logout', logoutRoutes);

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