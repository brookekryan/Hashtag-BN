
var Twitter = require('twitter');
var S = require('string');		//Allows usage for .includes() method

var client = new Twitter({
	consumer_key: 'EE6dL94bOZPmnFS168pipLOXc',
	consumer_secret: 'XEVpvUNVRjRedfp3cNjUd8fZOwf0StJ9FgpUKbZhfUR9Dw15TD',
	access_token_key: '3271208005-7zI9XHJyYBTGpgoYGZgunxkBo4OQW3l7XO5PxRo',
	access_token_secret: 'QMZPAKC79MZMKu7lE7GGq51n2ERHP6pRcSFV4Xmtbkn5l'
});

var HighlanderCMS = 3271208005,			// User IDs 
	FakeKenBerger = 3272041242,
	Brooke = 3192578587,
	BN = "#BN",
	tweetText, messageDM, isKen,
	initial = "Story created. Reply #title to change title, #body to add to story, #publish to go live.",
	title = "Title updated. Still listening for updates.1",
	body = "Body updated. Still listening for updates.1",
	publish = "Story is live on CBSSports.com/yourgoddangarticle/itproabblysucks/jk1",
	dmMessage = "YEAH MR WHITE! YEAH SCIENCE! 1234";

/* Streaming API listening for HighlanderCMS tweets */ 
var getTweet = function () {
	var state = 'checkTwitter';
	client.stream('statuses/filter', {follow: FakeKenBerger}, function(stream) {
		
		var tweetFn = function(tweet) {
			if (state === 'checkTwitter') {
				 tweetText=tweet.text;
				 if (S(tweetText).contains(BN)) {
				 	console.dir(tweet.text);
				 	//postDM();
				 	state = "checkDM"; 		//delete once tan does his shiet
				 	//stream.destroy();
				 }
			}	
		}
		stream.on('data', tweetFn);
		stream.on('error', function(error) {
			console.log(error); 
		});
	}); 

	client.stream('user', {user: Brooke}, function(stream) {
		stream.on('data', function (message){
			if (state === 'checkDM') {
				if (message.direct_message) {
					console.log(message.direct_message.sender_id);
					isKen = message.direct_message.sender_id;
					//console.log(isKen);
					if (isKen === FakeKenBerger) {
						console.log("something went right");
						if (message.direct_message.text) {
							if (S(message.direct_message.text).contains("#title")) {
								console.log("in the title case");
								dmMessage = title;
								postDM();
							}
							else if (S(message.direct_message.text).contains("#body")) {
								dmMessage = body;
								postDM();
							}
							else if (S(message.direct_message.text).contains("#publish")) {
								dmMessage = publish;
								postDM();
								state = 'checkTwitter';
							}
						}
					}
				}
			}		
		});
	});
}

/* send the inital DM */ 
var postDM = function () {
	console.log("\n");
	console.log("calling postDM");
	client.post('direct_messages/new', {user: FakeKenBerger, text: dmMessage}, 
		function(error, tweet, response) {
			if (!error) {
				console.dir(tweet.text);
				console.log("DM successful");
			}
			if (error) {
				console.log(error);
			}
		}); 
}

if (S('hi#BN').contains('BN')) {
	console.log("bowel movement\n\n");
};

getTweet();

	



