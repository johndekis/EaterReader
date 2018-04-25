


app.get("/scrape", function(req, res) {
       
        
    db.Article.find({}).then(savedArticles => {
        let savedTitles = savedArticles.map(article => article.title)
    }).then(function(){

        let newArticleArr = [];

        request("http://www.eater.com/", function(error, response, html) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(html);
    
            // Now, we grab every h2 within an article tag, and do the following:
            $("h2.c-entry-box--compact__title").each(function(i, element) {
                // Save an empty result object
                let result = {};
                result.title = $(this).children("a").text();
                result.link = $(this).children("a").attr("href");
                
               if(!savedTitles.includes(result.title)){
                   newArticleArr.push(result);
               }

        // Create a new Article using the `newArticleArr` object built from scraping
            db.Article.create(newArticleArr)
                .then(function(results) {   //resultsssssss with an s
                    console.log(results);    
                    res.json({count: newArticleArr.length})

                    // View the added result in the console
                    //console.log(results);
            })
            .catch(function(err) {
            
            return res.json(err);
                }); //catch

            });    // cheerio loop
        
            res.send("Scrape Complete");

        });// request()

    });//second .then()
       
});// app.get()
  
