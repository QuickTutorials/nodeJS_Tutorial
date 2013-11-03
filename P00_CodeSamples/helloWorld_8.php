<?php

    /* http://blog.elfilo.net/charla_nodejs */

	$addresses = array(
	  'jeff@mapbox.com',
	  'alex@mapbox.com',
	  'eric@mapbox.com'
	);
	$message = 'I am writing to inform you of a...';
	$count = 0;

	foreach($addresses as $person) {
	    // Attempt to send email.
	  if (mail($person, 'New opportunity', $message)) {
	    $count++;
	  }
	}

	// Once email is sent, get the next address.
	echo $count . "messages sent";

?>