var express = require('express');
var router = express.Router();
const fs = require('fs');
router.post("/", function (req, res) {
    const dirName = req.body.dirName;
    const releaseYear = req.body.releaseYear;
    const path = req.body.path;
    const fullPath = `h:/${path}/${dirName} - ${releaseYear}/`;
    console.log(fullPath)
    fs.readdir(fullPath, async function (err, files) {
        //handling error
        //console.log("files >>" + files.length)
        if (err) throw err;
        //listing all files using forEach
        try {
            const response = await Promise.all(files.map(function (file) {
                if (file != 'Thumbs.db') {
                    let fileExtension = file.slice(file.length - 3);
                    if (fileExtension != 'avi' || fileExtension != 'srt') {
                        res.send({
                            file
                        });
                    }
                    else {
                        res.send(JSON.stringify("not supported"));
                    }
                }
            }))
        } catch (error) {
            console.log(error)
        }
    });
});

module.exports = router;