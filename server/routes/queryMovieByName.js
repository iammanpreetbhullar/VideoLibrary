var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const fs = require('fs');
router.post("/", async function (req, res) {
    const movieName = req.body.title;
    const movieCategory = req.body.genre;
    MongoClient.connect(url, function (error, db) {
        if (error) throw error;
        var dbo = db.db("videoDb");

        var query = { title: movieName, genre: movieCategory };

        dbo.collection("movies").find(query).toArray(function (err, resp) {
            if (err) throw err;
            res.send(resp)
           // console.log(resp)
            db.close();

        });
    });
   
})

module.exports = router;