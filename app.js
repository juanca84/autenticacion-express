var express = require('express');
var app = express();

var bodyParser = require('body-parser');

var morgan = require('morgan');

var jwt = require('jsonwebtoken');
var config = require('./config');
var model = require('./models/index');


var port = process.env.PORT || 8080;

app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(morgan('dev'));


var index = require('./routes/index');
var users = require('./routes/users');

var apiRoutes = express.Router();

apiRoutes.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.listen(port);
console.log('Magic happens at http://localhost:' + port);



apiRoutes.get('/usuarios', function(req, res) {
  model.Usuario.findAll({})
    .then(todos => res.json({
        error: false,
        data: todos
    }))
    .catch(error => res.json({
        error: true,
        data: [],
        error: error
    }));
});

app.get('/setup', function(req, res) {
  model.Usuario.create({
        nombre: 'Juan Carlos',
        contrasena: 'demo123',
        admin: true
    })
    .then(todo => res.status(201).json({
        error: false,
        data: todo,
        message: 'El usuario ha sido creado con exito.'
    }))
    .catch(error => res.json({
        error: true,
        data: [],
        error: error
    }));
});


apiRoutes.get('/autenticacion', function(req, res) {
  Usuario.findOne({}, function (err, usuario) {
    if (err) throw err;
    if(!user) {
      res.json({ success: false, message: 'La autenticación falló. Usuario no encontrado.' });
    } else if (usuario) {
      if (usuario.contrasena != req.body.contrasena) {
        res.json({ success: false, message: 'La autenticación falló. Error de contraseña.'});
      } else {
        const payload = {
          admin: user.admin
        };
        var token = jwt.sign(payload, app.get('superSecret'), {
          expiresInMinutes: 1440 // expires in 24 hours
        });

        res.json({
          success: true,
          message: 'Exito al generar el Token!',
          token: token
        });
      }
    }
  });

});


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
//
// //app.use('/', index);
// app.use('/users', users);
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

app.use('/api', apiRoutes);

module.exports = app;
