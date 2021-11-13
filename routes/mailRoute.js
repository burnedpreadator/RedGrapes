const express = require("express"),
    router = express.Router(),
    nodemailer = require('nodemailer');

router.get("/", (req, res)=> {
    res.render('Contact');
})

router.post('/', (req, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PW
        }
})
const mailOptions = {
    form: req.body.email,
    to: process.env.EMAIL,
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
    } else{
        res.send('success');
    }
})
});

module.exports = router;