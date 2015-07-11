"use strict"

var CDKeyGenerator = require("./CDKeyGeneratorMongoose.js");

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.post('/', function(request, response){
	console.log("post. " + JSON.stringify(request.body));
	var cdkeyGenerator = new CDKeyGenerator();
	var cdkeyProductType = request.body.product_type;
	var cdkeyProductCount = request.body.product_count;
	var cdkeyNum = request.body.cdkey_num; // 需要产生多少个cdkey
	cdkeyGenerator.generateCDKeys(
		{product_type: cdkeyProductType, product_count: cdkeyProductCount, used: 0},
		cdkeyNum)
		.then(function(cdkeyValues){
			var result = JSON.stringify(cdkeyValues);
			console.log("generateCDKeys: " + result);
			// response.end("nihao");
			response.end(result);
		});
});

app.listen(5555);
