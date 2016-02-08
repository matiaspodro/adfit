angular.module('DBService', []).factory('DB', ['$http', '$q', function($http, $q) {
	var db = {};

	db.soloLasCategoriasPadresConProductos = function(){	
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

	db.saveEventos = function(params){		
	    var defered = $q.defer();
	    var promise = defered.promise;
		$http.post('/saveEventos', params)
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
	return db;

}]);