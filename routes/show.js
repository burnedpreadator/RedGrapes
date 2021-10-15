const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const multer = require("multer");
const Work = require('../models/show');
const {storage} = require('../cloudinary')
const session = require('express-session')
const flash = require('connect-flash')
const sessionConfig = require('../models/sessionConfig');

router.use(session(sessionConfig));
router.use(flash());

const fileFilter = (req, file, cb) => {
    //reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpeg'){
        cb(null, true);
    }else{
        cb(null, false);
    }
};

const upload = multer({
    storage: storage, 
    limits:{
        fileSize: 1024*1024*5
    },
    fileFilter: fileFilter
});


router.get('/', async(req,res,next) => {
    Work.find({}, function(err, allWork) {
            if(err){
                console.log(err);
            }else{
                res.render('show', {work: allWork});
            }
        })
});

router.post('/', upload.single('workImage'), (req,res,next) => {
    const work = new Work({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        desc: req.body.desc,
        workImage: req.file.path
    });
    work.save()
        .then(result => {
            if (result) {
                req.flash('success', 'Successfully added a new work');
                res.redirect('/admin');
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});
router.get("/:workId", (req, res, next) =>{
    const id = req.params.workId;
    Work.findById(id)
        .select('title desc _id workImage')
        .exec()
        .then(doc => {
            console.log("From Database",doc);
            if(doc){
                res.status(200).json({
                    work: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/show/'
                }
                });
            } else{
                res.status(404).json({message: 'No valid entry found for work Id'});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});
router.patch("/:workId", (req,res, next) => {
    const id = req.params.workId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    }
    Work.updateOne({_id: id}, { $set: updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'work updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/show/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});
router.delete("/:workId", (req, res, next) => {  
    const id = req.params.workId;

    Work.deleteOne({_id: id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'work deleted',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/show',
                    body: {title: 'String', desc: 'String'}
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
})

module.exports = router;