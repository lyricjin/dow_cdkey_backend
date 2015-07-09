"use strict"

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.post('/', function(request, response){
	console.log("post. " + JSON.stringify(request.body));
	response.send("nihao");
});

app.listen(8080);
