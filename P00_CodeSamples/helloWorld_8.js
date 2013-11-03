// http://blog.elfilo.net/charla_nodejs

var mail = require('mail');
var addresses = [ 'jeff@mapbox.com', 'alex@mapbox.com', 'eric@mapbox.com' ];
var message = 'I am writing to inform you of a...';

var count = 0;

addresses.forEach(function(person, i) {
	// Attempt to send email.
	mail(person, 'New opportunity', message, function(err) {
		if (!err) {
			count++;
		}
		
		// Don't wait, get the next address NOW.
		if (i == addresses.length - 1) {
			console.log(count + " messages sent");
		}
	});
});