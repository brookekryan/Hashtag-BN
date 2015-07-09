
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
		title : "Title updated. Still listening for updates.",
		body : "Body updated. Still listening for updates.",
		publish : "Story is live on CBSSports.com/yourgoddangarticle/itproabblysucks/jk"
	};
	

/* Streaming API listening for HighlanderCMS tweets */ 
var startListening = function () {
	/* send the inital DM */ 
	var postDM = function (message) {
		console.log("\n");
		console.log("calling postDM");
		client.post('direct_messages/new', {user: twitterUserIds.FakeKenBerger, text: message}, 
				function(error, tweet, response) {
					if (!error) {
						console.log("DM successful: " + message + "\n");
						//console.log(tweet);
					}
		}); 
	}

	var state = 'checkTwitter',
	versionId = '',
	contentId = '';
	client.stream('statuses/filter', {follow: twitterUserIds.dnt}, function(stream) {
		
		var tweetFn = function(tweet) {
			console.log('incomingTweet');
			if (state === 'checkTwitter') {
				var options = {
					host: 'tnguyenmbpx8.cnet.cnwk',
					port: 8080,
					path: '/api/content/article/update',
					method: 'GET'
				},
				tweetText = tweet.text;
				if (S(tweetText).contains(hashtags.BN)) {
					var headline = tweet.text.replace(hashtags.BN, "");
					headline
					options.path = 'api/content/article/create?headline=' + encodeURI(headline);

					console.log('Creating Article: ' + options.path);
					console.log('headline: ' + headline);
					request('http://tnguyenmbpx8.cnet.cnwk:8080/api/content/article/create?headline=' + encodeURI(headline), function (error, response, body) {
					  	if (!error && response.statusCode == 200) {
							console.log('Rerturn Data from Hub (Creating)');
							console.dir(body);
							contentData = JSON.parse(body);
							if (contentData.versionId && contentData.id) {
								console.dir(contentData);
								postDM(tweetTexts.initial.replace("{datetime}", contentData.dateCreated));
								versionId = contentData.versionId;
								contentId = contentData.id;
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

	client.stream('user', {}, function(stream) {
		stream.on('data', function (message){
			if (state === 'checkDM') {
				console.dir(message);
				state = 'checkTwitter';
			}
			
		});
	});

	
}


startListening();


