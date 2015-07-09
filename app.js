
var Twitter = require('twitter');
var S = require('string');		//Allows usage for .includes() method

var http = require ('http');
var request = require('request');
var client = new Twitter({
	consumer_key: 'EE6dL94bOZPmnFS168pipLOXc',
	consumer_secret: 'XEVpvUNVRjRedfp3cNjUd8fZOwf0StJ9FgpUKbZhfUR9Dw15TD',
	access_token_key: '3271208005-7zI9XHJyYBTGpgoYGZgunxkBo4OQW3l7XO5PxRo',
	access_token_secret: 'QMZPAKC79MZMKu7lE7GGq51n2ERHP6pRcSFV4Xmtbkn5l'
});


var twitterUserIds = {
		HighlanderCMS : 3271208005,			// User IDs 
		FakeKenBerger : 3272041242,
		Brooke : 3192578587,
		dnt: 3272637074
	},
	hashtags = {
		BN : "#BN",
	},
	tweetTexts = {
		initial : "Story created on {datetime}. Reply #title to change title, #body to add to story, #publish to go live.",
		title : "Title updated on {datetime}. Still listening for updates.",
		body : "Body updated on {datetime}. Still listening for updates.",
		publish : "Story is live on {datetime}."
	},
	apiEndPoints = {
		create : 'http://tnguyenmbpx8.cnet.cnwk:8080/api/content/article/create?headline=',
		update : 'http://tnguyenmbpx8.cnet.cnwk:8080/api/content/article/update/{id}?'
	},
	isKen;
	

/* Streaming API listening for HighlanderCMS tweets */ 
var startListening = function () {
	/* send the inital DM */ 
	var postDM = function (message) {
		client.post('direct_messages/new', {user: twitterUserIds.FakeKenBerger, text: message}, 
				function(error, tweet, response) {
					if (!error) {
						console.log("DM successful: " + message + "\n");
					} else {
						console.dir(error);
					}
		}); 
	}

	var state = 'checkTwitter',
	versionId = '',
	contentId = '',
	dateTime = '';
	client.stream('statuses/filter', {follow: twitterUserIds.FakeKenBerger}, function(stream) {
		var tweetFn = function(tweet) {
			if (state === 'checkTwitter') {
				if (S(tweet.text).contains(hashtags.BN)) {
					var headline = tweet.text.replace(hashtags.BN, "");
					request(apiEndPoints.create + encodeURI(headline), function (error, response, body) {
					  	if (!error && response.statusCode == 200) {
							contentData = JSON.parse(body);
							if (contentData.versionId && contentData.id) {
								console.dir(contentData);
								postDM(tweetTexts.initial.replace("{datetime}", contentData.dateCreated));
								versionId = contentData.versionId;
								contentId = contentData.id;
								dateTime = contentData.dateCreated;
								state = 'checkDM';
							}
					  	} else {
					    	console.dir(error);
					  	}
					})
				}
			}	
		}
		stream.on('data', tweetFn);
		stream.on('error', function(error) {
			console.log(error); 
		});
	}); 

	client.stream('user', {user: twitterUserIds.FakeKenBerger}, function(stream) {
		stream.on('data', function (message){
			if (state === 'checkDM') {
				if (message.direct_message) {
					isKen = message.direct_message.sender_id;
					if (isKen === twitterUserIds.FakeKenBerger) {
						if (message.direct_message.text) {
							if (S(message.direct_message.text).contains("#title")) {
								var updatedValue = message.direct_message.text.replace('#title', '');
								request(apiEndPoints.update.replace('{id}', contentId) + 'headline=' + encodeURI(updatedValue), function (error, response, body){
									if (!error && response.statusCode == 200) {
										contentData = JSON.parse(body);
										if (contentData.versionId && contentData.id) {
											console.dir(contentData);
											postDM(tweetTexts.title.replace("{datetime}", contentData.dateUpdated));
											versionId = contentData.versionId;
											contentId = contentData.id;
											dateTime = contentData.dateUpdated;
										}
								  	} else {
								    	console.dir(error);
								  	}
								});
							}
							else if (S(message.direct_message.text).contains("#body")) {
								var updatedValue = message.direct_message.text.replace('#body', '');
								request(apiEndPoints.update.replace('{id}', contentId) + 'body=' + encodeURI(updatedValue), function (error, response, body){
									if (!error && response.statusCode == 200) {
										contentData = JSON.parse(body);
										if (contentData.versionId && contentData.id) {
											postDM(tweetTexts.body.replace("{datetime}", contentData.dateUpdated));
											versionId = contentData.versionId;
											contentId = contentData.id;
											dateTime = contentData.dateUpdated;
										}
								  	} else {
								    	console.dir(error);
								  	}
								});
							}
							else if (S(message.direct_message.text).contains("#publish")) {
								postDM(tweetTexts.publish.replace("{datetime}", dateTime));
								console.log("http://tnguyenmbpx8.cnet.cnwk:8080/content/article/" + contentId + "/version/" + versionId);
								state = 'checkTwitter';
							}
						}
					}
				}
			}		
		});
	});

	
}


startListening();



