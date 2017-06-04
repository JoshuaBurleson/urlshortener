const express = require('express');
const mongo = require('mongodb').MongoClient;

var validate = require('./urlValidator')
var dbPath = 'mongodb://user:password@ds163181.mlab.com:63181/surltest';
var colTitle = 'urls';
var app = express();

mongo.connect(dbPath, function(err,db){
    console.log('in')
   if(err){throw err}
   var collection = db.collection(colTitle);
   collection.insert({_id : 'currentMax', value : 0});
   db.close();
});