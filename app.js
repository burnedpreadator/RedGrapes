const express = require('express')
      app =  express();
      nodemailer = require('nodemailer')


const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + 'Home');
  res.render('Home');
});
app.post('/', (req, res) => {
  console.log(req.body)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'chhariavikram1@gmail.com',
      pass: 'vikra1@M$'
    }
  })
  const mailOptions = {
    form: req.body.email,
    to: 'chhariavikram1@gmail.com',
    subject: `message from ${req.body.company}: ${req.body.email}`,
    html: `<h2>from: ${req.body.company}</h2></br>
            <h2>${req.body.projectdesc}</h2></br>
            <h2>Budget: ${req.body.selected}/Timeline: ${req.body.Timeline}</h2>
            <h2>phone no: ${req.body.phone}</h2></br>
            <h2>phone no: ${req.body.website}</h2></br>`
  }

  transporter.sendMail(mailOptions, (error, info)=>{
      if(error){
        console.log(error);
        res.send('error');        
      }
      else{
        console.log('Email sent' + info.response);
        res.send('success');
      }
  })
});

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

app.get("/about", (req, res)=> {
  res.render('about');
})

app.get("/Contact", (req, res)=> {
  res.render('Contact');
})
app.get("/Work", (req, res)=> {
  res.render('Work');
})


app.listen(3000, (error) => {
    console.log("app started");
})