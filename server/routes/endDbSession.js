var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const fs = require('fs');
router.get("/", function (req, res)  {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.close();
        console.log("session closed");
    });
})

module.exports = router;