var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/videoDb";

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
// });

var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("videoDb");


    //delete all entries whose id starts with letter 't'
    /*var myquery = { id: /^t/ };
    dbo.collection("movies").deleteMany(myquery, function (err, obj) {
        if (err) throw err;
        console.log(obj.result.n + " document(s) deleted");
        db.close();
    });*/
    dbo.collection("movies").find({}).toArray(function (err, resp) {
        if (err) throw err;
            //results = resp;
            console.log(resp);
            db.close();                
        
    });

   // var movieDetails = {imageUrl:"", releaseDate:{day:"",month:"",year:""}, caption:"", title:"", titleType:"" }
    //   dbo.createCollection("movies", function(err, res) {
    //     if (err) throw err;
    //     console.log("Collection created!");
    //     db.close();
    //   });
});