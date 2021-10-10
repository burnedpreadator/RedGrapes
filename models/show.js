const mongoose = require('mongoose');

const workSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {type: String, required: true},
    desc: {type: String},
    workImage: {type: String, required: true}
});

module.exports =  mongoose.model('Work', workSchema); 