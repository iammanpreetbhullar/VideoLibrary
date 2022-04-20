var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
router.post("/", function (req, res) {
    let details = req.body.details;
    let id = details.id;
    let imageUrl = details.primaryImage.url;
    let releaseDate = details.releaseDate.day + "/" + details.releaseDate.month + "/" + details.releaseDate.year;
    let title = details.titleText.text;
    let titleType = details.titleType.text;
    let caption = details.primaryImage.caption.plainText;
    let genre = req.body.genre;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("videoDb");
        var movieDetails = { id: id, imageUrl: imageUrl, releaseDate: releaseDate, caption: caption, title: title, titleType: titleType, genre: genre }
        dbo.collection("movies").insertOne(movieDetails, function (err, resp) {
            if (err) {
                res.send({ error: err, status: 500 })
            }
            res.send(resp);
            db.close();
            console.log("record inserted");
        });
    });
})
module.exports = router;