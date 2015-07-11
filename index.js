"use strict"

var MAX_CDKEY_NUM = 20;

var CDKeyGenerator = require("./CDKeyGeneratorMongoose.js");

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.post('/', function(request, response){
	var date = new Date();
	console.log("\n--- record process " + date + " ---\n");
	console.log("post cmd: " + JSON.stringify(request.body));
	var cdkeyGenerator = new CDKeyGenerator();
	var cdkeyProductType = request.body.product_type;
	var cdkeyProductCount = request.body.product_count;
	var cdkeyNum = request.body.cdkey_num; // 需要产生多少个cdkey
	if(cdkeyNum > MAX_CDKEY_NUM)
		cdkeyNum = MAX_CDKEY_NUM;
	cdkeyGenerator.generateCDKeys(
		{product_type: cdkeyProductType, product_count: cdkeyProductCount, used: 0},
		cdkeyNum)
		.then(function(cdkeyValues){
			var result = JSON.stringify(cdkeyValues);
			console.log("generateCDKeys: " + result);
			response.end(result);
		});
});

app.listen(5555);
