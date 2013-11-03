var app = require('express').createServer(),
    twitter = require('ntwitter');

app.listen(3000);

var twit = new twitter({
  consumer_key: 'aaaaaaadsfasdf',
  consumer_secret: 'adsfasdfañlkjasfdlkjasdf',
  access_token_key: 'adsfasdfasdff',
  access_token_secret: 'asdfadsfasdfasdfasdf'
});

//twit.stream('statuses/filter', { track: ['love', 'hate'] }, function(stream) {
twit.stream('statuses/filter', { track: ['bbva'] }, function(stream) {
  stream.on('data', function (data) {
    console.log(JSON.stringify(data));
    console.log(",")
  });
});
