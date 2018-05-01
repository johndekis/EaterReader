var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
 

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI); 
 
//console.log(MONGOD_URI);

var request = require("request");
var cheerio = require("cheerio");
var db = require("./models");

var PORT = process.env.PORT || 8080;


// Initialize Express
var app = express();
var request = require('request');
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



//set up handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


// Routes
//==============================================================================

// Home page render
app.get("/", function(req, res){
  db.Article.find({})
  .then(function(dbArticles) {
    var hbsObject = {
      articles: dbArticles
    }
    //console.log(hbsObject);
    
    res.render("index", hbsObject);
  })
  .catch(function(err) {
    
    res.json(err);
  });
});


// Saved page render
app.get("/saved", function(req, res){
  db.Article.find({})
  .then(function(dbArticles) {
    var hbsObject = {
      articles: dbArticles
    }
    console.log(hbsObject);
    res.render("saved", hbsObject);
  })
  .catch(function(err) {
    res.json(err);
  });
});


// A GET route for scraping the eater website
app.get("/scrape", function(req, res) {
       
        
  db.Article.find({}).then(savedArticles => {

    let savedTitles = savedArticles.map(article => article.title);
    

    request("http://www.eater.com/", function(error, response, html) {
      var $ = cheerio.load(html);  
      $("div.c-entry-box--compact__body").each(function(i, element) {             

        var newArticle = {};
      
        newArticle.title = $(this).children("h2").children("a").text();
        newArticle.link = $(this).children("h2").children("a").attr("href");
        newArticle.author = $(this).children("div").children("span").children("a").text();

        //console.log(newArticle.author);
        
        if(!savedTitles.includes(newArticle.title)){

          var entry = new db.Article(newArticle);
          //console.log(entry);
        } else {
          return
        }
              

      
          entry.save().then(function(data){
            console.log(data);
          })   
          
          .catch(function(err) {
          
          return res.json(err);
              }); //catch

          });    // cheerio loop
      
          res.send("Scrape Complete");

      });// request()

  });//second .then()
     
});// app.get()



app.get("/articles", function(req, res){
  db.Article.find({})
  .populate("comment")
  .then(function(dball){
    res.json(dball);
  })
});

  
  // Route for grabbing a specific Article by id, populate it with it's save
app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("comment")
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
});
  


// Route for saving/updating an Article's associated Comment
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Comment.create(req.body)
    .then(function(dbComment) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { comment:  dbComment._id}, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});



// Save an article
app.put("/articles/:id", function(req, res) {
  // Use the article id to find and update its saved boolean
  db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true})
  
  .then(function(err, doc) {
    // Log any errors
    if (err) {
      console.log(err);
    }
    else {
      
      window.location.reload();
    }
  });
});



// Delete an article
app.put("/articles/delete/:id", function(req, res) {
  // Use the article id to find and update its saved boolean
  db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false})
 
  .then(function(err, doc) {
    // Log any errors
    if (err) {
      console.log(err);
    }
    else {
      console.log(doc);
      // Or send the document to the browser
      res.redirect("/");
    }
  });
});


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
