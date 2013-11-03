var books = [ 'The Fellowship of the Ring',
              'The Two Towers',
              'The return of the King' ];

function serveBooks() {

	var html = '<b>' + books.join('</b><br/><b>') + '</b>';
	var books = []; // Intentionally cleaned
}

// Only the first time echo the 3x books