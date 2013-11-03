http = require("http");

tiempo_inicial = new Date();

palabros = [ "arbol", "boca", "casa", "dedo", "eco", "fuego", "ganso" ]

total_respuestas = palabros.length;

palabros.forEach(function(value, index) {
	console.log(value, "INICIO");
	http.get({
		host : "es.wikipedia.org",
		path : "/wiki/" + value
	}, function(res) {
		res.on('end', function() {
			console.log(value, "FIN");
			total_respuestas--;
			if (total_respuestas == 0) {
				tiempo_final = new Date();
				console.log("Tiempo total:", tiempo_final.getTime()	- tiempo_inicial.getTime());
			}
		});
	});
});
