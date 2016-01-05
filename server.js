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
var passport 				= require('passport');
var MercadoLibreStrategy 	= require('passport-mercadolibre').Strategy;

// configuration ===========================================

	
// config files
var db = require('./config/db');

var port = process.env.PORT || 8080; // set our port
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
, currency: String
, order_items: mongoose.Schema.Types.Mixed
});

var productoSchema = new mongoose.Schema({
  id: String
});

var Ventas = mongoose.model('Ventas', ventaSchema);
var Productos = mongoose.model('Productos', productoSchema);



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

app.get('/getAllVentas', function(req, res) {
  Ventas.find({}, function(err, ventas) {
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


app.get('/getLastDate', function(req, res) {
	Ventas.find({}, null, {sort: {id: -1}, limit:1}, function(err, ventas) {
		res.send(ventas[0].date_created);  
	});
});


//==========================


//==========================

app.get('/test', function(req, res) {
	res.redirect('/auth/mercadolibre');
});


app.get('/getMLAccess', function(req, res) {
		res.json({access_token:access_token, profile_user:profile_user});
});


//==========================


//ML =======================
var access_token = '';
var profile_user = '';
 
passport.use(new MercadoLibreStrategy({
    clientID: '8767318679796615',
    clientSecret: 'elBDPKVpiQztGCpWjrtymnuo5pwzcDW6',
    callbackURL: 'https://'+config.URL+':8080/auth/mercadolibre/callback',
  },
  function (accessToken, refreshToken, profile, done) {
    // + store/retrieve user from database, together with access token and refresh token 
    access_token = accessToken;
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
