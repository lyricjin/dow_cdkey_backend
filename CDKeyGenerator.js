"use strict"

var global = {};

var Sequelize = require("sequelize")
var seq = new Sequelize("data", null, null, {
	dialect: "sqlite",
	storage: "data.db"
});

var CDKeys = seq.define("CDKeys", {
	"uuid":  Sequelize.STRING,
	"cdkey": Sequelize.STRING
});

seq.sync().then(function(){
	console.log("create table done.\n");

	// var generator = new CDKeyGenerator();
	// generator.generateCDKeys(10);
});

function CDKeyGenerator(){
	this.maxCDKeyNumber = Math.pow(2, 32);
	this.name = "CDKeyGenerator";
	this.lastCDKey = null;
	this.cdkeyValues = [];
}

CDKeyGenerator.prototype.destroy = function(){
	this.lastCDKey = null;
	this.cdkeyValues = null; 
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
	this.lastCDKey = this.genCDKey();
	CDKeys.create({
		"uuid": this.name,
		"cdkey": this.lastCDKey
	}).then(this.onGenerateCDKeyDone.bind(this))
}

CDKeyGenerator.prototype.onGenerateCDKeyDone = function(){
	this.cdkeyValues.push(this.lastCDKey);
	this.cdkeyNums -= 1;
	if(this.cdkeyNums <= 0){
		console.log("generateCDKeys done.");
	}
	else{
		this.doGenerateCDKeys();
	}
}

CDKeyGenerator.prototype.generateCDKeys = function(cdkeyNums){
	cdkeyNums = cdkeyNums || 10;
	this.cdkeyNums = cdkeyNums;
	this.doGenerateCDKeys();
}

module.exports = CDKeyGenerator;

