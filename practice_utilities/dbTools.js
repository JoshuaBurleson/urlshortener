const mongo = require('mongodb').MongoClient;

var dbPath = 'mongodb://localhost:27017/test';//data';
var colTitle = 'urls';



mongo.connect(dbPath, function(err, db){
    if(err){throw err}
    var connection = db.collection(colTitle);
    connection.remove({url : 'http://google.com'});
    connection.update({_id: 'currentMax'}, {value : 0});
    connection.find({}).toArray(function(err, data){
        if(err){throw err}
        console.log(data);
        db.close();
    });
})