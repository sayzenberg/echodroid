/* Begin express requires */
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
/* End express requires */

/* Begin Pushbullet requires */
var util = require('util');
var HashMap = require('hashmap');
var WebSocket = require('ws');
var ws = new WebSocket('url');

var notificationTable = new HashMap();
/* End Pushbullet requires */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var routes = require("./routes/index");

app.use('/', routes);
app.use('/notifications', function(req, res, next) {
  res.send(getNotifications());
});

var server = app.listen(5678, function () {
    console.log("Listening on port %s...", server.address().port);
});



ws.on('message', function(data, flags) {
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
		console.log(readNotifications());


	}
});

function readNotifications() {
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
		readout += util.format("Notification %d, from %s. Title: %s. Body: %s", count++, value.push.application_name, value.push.title, value.push.body);
	});

	return readout;
}

function getNotifications() {
	return JSON.stringify(notificationTable.values());
}