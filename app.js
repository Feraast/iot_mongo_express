// use the express module 
var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bodyParser = require('body-parser'); 
var path = require('path');

// Connect to the database  
mongoose.connect('mongodb://localhost:27017/images', 
    { useNewUrlParser: true, useUnifiedTopology: true }, err => { 
        console.log('connected') 
    }); 


// Create an app 
var app = express();


// Specify the port for the app to listen to. 
app.set('port', process.env.PORT || 1234);

// Needed to handle post requests.
app.use(bodyParser.urlencoded({ extended: false })) ;
app.use(bodyParser.json()) ;
  
// Load in our image model
// We can now access the methods of the model like adding, deleting, etc. by 
// using dot notation with imageModel

// Alternatively, we can create a new instance of an image by saying imagex = new imageModel
var imageModel = require('./db'); 
const { resolveSoa } = require('dns');


// We don't want duplicates over and over every time we run, so here every time we run our server,
// clear our the db
imageModel.deleteMany({},
    function (err) {
        if (err) {
            console.log("error  reading image q's");
        } else {
            console.log("deleted successfully");
        }
    }
)

// Create our first image
var image1 = new imageModel({ 
    
    name: "Keanu", 
    description: "Picture of Keanu", 
    image: { 
        data: fs.readFileSync(path.join(__dirname, './public/keanu.jpg')), 
        contentType: 'image/jpg'
    } 

});

// Create our second image
var image2 = new imageModel({ 
    name: "KLow", 
    description: "Picture of KLow", 
    image: { 
        data: fs.readFileSync(path.join(__dirname, './public/Klow.jpeg')), 
        contentType: 'image/jpeg'
    } 
});

// Save them to our database
image1.save(function (err) {
    if (err) return handleError(err); // saved!
 });


image2.save(function (err) {
   if (err) return handleError(err); // saved!
});

// Retrieving the image 
app.get('/', (req, res) => { 
    imageModel.find({}, (err, items) => { 
        if (err) { 
            console.log(err); 
        } 
        else { 

            htmlString = "";

            items.forEach(function(element) {
                
                htmlString += "<h3>" + element.name + "</h3>";
                htmlString += "<h3>" + element.description + "</h3>";
                htmlString += "<img style = 'width: 200px; height: 200px' src='data:image/jpg;base64," + element.image.data.toString('base64') + "'</img>";
                htmlString +=  "<br><br>";
                htmlString += "<form method = 'GET' action='/result'>";
                htmlString += "<label for='name'>";
                htmlString += element.name;
                htmlString += "</label>";
                htmlString += "<input type='submit' value='";
                htmlString += element.name;
                htmlString += "' id='name' name='name'><br>";
                htmlString += "</form>";

            });

            // res.writeHead(200, { 'Content-Type': 'text/html' });
            res.send(htmlString);
        } 
    }); 
});


app.get('/result', (req,res) => {


    var wantedPic = req.query.name;
    var htmlString2 = "";
    console.log(wantedPic);

    imageModel.find(function(err, imgs)
    {
        if(err){
            console.log("error  reading images");
        } else
        {
            imgs.forEach(function(element){
                
               console.log(element.name);
                if (element.name === wantedPic){
                    htmlString2 += "<img style = 'width: 200px; height: 200px' src='data:image/jpg;base64," + element.image.data.toString('base64') + "'</img>";
                   res.send(htmlString2);
                    console.log("True");
                }

            });
        }

    }
)

});

// Uploading the image 
// app.post('/', upload.single('image'), (req, res, next) => { 
  
//     var obj = { 
//         name: req.body.name, 
//         description: req.body.desc, 
//         image: { 
//             data: fs.readFileSync(path.join(__dirname + '/public/' + req.file.filename)), 
//             contentType: 'image/png'
//         } 
//     } 
//     imgModel.create(obj, (err, item) => { 
//         if (err) { 
//             console.log(err); 
//         } 
//         else { 
//             // item.save(); 
//             res.redirect('/'); 
//         } 
//     }); 
// }); 


// launch 
app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});