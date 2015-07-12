"use strict"


Date.prototype.format = function(format)
{
 var o = {
 "M+" : this.getMonth()+1, //month
 "d+" : this.getDate(),    //day
 "h+" : this.getHours(),   //hour
 "m+" : this.getMinutes(), //minute
 "s+" : this.getSeconds(), //second
 "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
 "S" : this.getMilliseconds() //millisecond
 }
 if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
 (this.getFullYear()+"").substr(4 - RegExp.$1.length));
 for(var k in o)if(new RegExp("("+ k +")").test(format))
 format = format.replace(RegExp.$1,
 RegExp.$1.length==1 ? o[k] :
 ("00"+ o[k]).substr((""+ o[k]).length));
 return format;
}

var MAX_CDKEY_NUM = 500;
var PORT = 5555;

var CDKeyGenerator = require("./CDKeyGeneratorMongoose.js");
var mongoose = require("mongoose");
var GMAccounts = mongoose.model("gm_accounts", {}, "gm_accounts");

var express = require('express');
var session = require('express-session');
var fs = require('fs');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
	secret: 'passwd',
	name: 'gm_account',
	cookie: {maxAge: 60000},
	resave: false,
	saveUninitialized: true
}));

app.get("/login", function(request, response, next){
	response.sendFile(__dirname + '/public/login.html');
});

app.get("/main", function(request, response, next){
	response.sendFile(__dirname + '/public/index.html');
});

app.get("*.js", function(request, response, next){
	response.sendFile(__dirname + '/public/angular.min.js');
});

app.get("*", function(request, response, next){
	var account = request.session.account;
	var passwd = request.session.passwd;
	if(account === "shardstudio" && passwd === "wangyishards163")
		next();
	else{
		console.log("account not available, redirect: " + account + ", " + passwd);
		response.redirect("/login");
	}
});

app.use(express.static(__dirname + '/public'));

app.post('/login', function(request, response){
	var account = request.body.account;
	var passwd = request.body.passwd;
	if(account === "shardstudio" && passwd === "wangyishards163"){
		request.session.account = account;
		request.session.passwd = passwd;
		response.send({redirect: '/main'});
	}else{
		;
	}
});

app.post('/', function(request, response){
	var date = new Date();
	console.log("\n--- record process " + date.format('yyyy-MM-dd-hh-mm-ss') + " ---\n");
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

var https = require('https')
    ,fs = require("fs");

var options = {
    key: fs.readFileSync('./privatekey.pem'),
    cert: fs.readFileSync('./certificate.pem')
};

https.createServer(options, app).listen(PORT, function () {
    console.log('Https server listening on port ' + PORT);
});
