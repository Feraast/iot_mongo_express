// need the mongoose module
const mongoose = require('mongoose');
const fs = require('fs');

// localhost:27017 is where mongo service is running 
// Connect to the database
mongoose.connect('mongodb://localhost:27017/images', {useNewUrlParser: true, useUnifiedTopology: true});

// we create a schema first 
const imageSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: 
    { 
        data: Buffer, 
        contentType: String 
    } 
})

// we create a collection called imageModel with the imageSchema
module.exports = new mongoose.model('imageModel', imageSchema); 

