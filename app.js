const express = require('express');
const mongo = require('mongodb').MongoClient;
const validate = require('./custom_modules/urlValidator');

var dbPath = process.env.MONGOLAB_URI;
var colTitle = 'urls';
var app = express();

app.use(require('./routes/index.js'));
app.get('*',function(req, res){
    var site = req.url.slice(1);
    var result;
    mongo.connect(dbPath,
        function(err, db){
            if(err){throw err}
            var collection = db.collection(colTitle);
            //check if shortened URL exists
            if(Number(site) > 0){
                collection.find({value: Number(site)}).toArray(
                    function(err,data){
                        if(err){throw err}
                        if(data[0] === undefined || data[0]._id == 'currentMax'){
                            res.end(JSON.stringify({error : 'ValueError: No such key:value pair exists. Please try another, search for the URL, or create a new shortened URL'}));
                            db.close();
                            return;
                        }
                        console.log('ATTEMPTING CONNECTION WITH: '+ data[0].url)
                        res.redirect(data[0].url);
                        res.end();
                        return;
                    });
            }
            else{
                collection.find({url : site}).toArray(function(err, data){
                    if(err)(console.log(err));
                    result = data;
                //check if no db entry exists
                if(result[0] === undefined){
                    //ensure url is properly formatted return error object if not
                    if( ! validate(site)){
                        res.end(JSON.stringify({error : "Improper URL format, please use the following format, note parenthesis denote optional portions http(s)://(subdomain i.e www.)domainName.something(:port)(/path)(?query)(#fragment)"}));
                        return; 
                    }
                    ///add new entry if none exists
                    ///check current highest number in DB
                    collection.find({_id : 'currentMax'}).toArray(function(err,data){
                        if(err){throw err}
                        var num = Number(data[0].value);
                        num += 1;
                        var newEntry = {url : site, value : num-1};
                        var displayObj = {original_url : newEntry.url, short_url : newEntry.value};
                        //add new entry w/ shortened URL as new num
                        collection.insert(newEntry);
                        collection.update({_id : 'currentMax'}, {value : num});
                        res.end(JSON.stringify(displayObj));
                        db.close();
                    });
                }else{
                //retrieve entry
                data = data[0];
                res.end(JSON.stringify({original_url : data.url, short_url : 'https://tin-url.herokuapp.com/'+data.value}));
                db.close();
                }   
            });
        }
    });
});
app.listen(process.env.PORT || 3000);
