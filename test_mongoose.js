'use strict'

var mongoose = require('mongoose');
mongoose.connect('mongodb://218.244.139.56:6111/local');

console.log("test1.");
var CDKeys = mongoose.model("cdkeys", {}, "cdkeys");
var GMAccounts = mongoose.model("gm_accounts", {}, "gm_accounts");

CDKeys.findOne({}, "").exec().then(function(data){
	console.log("data: " + data);
	return GMAccounts.findOne({}, "").exec();
}).then(function(data){
	console.log("data: " + data);
	mongoose.disconnect();
});

console.log("end.");
