var request = require("request");

var TelegramBot = require('node-telegram-bot-api');

var mongojs = require('mongojs');

var cString = "mongodb+srv://mallikarjun:mallikarjun@cluster0.omrap.mongodb.net/schedule?retryWrites=true&w=majority"

var db = mongojs(cString, ['tasks']);

var found = false;

var apiKey = "1314244328:AAE0Uy5nU2qu-FdgU7PPRtnUYlYx49zBXck";

var bot = new TelegramBot(apiKey, {polling : true});

bot.on('message', function(msg) {


	// db.tasks.find({}, function(err, docs) {
	// 		console.log(docs);
	// 	})
	var typedText = msg.text;
	var typedTextArray = typedText.split(",");

	var insertTask = {
		time : typedTextArray[0],
		task : typedTextArray[1]
	}

	if(msg.text.toLowerCase() == "hi" || msg.text.toLowerCase() == "hai" || msg.text.toLowerCase() == "hello") {
		bot.sendMessage(msg.chat.id, "Hello " + msg.chat.first_name + " " + msg.chat.last_name);
	}
	else if(msg.text.toLowerCase().includes("all")) {
			db.tasks.find({}, function(err, docs) {
				for(var i = 0; i < docs.length; i++) {
					bot.sendMessage(msg.chat.id, docs[i].time + " : " + docs[i].task);
				}
			})
	}
	
	else if(typedTextArray.length == 2) {
		db.tasks.insert(insertTask, function(err, docs) {
		bot.sendMessage(msg.chat.id, "Inserted successfully");
		})
	}

	else if(typedTextArray.length == 1) {
		db.tasks.find({time : typedTextArray[0]}, function(err, docs) {
			if(docs.length > 0) {
				bot.sendMessage(msg.chat.id, docs[0].task + " is your task at " + docs[0].time);
			}
			else {
				bot.sendMessage(msg.chat.id, "Task for time " + typedTextArray[0] + " not found. You did not create any such task")
			}
		})
	}

	else {
		bot.sendMessage("Please type in valid format");
	}
});
