// E/S Bloqueante
var urls = db.query("select * from urls"); //esperar
urls.each(function(url) {
	var page = http.get(url); //esperar
	save(page); //esperar
});

// E/s No bloqueante, petición asincrona
db.query("slect * from urls", function(urls) {
	url.each(function(url) {
		http.get(url, function(page) {
			save(page);
		});
	});
});