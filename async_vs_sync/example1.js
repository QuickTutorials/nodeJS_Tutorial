http = require("http");

tiempo_inicial = new Date();

palabros = ["arbol", "boca", "casa", "dedo", "eco", "fuego", "ganso"]

function llamaWiki ( host, APIs ) {
  var palabro = palabros.shift();
  console.log(palabro,"INICIO");
  http.get({ host: "es.wikipedia.org", path: "/wiki/"+palabro }, function(res) { 
    res.on('end', function () {
		console.log(palabro,"FIN");
      	if( palabros.length ) {
        	llamaWiki();
      	}
		else{
			tiempo_final = new Date();
			console.log("Tiempo total:",tiempo_final.getTime() - tiempo_inicial.getTime());
		}
	});
  });
}

llamaWiki();