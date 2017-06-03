const express = require('express');
const mongo = require('mongodb').MongoClient;

var validate = require('./urlValidator')
var dbPath = '';
var colTitle = 'urls';
var app = express();

var anyURL = /./g;

app.get(anyURL,function(req, res){
    var site = req.url;
    /*if( ! validate(site)){
        res.end('Invalid');
    }else{res.end('Valid');}*/
    mongo.connect(dbPath,
    function(err, db){
        if(err){throw err};
        var collection = db.collection(colTitle);
        collection.find();
    }
    );
});

app.listen(process.env.PORT || 3000)