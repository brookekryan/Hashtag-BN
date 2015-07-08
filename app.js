var Twitter = require('twitter');

var client = new Twitter({
	consumer_key: 'EE6dL94bOZPmnFS168pipLOXc',
	consumer_secret: 'XEVpvUNVRjRedfp3cNjUd8fZOwf0StJ9FgpUKbZhfUR9Dw15TD',
	access_token_key: '3271208005-OLuytk7hCGKGOOIPtvRH5pVWENScxWQ6o0o4xdq',
	access_token_secret: 'yWP4HXvZhNSxiA4VSuuRs0453O2sS6dV1xG8OWsvIFmDo'
});

/* Twitter requests */
client.post('statuses/update', {status: 'My name Jeff'}, function(error,tweet,response){
	if (!error) {
		console.log(tweet);
	}
});

/* Streaming API */
/*client.stream('statuses/filter', {track: 'javascript'}, function(stream) {
	stream.on('data', function(tweet) {
		console.log(tweet.txt);
	});

	stream.on('error', function(error) {
		throw error;
	});
});*/