// modules =================================================
var config 					= require('./config');
var fs 						= require('fs');
var https 					= require('https');
var http					= require('http');
var express        			= require('express');
var app            			= express();
var mongoose       			= require('mongoose');
var bodyParser     			= require('body-parser');
var methodOverride 			= require('method-override');
var passport 				     = require('passport');
var MercadoLibreStrategy 	= require('passport-mercadolibre').Strategy;
var mailer              = require('./server/mailer');
var notifications              = require('./server/notifications');
var fs                  = require('fs');

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
});

var productoSchema = new mongoose.Schema({
	id: String
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

var Ventas = mongoose.model('Ventas', ventaSchema);
var Productos = mongoose.model('Productos', productoSchema);
var Categorias = mongoose.model('Categorias', categoriaSchema);
var Relaciones = mongoose.model('Relaciones', relacionSchema);



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


var saveVenta = function(order) {
  fs.readFile('./token.txt', 'utf8', function (err,token) {
    if (err) {
      return console.log(err);
    }
    var str = '';
    var options = {
          host: 'api.mercadolibre.com',
          path: order.resource+'?access_token='+token
    };
              
    callback = function(response) {

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
          }];   
          Ventas.collection.insert(ventas
          , onInsert);
          function onInsert(err, docs) {
              if (err) {
                console.log('403');
              } else {
                console.log(docs.length + ' venta ha sido guardada.');
              }
          }
      });
    }

    var req = https.request(options, callback).end();

  });
}


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
  console.log(req.body);
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
  Ventas.find({},{}, { skip: req.query.begin, limit : req.query.cant }, function(err, ventas) {
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
    var eveMap = {};

    relaciones.forEach(function(eve) {
      eveMap[eve._id] = eve;
    });

    res.send(eveMap);  
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


//==========================
app.post('/prepareMailer', mailer.prepare);
app.post('/sendMailer', mailer.send);


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
    clientID: '8767318679796615',
    clientSecret: 'elBDPKVpiQztGCpWjrtymnuo5pwzcDW6',
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



app.get('/auth/mercadolibre',
  passport.authorize('mercadolibre'));
 
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
  console.log('-------------new notify-------------');
  console.log(req.body);


  switch(req.body.topic) {
    case 'orders': return saveVenta(req.body);break;
    case 'items': return notifications.orderNotifiactions(req.body);break;
    case 'questions': return notifications.orderNotifiactions(req.body);break;
    case 'payments': return notifications.orderNotifiactions(req.body);break;
    default: return notifications.orderNotifiactions(req.body);break;
  }
  console.log('-----------------end new notify--------------');
});
// ============================


// routes ==================================================
require('./app/routes')(app); // pass our application into our routes

// // start app ===============================================
// app.listen(port);	
// console.log('Magic happens on port ' + port); 			// shoutout to the user
// exports = module.exports = app; 						// expose app


	
	//app.listen(port);
	
    https.createServer({
    	secureProtocol: 'TLSv1_method',	
      key: fs.readFileSync('./key.pem', 'utf8'),
      cert: fs.readFileSync('./server.crt', 'utf8')
    }, app).listen(port);

	console.log('Magic happens on port ' + port); 			// shoutout to the user
	exports = module.exports = app; 						// expose app



