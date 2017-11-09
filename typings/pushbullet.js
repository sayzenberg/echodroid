var util = require('util');
var HashMap = require('hashmap');
var WebSocket = require('ws');
var ws = new WebSocket('url');

var notificationTable = new HashMap();

// function Notification(app, title, body) {
// 	this.app = app;
// 	this.title = title;
// 	this.body = body;
// }

ws.on('message', function(data, flags) {
	// var notification = new Notification();
	var json = JSON.parse(data);
	if(json.type == 'push') {
		if(json.push.type == 'mirror') {
			// var notification = new Notification(json.push.application_name, json.push.title, json.push.body);
			notificationTable.set(json.push.notification_id, json);
			console.log(notificationTable);
		}
		else if(json.push.type == "dismissal") {
			notificationTable.remove(json.push.notification_id);
			console.log(notificationTable);
		}
		console.log(ReadNotifications());


	}
});

function ReadNotifications() {
	var readout;
	if(notificationTable.count() == 1) {
		notificationTerm = 'notification';
	}
	else {
		notificationTerm = 'notifications';
	}

	var readout = util.format("You have %d %s. ", notificationTable.count(), notificationTerm);
	var count = 1;
	notificationTable.forEach(function(value, key) {
		readout += util.format("Notification %d, from %s. Title: %s. Body: %s.", count++, value.push.application_name, value.push.title, value.push.body);
	});

	return readout;
}

function GetNotifications() {
	return JSON.stringify(notificationTable.values());
}