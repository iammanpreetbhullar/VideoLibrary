const express = require('express');
const router = express.Router();
const fs = require('fs');
var cmd=require('node-cmd');
var spawn = require('child_process').spawn, child;
const { stderr, stdout } = require('process');
const startServerScript =  "./httpServer.ps1";
router.get("/", async function (req, res) {
   child = spawn("powershell.exe", ["D:\\MyProjects\\React\\video-app\\server\\httpServer.ps1"]);
   child.stdout.on("data", function(data){
       console.log("data" + data)
    })
    child.stderr.on("data", function(data){
        console.log("stderr" + data)
   })
    child.on("exit", function(){
        console.log("Script finished");
   })
   child.stdin.end();
})

module.exports = router;