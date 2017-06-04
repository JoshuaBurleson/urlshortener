const express = require('express');
const fs = require('fs');
var router = express.Router();

router.get('/',function(req, res){
    fs.readFile('./public/index.html','utf8',function(err,data){
        if(err){throw err}
        res.write(data);
        res.end();
    })
});

module.exports = router;