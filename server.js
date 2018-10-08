var express = require('express');
var bodyParser = require('body-parser');
var ObjectID = require('mongodb').ObjectID;
var db = require('./db');

var app = express();
var db;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', function(req, res){
    db.get().collection('notes').find().toArray(function(err, docs){
        if(err){
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(docs);
    });
});

app.get('/:id', function(req, res){
    db.get().collection('notes').findOne({ _id: ObjectID(req.params.id) }, function(err, doc){
        if(err){
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(doc);
    });
});

app.post('/', function (req, res) {
    var note = {
        text: req.body.text
    };
    
    db.get().collection('notes').insert(note, function(err, result){
        if(err){
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(note);
    });
});

app.put('/:id', function(req, res) {
    db.get().collection('notes').update(
        { _id: ObjectID(req.params.id) },
        { $set: { text: req.body.text } },
        function (err, result) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
        }
    );
});

app.delete('/:id', function(req, res){
    db.get().collection('notes').deleteOne(
        {_id: ObjectID(req.params.id)},
        function(err, result){
            if(err){
                console.log(err);
                return res.sendStatus(500);
            }
            res.sendStatus(200);
        }
    )
});

db.connect('mongodb://localhost:27017/myapi', function(err){
    if(err){
        return console.log(err);
    }
    app.listen(3012, function(){
        console.log('api started');
    });    
});
