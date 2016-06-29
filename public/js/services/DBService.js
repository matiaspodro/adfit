angular.module('DBService', []).factory('DB', ['$http', '$q', function($http, $q) {
	var db = {};

	db.soloLasCategoriasConProductos = function(){	
	    var defered = $q.defer();
	    var promise = defered.promise;

		db.getCategorias().then(function(cats) {
			//console.log(cats);

			defered.resolve(cats);

		}, function(err) {
			defered.reject(err);
		});

        return promise;
	};

	db.unaCategoriaConProductos = function(catId){	
	    var defered = $q.defer();
	    var promise = defered.promise;

		db.getProductos().then(function(prods) {
			//console.log(prods);

			$http.get('https://api.mercadolibre.com/categories/'+catId)
			.success(function(cats) {
				defered.resolve(cats);
			})
	        .error(function(err) {
	            defered.reject(err);
	        });

		}, function(err) {
			defered.reject(err);
		});

        return promise;
	};




	db.saveVentas = function(params){		
	    var defered = $q.defer();
	    var promise = defered.promise;
		$http.post('/saveVentas', params)
		.success(function(data) {
            defered.resolve(data);
		})
        .error(function(err) {
            defered.reject(err)
        });

        return promise;
	};


	db.generateReselling = function(params){		
	    var defered = $q.defer();
	    var promise = defered.promise;
		$http.post('/generateReselling', params)
		.success(function(data) {
            defered.resolve(data);
		})
        .error(function(err) {
            defered.reject(err)
        });

        return promise;
	};

	db.generatePublicidades = function(params){		
	    var defered = $q.defer();
	    var promise = defered.promise;
		$http.post('/generatePublicidades', params)
		.success(function(data) {
            defered.resolve(data);
		})
        .error(function(err) {
            defered.reject(err)
        });

        return promise;
	};

	db.saveProductos = function(params){		
	    var defered = $q.defer();
	    var promise = defered.promise;
		$http.post('/saveProductos', params)
		.success(function(data) {
            defered.resolve(data);
		})
        .error(function(err) {
            defered.reject(err)
        });

        return promise;
	};

	db.saveCategorias = function(params){		
	    var defered = $q.defer();
	    var promise = defered.promise;
		$http.post('/saveCategorias', params)
		.success(function(data) {
            defered.resolve(data);
		})
        .error(function(err) {
            defered.reject(err)
        });

        return promise;
	};

	db.saveRelaciones = function(params){		
	    var defered = $q.defer();
	    var promise = defered.promise;
		$http.post('/saveRelaciones', params)
		.success(function(data) {
            defered.resolve(data);
		})
        .error(function(err) {
            defered.reject(err)
        });

        return promise;
	};

	db.getLast = function(){		
	    var defered = $q.defer();
	    var promise = defered.promise;
		$http.get('/getLast')
		.success(function(data) {
            defered.resolve(data);
		})
        .error(function(err) {
            defered.reject(err)
        });

        return promise;
	};

	db.getCantVentas = function(){		
	    var defered = $q.defer();
	    var promise = defered.promise;
		$http.get('/getCantVentas')
		.success(function(data) {
            defered.resolve(data);
		})
        .error(function(err) {
            defered.reject(err)
        });

        return promise;
	};

	db.getVentas = function(params){		
	    var defered = $q.defer();
	    var promise = defered.promise;
		$http.get('/getAllVentas')
		.success(function(data) {
            defered.resolve(data);
		})
        .error(function(err) {
            defered.reject(err)
        });

        return promise;
	};

	db.getVentasPaginada = function(begin, cant){		
	    var defered = $q.defer();
	    var promise = defered.promise;
		$http.get('/getVentasByLimit?begin='+begin+'&'+'cant='+cant)
		.success(function(data) {
            defered.resolve(data);
		})
        .error(function(err) {
            defered.reject(err)
        });

        return promise;
	};


	db.getProductos = function(params){		
	    var defered = $q.defer();
	    var promise = defered.promise;
		$http.get('/getAllProductos')
		.success(function(data) {
            defered.resolve(data);
		})
        .error(function(err) {
            defered.reject(err)
        });

        return promise;
	};


	db.getProductosByCategoria = function(cat){		
	    var defered = $q.defer();
	    var promise = defered.promise;
		$http.get('/getProductosByCategoria?cat='+cat)
		.success(function(data) {
            defered.resolve(data);
		})
        .error(function(err) {
            defered.reject(err)
        });

        return promise;
	};

	db.getCategorias = function(params){		
	    var defered = $q.defer();
	    var promise = defered.promise;
		$http.get('/getAllCategorias')
		.success(function(data) {
            defered.resolve(data);
		})
        .error(function(err) {
            defered.reject(err)
        });

        return promise;
	};


	db.getRelaciones = function(params){		
	    var defered = $q.defer();
	    var promise = defered.promise;
		$http.get('/getAllRelaciones')
		.success(function(data) {
            defered.resolve(data);
		})
        .error(function(err) {
            defered.reject(err)
        });

        return promise;
	};



	db.getEventos = function(params){		
	    var defered = $q.defer();
	    var promise = defered.promise;
		$http.get('/getAllEventos')
		.success(function(data) {
            defered.resolve(data);
		})
        .error(function(err) {
            defered.reject(err)
        });

        return promise;
	};


	db.getPublicidades = function(params){		
	    var defered = $q.defer();
	    var promise = defered.promise;
		$http.get('/getAllPublicidades')
		.success(function(data) {
            defered.resolve(data);
		})
        .error(function(err) {
            defered.reject(err)
        });

        return promise;
	};

	db.getOnePublicidad = function(id){		
	    var defered = $q.defer();
	    var promise = defered.promise;
		$http.get('/getOnePublicidad?id='+id)
		.success(function(data) {
            defered.resolve(data);
		})
        .error(function(err) {
            defered.reject(err)
        });

        return promise;
	};

	db.postNotifiactions = function(params){		
	    var defered = $q.defer();
	    var promise = defered.promise;
		$http.post('/notifications', params)
		.success(function(data) {
            defered.resolve(data);
		})
        .error(function(err) {
            defered.reject(err)
        });

        return promise;
	};




	db.postMailer = function(params){		
	    var defered = $q.defer();
	    var promise = defered.promise;
		$http.post('/sendMailer', params)
		.success(function(data) {
            defered.resolve(data);
		})
        .error(function(err) {
            defered.reject(err)
        });

        return promise;
	};

	return db;

}]);