
var Twitter = require('twitter');

var client = new Twitter({
	consumer_key: 'EE6dL94bOZPmnFS168pipLOXc',
	consumer_secret: 'XEVpvUNVRjRedfp3cNjUd8fZOwf0StJ9FgpUKbZhfUR9Dw15TD',
	access_token_key: '3271208005-7zI9XHJyYBTGpgoYGZgunxkBo4OQW3l7XO5PxRo',
	access_token_secret: 'QMZPAKC79MZMKu7lE7GGq51n2ERHP6pRcSFV4Xmtbkn5l'
});

/* Twitter requests */ 
/*client.post('statuses/update', {status: 'ringdingdingbingding'}, function(error,tweet,response){
	if (!error) {
		console.log(tweet);
	}
}); */

var HighlanderCMS = 3271208005,			// User IDs 
	FakeKenBerger = 3272041242,
	initial = "Story created. Reply #title to change title, #body to add to story, #publish to go live.",
	title = "Title updated. Still listening for updates.",
	body = "Body updated. Still listening for updates.",
	publish = "Story is live on CBSSports.com/yourgoddangarticle/itproabblysucks/jk";

/* Streaming API listening for HighlanderCMS tweets */ 
client.stream('statuses/filter', {follow: HighlanderCMS}, function(stream) {
	
	stream.on('data', function(tweet) {
		console.dir(tweet);
		stream.off();
	});

	stream.on('error', function(error) {
		console.log(error); 
	});
}); 

/* send the inital DM */
client.post('direct_messages/new', {user: FakeKenBerger, text: initial}, 
					function(error, tweet, response) {
						if (!error) {
							console.log(tweet);
						}
		}); 

client.get('direct_messages', {count: 1}, function(error, tweet, response){
	if (error) {
		console.log("error:(");
			//console.log(error);
	};
	if (!error) {
		console.log("BROOKE TEST!!!");
		//console.log(response);
	}
});



/*client.get('search/tweets', {q: 'node.js'}, function(error, tweets, response){
	console.log(tweets);
});*/








