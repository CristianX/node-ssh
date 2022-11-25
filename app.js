// requires   importaciones de librerias para que funcione algo
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var tunnel = require('tunnel-ssh');

//inicializar variables 
var app = express();


// Configuración para conexión ssh
var config = {
    username    : 'soluciones',
    password    : '12345',
    host        : '172.22.4.106',
    port        : 22,
    // dstHost     : 'mongodb://root:Rm3MpB4vR5AXPL@172.22.4.106:6400/?authMechanism=DEFAULT&tls=false',
    dstPort     : 6400,
    localPort   : 27020,

};


//body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());



//importar RUTAS
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');


//conexion a la base de datos
// mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
//     if (err) throw err; //si la base de datos no funciona no hace nada
//     console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online')
// })

// Conexión por ssh
var server = tunnel(config, function (error, server) {
    if (error) {
        console.log("SSH connection error: " + error);
    }
    mongoose.connect('mongodb://localhost:27020/hospitalDB', {
        authSource: 'admin',
        user: 'root',
        pass: "Rm3MpB4vR5AXPL",
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    });
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online')
    });
});

//rutas
//ejecutar un middlewer
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

//escuchar peticiones
app.listen(3000, () => {
    console.log('Express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
})