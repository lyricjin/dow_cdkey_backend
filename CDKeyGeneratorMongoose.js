'use strict'
//var DB_PATH = 'mongodb://localhost/dow';
var DB_PATH = 'mongodb://218.244.139.56:6111/local';

var Q = require("q");
var mongoose = require('mongoose');
mongoose.connect(DB_PATH);

var CDKeys = mongoose.model("cdkeys", 
	{
		product_count: Number,
		used:          Number,
		product_type:  Number,
		cdkey:         String
	}, 
	"cdkeys");

// CDKeys.findOne({}, "").exec().then(function(data){
// 	console.log("data: " + data);
// 	return GMAccounts.findOne({}, "").exec();
// }).then(function(data){
// 	console.log("data: " + data);
// 	mongoose.disconnect();
// });

function CDKeyGenerator(){
	this.maxCDKeyNumber = Math.pow(2, 32);
	this.name = "CDKeyGenerator";
	this.cdkeyData = null;
	this.cdkeyNum = 1;
	this.cdkeyValues = [];
	this.deferred = null;
}

CDKeyGenerator.prototype.destroy = function(){
	this.cdkeyData = null;
	this.cdkeyNum = 1;
	this.cdkeyValues = [];
	this.deferred = null;
}

CDKeyGenerator.prototype.genCDKey = function(){
	var rand = Math.random();
	var cdkey = parseInt(rand * this.maxCDKeyNumber);
	// CDKey 是8个字符的字符串
	cdkey = cdkey.toString(16).toUpperCase().substring(0, 8); 	
	if(cdkey.length < 8){
		var count = 8 - cdkey.length;
		for(var i=0; i<count; i++)
			cdkey = "0" + cdkey;
		return cdkey;
	}else
		return cdkey;
}

CDKeyGenerator.prototype.doGenerateCDKeys = function(){
	var cdkeyValue = this.genCDKey();
	// cdkeyData 里面有三个值
	// {product_count: 5, used: 0, product_type: 1}
	var tmp = {
		product_count: this.cdkeyData.product_count,
		used:          this.cdkeyData.used,
		product_type:  this.cdkeyData.product_type,
		cdkey:         cdkeyValue
	};
	this.cdkeyValues.push(tmp);
	var cdkey = new CDKeys(tmp); // 这个地方写的很难看
	console.log("tmp is " + JSON.stringify(tmp));
	cdkey.save().then(this.onGenerateCDKeyDone.bind(this));
}

CDKeyGenerator.prototype.onGenerateCDKeyDone = function(){
	this.cdkeyNum -= 1;
	if(this.cdkeyNum <= 0){
		console.log("generateCDKeys done.");
		this.deferred.resolve(this.cdkeyValues);
	}
	else{
		this.doGenerateCDKeys();
	}
}

CDKeyGenerator.prototype.generateCDKeys = function(cdkeyData, cdkeyNum){
	this.deferred = Q.defer();

	var cdkeyNum = cdkeyNum || 2;
	this.cdkeyData = cdkeyData;
	this.cdkeyNum = cdkeyNum;	
	this.doGenerateCDKeys();

	return this.deferred.promise;
}

module.exports = CDKeyGenerator;

