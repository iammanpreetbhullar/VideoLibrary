var express = require('express');
var router = express.Router();
const fs = require('fs');
router.post("/", function (req, res) {
    const directory = req.body.dir;
    const dir = `H:/${directory}`
    const files = fs.readdirSync(dir)
    let newArray = []
    
    for (const file of files) {
       // console.log(file)
        newArray.push({"movie":file})
    }
    res.send(newArray)
    //console.log(newArray);
});

module.exports = router;