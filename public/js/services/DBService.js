angular.module('DBService', []).factory('DB', ['$http', '$q', function($http, $q) {
	var db = {};

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

	db.getLastDate = function(){		
	    var defered = $q.defer();
	    var promise = defered.promise;
		$http.get('/getLastDate')
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