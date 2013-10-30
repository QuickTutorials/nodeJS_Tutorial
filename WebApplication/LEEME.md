El propósito de esta aplicación es ofrecer una aquitectura completa basada en javascript para el desarrollo de aplicaciones web, tanto el lado de servidor como el de front. Hoy en día estos es posible gracias a entornos de ejecición como NodeJS, que nos permiten programar nuestro backend en javascript, pero también nos ayuda a realizar ciertas tareas en el front.

La comunicación con el servidor en esta aplicación estará basada en websockets, conectando con una basde de datos orientada a documentos (en nuestro caso una mongodb), alojada en www.mongolab.com.

##Construyendo el front

Antes de nada, vamos a construir nuestro front. Ene ste punto es cuando nos preguntamos qué aspectos serían deseables en su desarrollo. A saber:

- Que sea modularizable
- Análisis de código (jshint, jslint...)
- Testeable
- Disponer de un entorno de desarrollo fácil de depurar, pero fácilmente optimizable para su despliegue en entornos de producción
- Desarrollo de hojas de estilos con preprocesadores de css (LESS, SASS, Stylus...)
- Y seguramente muchas más cosas

Para todo esto y mucho más, podemos disponer de una herramienta llamada GruntJS. Pero, ¿qué es grunt? Es un ejecutor de tareas, una aplicación que corre con nodejs y se gestiona con su gestor de paquetes (npm). Para más información, se puede acudir a su website <a target="_blank" href="http://gruntjs.com">GruntJS site</a>.

De momento, vamos a comenzar con las cosas más básicas.

Lo primero antes de comenzar a utilizar grunt, es instalarlo e instalar los módulos de los que depende el proyecto. Estos módulos vienen definidos en el archivo localizado en el directorio client/package.json. Para descargar estas dependencias, basta con ejecutar el siguiente comando:

    cd client
    npm install -d

Con esto se descargarán las dependencias para posteriormente configurar y poder ejecutar las distintas tareas qeu necesitemos en nuestro proyecto, configuradas en el archivo Gruntfile.js, localizado en el directorio client.

A continuación, debemos instalar el cliente de grunt de forma global, para poder ejecutar la aplicación:

    npm install -g grunt-client

Ahora podemos construir nuestro front, simplemente ejecutando el comando grunt (siempre dentro del directorio client):

    grunt

¿Qué hace esto? Localiza las distntas configuraciones de los plugins en el fichero Gruntfile.js, donde también se incluyen las distintas tareas que queremos ejecutar. Si no especificamos ninguna tarea, como en elste caso, busca la tarea por defecto (default)

    grunt.registerTask("default", ["jshint", "concat", "uglify", "stylus"]);

Esta tarea ejecutará esos plugins con las configuraciones pertinentes localizadas en el mismo fichero. En concreto realiza las siguientes operaciones:

- Comprueba las distintas validaciones de sintaxis del javascript utiliazando la herramienta jshint
- Combina los diferentes fuentes javascript que forman nuestra aplicación
- Comprime y "ofusca" el archivo combinado resultante
- Crea las hojas de estilo necesarias, utilizando el preprocesador de css Stylus

Y ya prácticamente tenemos nuestro cliente preparado para funcionar.

Según este fichero Gruntfile, se podrían ejecutar otras tareas como por ejemplo:

- grunt test : ejecutaría únicamente las validaciones de código con jshint y los tests con jasmine
- grunt stylus: generaría las hojas de estilos css

Existen muchas configuraciones posibles para estos plugins y también muchos otros disponibles. Te invito a echar un vistazo en <a target="_blank" href="http://gruntjs.com/plugins">el listado de plugins de grunt</a> y ver todas las posibilidades que nos ofrece, todo gracias a nodejs

##Y ahora el turno del lado de servidor

También aquí debemos instalar las dependencias de la aplicación antes de poder arrancar el servidor, una vez más con nuestro gestor de paquetes de node (npm) y el archivo package.json localizado esta vez en el directorio server. Estas son las dependencias necesarias:

- mongodb: para poder conectar con nuestra base de datos mongo
- socket.io: para soportar las conexiones mediante websockets
- express: un framework web para nodejs que nos facilita bastantes cosas
- q: para el soporte de promesas en javascript, muy útil para trabajar con la asincronía

Tan sólo tenemos que ir al directorio server y volver a ejecutar el siguiente comando:

    node install -d

Esto instalará nuestras dependencias en nuestro proyecto

##Archivos de configuración del servidor

Hay un par de archivos de configuración a tener en cuenta:

###server/app/config/database.json:
Sirve para la configuración de las propiedades de conexión con nuestra base de datos, alojada en <a target="_blank" href="https://mongolab.com/welcome/">https://mongolab.com/welcome/</a>

###server/app/config/managers.json:
En este archivo se cruzan las claves de los distintos eventos que se enviarán/recibirán a través del websocket con su respectivo manager

##¡Arrancando!

Para arrancar el servidor, sólo necesitas ir al directorio server y ejecutar con node nuestro server.js

    node server.js

NOTA: En principio, esta aplicación esta preparada para correr en el editor <a href="https://c9.io" target="_blank">Cloud9 IDE</a>. A tal fin, se debe configurar de forma especial el puerto de arranque para que pueda funcionar. Este puerto está configurado en el server.js en la siguiente línea:

    server.listen(process.env.PORT);

Si se desea arrancar la aplicación en otro entorno, habría qeu indicar el puerto deseado, por ejemplo el 8888:

    server.listen(8888);

Ya está todo listo, o casi listo... Aún nos falta una cosa por configurar y se trata del servidor adonde debe atacar el javascript del cliente para abrir la conexión con el websocket. EL problema aquí radica en que, tal y como está preparado, si se utiliza un workspace personal del Cloud9 IDE, en cada caso se tendrá qeu apuntar a una dirección distinta. ¿Cómo resolver esto? Sencillo: Acudimos a nuestro package.json situado en el directorio client y actualizamos el valor de la propuiedad wsServer:

    "wsServer"       : "ws://mi.c9.host"

Y ahora, ejecuta de nueco el comando grunt y ya sí que estará todo listo. Pero ahora veamos un poco más en detalle. La petición de apertura del websocket se realiza en el archivo client/js/common/services/socketioConnection.js. ¿Cómo lee la informción del package.json? Vayamos a la siguiente línea de este archivo:

    connection = io.connect('<%= pkg.wsServer %>')

Efectivamente, al procesar los distintos archivos javascript, grunt puede tratarlos como si fueran plantillas, actualizando los distintos valores desde nuestro archivo package.json. Para esto simplemente necesitamos indicar en un determinado plugin la propiedad process con valor true:

     concat : {
            options: {
                separator: "\n",
                process : true   //Esto hará que al concatenar los ficheros los procese como plantillas
            },
            dist   : {
                files: [
                    {
                        src : [
                            "js/common/**/*.js",
                            "js/app.js",
                            "js/app/**/*.js"
                        ],
                        dest: "build/<%= pkg.name %>.js"
                    }
                ]
            }
        }

Este es otro truco interesante con Grunt, que nos permite personalizar los ficheros javascript para, por ejemplo, cambiar cofiguraciones para distintos entornos

¡Y eso es todo! Ya sí que puedes ejecutar la aplicación en tu navegador web favorito, escribiendo en la barra de direcciones la url correspondiente. Lamentablemente no funciona en navegadores IE anteriores a la versión 10, pero... ¡había dicho vuestro navegador favorito! Así que no creo que esto sea un problema.... ;)

