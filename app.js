
var Twitter = require('twitter');
// var http = require ('http');

// var options = {
//   host: 'tnguyenmbpx8.cnet.cnwk',
//   port: 8080,
//   path: '/api/content/article/update',
//   method: 'GET'
// };

// var req = http.request(options, function(res) {
//   console.log('STATUS: ' + res.statusCode);
//   console.log('HEADERS: ' + JSON.stringify(res.headers));
//   res.setEncoding('utf8');
//   res.on('data', function (chunk) {
//     console.log('BODY: ' + chunk);
//   });
// });

// req.on('error', function(e) {
//   console.log('problem with request: ' + e.message);
// });

// // write data to request body
// req.write('data\n');
// req.write('data\n');
// req.end();

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
	Brooke = 3192578587,
	initial = "Story created. Reply #title to change title, #body to add to story, #publish to go live.",
	title = "Title updated. Still listening for updates.",
	body = "Body updated. Still listening for updates.",
	publish = "Story is live on CBSSports.com/yourgoddangarticle/itproabblysucks/jk";

/* Streaming API listening for HighlanderCMS tweets */ 
var getTweet = function () {
	client.stream('statuses/filter', {follow: Brooke}, function(stream) {
		
		var tweetFn = function(tweet) {
			console.log("Got the tweet!");
			console.dir(tweet);

				console.log("calling Tweetfn");
				postDM();
				stream.destroy();

		}

		stream.on('data', tweetFn);

		stream.on('error', function(error) {
			console.log(error); 
		});

		
	}); 
}

/* send the inital DM */ 
var postDM = function () {
	console.log("\n");
	console.log("calling postDM");
	client.post('direct_messages/new', {user: FakeKenBerger, text: title}, 
			function(error, tweet, response) {
				if (!error) {
					console.log("DM successful");
					console.log(tweet);
				}
}); 
}

var checkDM = function() {
		client.get('direct_messages', { count:1}, function(error, tweet, response){
		if (error) {
			console.log("error:(");
				//console.log(error);
		};
		if (!error) {
			console.log("response");
			console.log(tweet);
			clearInterval(process);
		}
	}); 
}

getTweet();

var process = setInterval(checkDM(), 500);
// use the updated article time 





/*client.get('search/tweets', {q: 'node.js'}, function(error, tweets, response){
	console.log(tweets);
});*/








