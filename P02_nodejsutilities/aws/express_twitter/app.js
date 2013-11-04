var app = require('express').createServer(), twitter = require('ntwitter');

app.listen(3000);

var credentials = require('./privateCredentials.json');

/*
 * Saved in a json private file 
	{
	"consumer_key": "....",
	"consumer_secret": "....",
	"access_token_key": "......",
	"access_token_secret": "...."
	}
*/

var twit = new twitter(credentials);

//twit.stream('statuses/filter', { track : [ 'love', 'hate' ] }, function(stream) {		// a lot of tweets!!
twit.stream('statuses/filter', { track: ['cristiano ronaldo'] }, function(stream) {
	stream.on('data', function(data) {
		console.log(JSON.stringify(data));
		console.log(",")
	});
});
