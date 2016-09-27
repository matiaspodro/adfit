// modules =================================================
var config                    = require('./config');
var fs                        = require('fs');
var https                     = require('https');
var http                      = require('http');
var express                   = require('express');
var app                       = express();
var mongoose                  = require('mongoose');
var bodyParser                = require('body-parser');
var methodOverride            = require('method-override');
var passport                  = require('passport');
var MercadoLibreStrategy      = require('passport-mercadolibre').Strategy;
var mailer                    = require('./server/mail/mailer');
var notifications             = require('./server/notifications');
var fs                        = require('fs');
var moment                    = require('moment');

// configuration ===========================================
  
// config files
var db = require('./config/db');

var port = process.env.PORT || config.port; // set our port
mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// Add headers
app.use(function(req, res, next) {
res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type, Authorization');
    next();
});

//Mongoose =================



var ventaSchema = new mongoose.Schema({
    id: Number
  , comments: String
  , status: String
  , date_created: Date
  , date_closed: Date
  , date_last_updated: Date
  , currency: String
  , order_items: mongoose.Schema.Types.Mixed
  , total_amount: Number
  , product: String
  , info: mongoose.Schema.Types.Mixed
});

var productoSchema = new mongoose.Schema({
  id: String
 ,cat: String
});


var categoriaSchema = new mongoose.Schema({
     id: String
  ,name: String
});

var relacionSchema = new mongoose.Schema({
  origen: mongoose.Schema.Types.Mixed
  ,destino: mongoose.Schema.Types.Mixed
  ,reselling: mongoose.Schema.Types.Mixed
  ,tipo: mongoose.Schema.Types.Mixed
});

var eventoSchema = new mongoose.Schema({
  tipo: Number,
  venta_id: String,
  product_id: String,
  category_id: String,
  fecha: Date,
  relacion_id: mongoose.Schema.Types.Mixed,
  repeticion: Number
});

var publicidadSchema = new mongoose.Schema({
  evento_id: mongoose.Schema.ObjectId,
  relacion_id: mongoose.Schema.ObjectId,
  info: mongoose.Schema.Types.Mixed,
  producto: String,
  destino: mongoose.Schema.Types.Mixed,
  enviado: Boolean
});

var Ventas = mongoose.model('Ventas', ventaSchema);
var Productos = mongoose.model('Productos', productoSchema);
var Categorias = mongoose.model('Categorias', categoriaSchema);
var Relaciones = mongoose.model('Relaciones', relacionSchema);
var Eventos = mongoose.model('Eventos', eventoSchema);
var Publicidades = mongoose.model('Publicidades', publicidadSchema);

app.post('/saveVentas', function(req, res) {
  Ventas.collection.insert(req.body, onInsert);

  function onInsert(err, docs) {
      if (err) {
      res.status(403)        // HTTP status 404: NotFound
      .send(err);
      } else {
          res.send(docs.length + ' venta/s ha/n sido guardada/s.');
      }
  }
});


app.post('/saveProductos', function(req, res) {
  var reformattedArray = req.body.map(function(obj){ 
      var rObj = {};
      rObj.id = obj;
      return rObj;
  });

  Productos.collection.insert(reformattedArray, onInsert);

  function onInsert(err, docs) {
      if (err) {
      res.status(403)        // HTTP status 404: NotFound
      .send(err);
      } else {
          res.send(docs.length + ' Producto/s ha/n sido guardada/s.');
      }
  }
});


  saveOne = function(body, saveCallback) {
    fs.readFile('./token.txt', 'utf8', function (err,token) {
      if (err) {
        return console.log(err);
      }
      var options = {
            host: 'api.mercadolibre.com',
            path: body.resource+'?access_token='+token
      };
                
      callback = saveCallback;

      var req = https.request(options, callback).end();

    });
  }

    saveVentaCallback = function(response) {
      var str = '';
      response.on('data', function (chunk) {
        str += chunk;
      });

      response.on('end', function () {
          str = JSON.parse(str);
          var ventas = [{
              id: str.id
            , comments: str.comments
            , status: str.status
            , date_created: str.date_created
            , date_closed: str.date_closed
            , date_last_updated: str.last_updated
            , currency: str.currency_id
            , order_items: str.order_items
            , total_amount: str.total_amount
            , product: (str.order_items == undefined) ? '' : str.order_items[0].item.id
            , info: str.buyer
          }];   
          Ventas.collection.insert(ventas
          , onInsert);
          function onInsert(err, docs) {
              if (err) {
                console.log('403');
              } else {
                console.log(docs.length + ' venta ha sido guardada.');
                saveEvento(1, str.id, str.order_items[0].item.id, str.order_items[0].item.category_id, str.date_created, undefined, undefined, docs[0]);

                ////////////////////////////
                //Guardar producto
                ////////////////////////////
                var prods = [{
                    id: str.order_items[0].item.id,                    
                    cat: str.order_items[0].item.category_id
                }];   
                Productos.collection.insert(prods
                , onInsert);
                function onInsert(err, docs) {
                    if (err) {
                      console.log('403');
                    } else {
                      console.log(docs.length + ' producto ha sido guardado.');
                    }
                }

                //////////////////////////////
                //////////////////////////////
              
              }
          }
      });
    }



    saveProductoCallback = function(response) {
      var str = '';
      response.on('data', function (chunk) {
        str += chunk;
      });

      response.on('end', function () {
          str = JSON.parse(str);
          var productos = [str.id];

          var reformattedArray = productos.map(function(obj){ 
              var rObj = {};
              rObj.id = obj;
              return rObj;
          });

          Productos.collection.insert(reformattedArray, onInsert);

          function onInsert(err, docs) {
              if (err) {
                console.log('403');
              } else {
                console.log(docs.length + ' producto ha sido guardado.');
                saveEvento(3, '', str.id, '', str.date_created);
              }
          }

      });
    }

  saveEvento = function(tipo, venta_id, product_id, category_id, fecha, relacion_id, repeticion, venta){

          relacion_id = (relacion_id == undefined) ? '': relacion_id;
          repeticion = (repeticion == undefined) ? '' : repeticion; 

          var eventos = [{
              tipo: tipo
            , venta_id: venta_id
            , product_id: product_id
            , category_id: category_id
            , fecha: fecha
            , relacion_id: relacion_id
            ,  repeticion: repeticion
          }];   
          Eventos.collection.insert(eventos
          , onInsert);
          function onInsert(err, docs) {
              if (err) {
                console.log(err);
                console.log('403');
              } else {
                console.log(docs.length + ' EVENTO ha sido creado.');
                //SOLO PARA CROSSSELLING (POR AHORA)
                if (tipo == 1) savePublicidad(docs[0], venta);
                //
              }
          }
  }

  savePublicidad = function(evento, venta){
       Relaciones.find({'tipo.value':1}, function(err, relaciones) {
        relaciones.forEach(function(rel) {

          var publis = [];
          /////////////////////////////////////////////////////////
          //Manganeta para tener todos los productos de la relacion          
          /////////////////////////////////////////////////////////
          var str = JSON.stringify(rel.origen)
          var arr = str.split('children');
          arr.forEach(function(it) {
            var minArr = it.split('"}]');
            if (minArr.length > 1){
              var minimumArr = minArr[0].split('"');
              publis.push(minimumArr[minimumArr.length-1]);
            }
          });
          /////////////////////////////////////////////////////////
          /////////////////////////////////////////////////////////

          publis.forEach(function(publi) {
              var publicidades = [];
                if (venta.order_items != undefined && publi == venta.order_items[0].item.id){
                  publicidades.push({
                    evento_id: evento._id,
                    relacion_id: rel._id,
                    info: venta.info,
                    producto: publi,
                    destino: rel.destino,
                    enviado: 0
                  });
                }

              if (publicidades.length > 0){
                Publicidades.collection.insert(publicidades, onInsert);
                function onInsert(err, docs) {
                    if (err) {
                      console.log(err);
                      console.log('403');
                    } else {
                      console.log(docs.length + ' Publicidad/es han sido creadas.');
                      //
                    }
                }
              }
          });
        });
      });


  }


app.post('/saveCategorias', function(req, res) {
  Categorias.collection.insert(req.body, onInsert);

  function onInsert(err, docs) {
      if (err) {
      res.status(403)        // HTTP status 404: NotFound
      .send(err);
      } else {
          res.send(docs.length + ' categoria/s ha/n sido guardada/s.');
      }
  }
});


app.post('/saveRelaciones', function(req, res) {
  //console.log(req.body);
  Relaciones.collection.insert(req.body, onInsert);

  function onInsert(err, docs) {
      if (err) {
      res.status(403)        // HTTP status 404: NotFound
      .send(err);
      } else {
          res.send(docs.length + ' relacion/es ha/n sido guardada/s.');
      }
  }
});

app.get('/getAllVentas', function(req, res) {
  Ventas.find({}, function(err, ventas) {
    var ventaMap = {};

    ventas.forEach(function(venta) {
      ventaMap[venta._id] = venta;
    });

    res.send(ventaMap);  
  });
});

app.get('/getVentasByLimit', function(req, res) {
  Ventas.find({},{}, { skip: req.query.begin, limit : req.query.cant, sort: {'date_created':-1} }, function(err, ventas) {
    var ventaMap = {};

    ventas.forEach(function(venta) {
      ventaMap[venta._id] = venta;
    });

    res.send(ventaMap);  
  });
});

app.get('/getAllProductos', function(req, res) {
  Productos.find({}, function(err, productos) {
    var prodMap = {};

    productos.forEach(function(prod) {
      prodMap[prod._id] = prod;
    });

    res.send(prodMap);  
  });
});

app.get('/getProductosByCategoria', function(req, res) {

  var options = {
    host: 'api.mercadolibre.com',
    path: '/categories/'+req.query.cat
  };
  
  callback = function(response) {
    var str = '';
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
        str = JSON.parse(str);
        var from_root = str.path_from_root;
        var childs    = str.children_categories;
        var cats      = [];

        cats.push(from_root[0].id);
        childs.forEach(function(cat) {
          cats.push(cat.id);
        });

        Productos.find({}, function(err, productos) {
          var prodMap = {};
          var resp = [];
          productos.forEach(function(prod) {
            var index = cats.indexOf(prod.cat);
            if (index >= 0) {
              console.log(prod);
              resp.push(prod);

            }
          });

          res.send(resp);  
        });

    });
  };

  var req = https.request(options, callback).end();


});

app.get('/getAllCategorias', function(req, res) {
  Categorias.find({}, function(err, categorias) {
    var catMap = {};

    categorias.forEach(function(cat) {
      catMap[cat._id] = cat;
    });

    res.send(catMap);  
  });
});

app.get('/getAllRelaciones', function(req, res) {
  Relaciones.find({}, function(err, relaciones) {
    var relMap = {};

    relaciones.forEach(function(rel) {
      relMap[rel._id] = rel;
    });

    res.send(relMap);  
  });
});

app.get('/getAllEventos', function(req, res) {
  Eventos.find({}, function(err, eventos) {
    var eveMap = {};

    eventos.forEach(function(eve) {
      eveMap[eve._id] = eve;
    });

    res.send(eveMap);  
  });
});

app.get('/getAllPublicidades', function(req, res) {
  Publicidades.find({}, function(err, publicidades) {
    var pubMap = {};

    publicidades.forEach(function(pub) {
      pubMap[pub._id] = pub;
    });

    res.send(pubMap);  
  });
});

app.get('/getOnePublicidad', function(req, res) {
  Publicidades.find({'_id': req.query.id}, function(err, publicidad) {
    res.send(publicidad[0]);  
  });
});

app.get('/getLast', function(req, res) {
  Ventas.find({}, null, {limit:1}, function(err, ventas) {
    if (ventas.length > 0) res.send(ventas[0]);  
    else res.send({});  
  });
});

app.get('/getCantVentas', function(req, res) {
  Ventas.count({}, function(err, c) {
    res.send({cant:c}); 
  });
});

app.post('/generateReselling', function(req, res) {
  var repeticion = 0;
  var today = moment().utc().format('YYYY-MM-DD'); //comparo con hoy

  Relaciones.find({'tipo.value':2}, function(err, relaciones) {
    relaciones.forEach(function(relacion) {
      Eventos.find({'tipo':1}, function(err, eventos) {
        eventos.forEach(function(evento) { 
          if (evento.product_id == relacion.origen.id){


            
            if (true){

            //if ('MLA622421876' == evento.id){
              //console.log(evento.id);

                var fecha = moment(evento.fecha).utc().format('YYYY-MM-DD');
                console.log(fecha);
                //console.log('cantidad' + relacion.reselling.cantidad);
                if (relacion.reselling.tipo.value == '1'){
                  var days = moment(today).diff(fecha, 'days');
                  //console.log('days' + days);
                  if (days % relacion.reselling.cantidad == 0){
                    repeticion = Math.floor(days/relacion.reselling.cantidad);
                    saveEvento(2, evento.venta_id, evento.product_id, evento.category_id, moment(today).utc().format('YYYY-MM-DDTHH:mm:ss.sssZ'), relacion._id, repeticion);
                    
                  }
                }else {
                  var months = moment(today).diff(fecha, 'months');
                  //console.log('months' + months);
                  if (months % relacion.reselling.cantidad == 0){
                    repeticion = Math.floor(months/relacion.reselling.cantidad);
                    saveEvento(2, evento.id, evento.category_id, moment(today).utc().format('YYYY-MM-DDTHH:mm:ss.sssZ'), relacion._id, repeticion);
                  }
                }
              //}
            }
          }


        });
      });



    });



    //res.send(relMap);  
  });

});



app.post('/generatePublicidades', function(req, res) {
  Eventos.find({tipo:1}, function(err, eventos) {
    eventos.forEach(function(eve) {
      Ventas.find({id:eve.venta_id}, function(err, ventas) {
        ventas.forEach(function(ven) {
           savePublicidad(eve, ven);
        });

      });
    });

  });
});



//==========================

app.post('/sendMailer', function(req, res) {
  mailer.send(req, res, function(sendResponse){
    if(sendResponse.statusCode < '400'){
      console.log('ok');
      Publicidades.update({_id:req.body.publicidad._id}, {$set:{enviado:1}}, function(err, docs) {
          if (err) {
          res.status(403)        // HTTP status 404: NotFound
          .send(err);
          } else {
              console.log('req.body._id: '+req.body._id);
              res.send('Publicidad enviada');
          }
      });
    }else{
      console.log(response.statusCode);
    }
  });
});

//==========================

app.get('/test', function(req, res) {
  res.redirect('/auth/mercadolibre');
});


app.get('/getMLAccess', function(req, res) {
    res.json({access_token:access_token, profile_user:profile_user});
  //console.log({access_token:access_token, profile_user:profile_user});
});


//==========================


//ML =======================
var access_token = '';
var profile_user = '';
 
passport.use(new MercadoLibreStrategy({
    clientID: '8897826357766426',
    clientSecret: '9Uc9Olu30h0ozswLFisUxM66zSgpxHQO',
    callbackURL: 'https://'+config.URL+':'+config.port+'/auth/mercadolibre/callback',
  },
  function (accessToken, refreshToken, profile, done) {
    // + store/retrieve user from database, together with access token and refresh token 
    access_token = accessToken;

    // Writing...
    var fs = require("fs");

    fs.writeFile( "token.txt", accessToken, "utf8", function(){} );

    profile_user = profile;
    return done(null, profile); 
  }
));
 
passport.serializeUser(function (user, done) {
  done(null, user);
});
 
passport.deserializeUser(function (user, done) {
  done(null, user);
});



app.get('/auth/mercadolibre', function(req, res){
  console.log(res);
  res.setHeader('', '');
  passport.authorize('mercadolibre', req, res);
});
 
app.get('/auth/mercadolibre/callback', 
  passport.authorize('mercadolibre', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
 

app.get('/inicio', ensureAuthenticated, 
  function(req, res) {
    res.send("Logged in user: " + req.user.nickname);
  }
);
 
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
    return next(); 
  };
  res.redirect('/auth/mercadolibre');
};


app.post('/notifications', function(req, res) {
  //console.log('-------------new notify-------------');
  //console.log(req.body);


  switch(req.body.topic) {
    case 'orders': return saveOne(req.body, saveVentaCallback);break;
    //case 'items': return saveOne(req.body, saveProductoCallback);break;
    case 'questions': return notifications.orderNotifiactions(req.body);break;
    case 'payments': return notifications.orderNotifiactions(req.body);break;
    default: return notifications.orderNotifiactions(req.body);break;
  }
  //console.log('-----------------end new notify--------------');
});
// ============================


// routes ==================================================
require('./app/routes')(app); // pass our application into our routes

// // start app ===============================================
// app.listen(port);  
// console.log('Magic happens on port ' + port);      // shoutout to the user
// exports = module.exports = app;            // expose app


  
  //app.listen(port);
  
    https.createServer({
      secureProtocol: 'TLSv1_method', 
      key: fs.readFileSync('./key.pem', 'utf8'),
      cert: fs.readFileSync('./server.crt', 'utf8')
    }, app).listen(port);

  console.log('Magic happens on port ' + port);       // shoutout to the user
  exports = module.exports = app;             // expose app



