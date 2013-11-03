// http://blog.elfilo.net/charla_nodejs

var mail = require('mail');
var addresses = [ 'jeff@mapbox.com', 'alex@mapbox.com', 'eric@mapbox.com' ];
var message = 'I am writing to inform you of a...';

var count = 0;

addresses.forEach(function(sucker, i) {
	// Attempt to send email.
	mail(sucker, 'New opportunity', message, function(err) {
		if (!err) {
			count++;
		}
		
		// Don't wait, get the next address NOW.
		if (i == addresses.length - 1) {
			console.log(count + " messages sent");
		}
	});
});