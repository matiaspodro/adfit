angular.module('MLService', []).factory('ML', ['$http', '$q', 'DB', function($http, $q, DB) {
	var ml = {};

	ml.todosLosProductos = function(){		
	    var defered = $q.defer();
	    var promise = defered.promise;

	    $http.get('/getMLAccess')
		.success(function(dataToken) {
			$http.get('https://api.mercadolibre.com/users/'+dataToken.profile_user.id+'/items/search?access_token='+dataToken.access_token+'&offset=0')
			.success(function(data) {
				var items1 = data.results;
				var items2 = data.results;
				var items3 = data.results;
				var items4 = data.results;
				var items5 = data.results;
		    	DB.saveProductos(items1.slice(0, 10));
		    	DB.saveProductos(items2.slice(10, 20));
		    	DB.saveProductos(items3.slice(20, 30));
		    	DB.saveProductos(items4.slice(30, 40));
		    	DB.saveProductos(items5.slice(40, 50));

				var cant 			= data.paging.limit;
				var pages 		= Math.ceil(data.paging.total / data.paging.limit);
				//var pages 			= 3;

				for (var i = 50; i < pages*cant; i+=50) {

					$http.get('https://api.mercadolibre.com/users/'+dataToken.profile_user.id+'/items/search?access_token='+dataToken.access_token+'&offset='+i)
					.success(function(data) {
						var items1 = data.results;
						var items2 = data.results;
						var items3 = data.results;
						var items4 = data.results;
						var items5 = data.results;
				    	DB.saveProductos(items1.slice(0, 10));
				    	DB.saveProductos(items2.slice(10, 20));
				    	DB.saveProductos(items3.slice(20, 30));
				    	DB.saveProductos(items4.slice(30, 40));
				    	DB.saveProductos(items5.slice(40, 50));
					})
			        .error(function(err) {
			            defered.reject(err)
			        });
				};
				defered.resolve('Se han guardado las actualizaciones en la Base de Datos.');				
			})
	        .error(function(err) {
	            defered.reject(err)
	        });
		})
        .error(function(err) {
            defered.reject(err)
        });


        return promise;
	};

	ml.todasLasVentas = function(){		
	    var defered = $q.defer();
	    var promise = defered.promise;

	    $http.get('/getMLAccess')
		.success(function(dataToken) {
			$http.get('https://api.mercadolibre.com/orders/search?seller='+dataToken.profile_user.id+'&access_token='+dataToken.access_token+'&offset=0')
			.success(function(data) {
				var items1 = data.results;
				var items2 = data.results;
				var items3 = data.results;
				var items4 = data.results;
				var items5 = data.results;
		    	DB.saveVentas(items1.slice(0, 10));
		    	DB.saveVentas(items2.slice(10, 20));
		    	DB.saveVentas(items3.slice(20, 30));
		    	DB.saveVentas(items4.slice(30, 40));
		    	DB.saveVentas(items5.slice(40, 50));

				var cant 			= data.paging.limit;
				var pages 		= Math.ceil(data.paging.total / data.paging.limit);
				//var pages 			= 3;

				for (var i = 50; i < pages*cant; i+=50) {

					$http.get('https://api.mercadolibre.com/orders/search?seller='+dataToken.profile_user.id+'&access_token='+dataToken.access_token+'&offset='+i)
					.success(function(data) {
						var items1 = data.results;
						var items2 = data.results;
						var items3 = data.results;
						var items4 = data.results;
						var items5 = data.results;
				    	DB.saveVentas(items1.slice(0, 10));
				    	DB.saveVentas(items2.slice(10, 20));
				    	DB.saveVentas(items3.slice(20, 30));
				    	DB.saveVentas(items4.slice(30, 40));
				    	DB.saveVentas(items5.slice(40, 50));
					})
			        .error(function(err) {
			            defered.reject(err)
			        });
				};
				defered.resolve('Se han guardado las actualizaciones en la Base de Datos.');				
			})
	        .error(function(err) {
	            defered.reject(err)
	        });
		})
        .error(function(err) {
            defered.reject(err)
        });


        return promise;
	};

	ml.login = function(){		
	    var defered = $q.defer();
	    var promise = defered.promise;

	    $http.get('/inicio')
		.success(function(data) {
            defered.resolve(data);
		})
        .error(function(err) {
            defered.reject(err)
        });


        return promise;
	};



	ml.getItem = function(itemId){		
	    var defered = $q.defer();
	    var promise = defered.promise;

	    $http.get('/getMLAccess')
		.success(function(dataToken) {
			$http.get('https://api.mercadolibre.com/items/'+itemId)
			.success(function(data) {
            	defered.resolve(data);
			})
	        .error(function(err) {
	            defered.reject(err)
	        });
		})
        .error(function(err) {
            defered.reject(err)
        });


        return promise;
	};



	ml.isLogged = function(){		
	    var defered = $q.defer();
	    var promise = defered.promise;

	    $http.get('/getMLAccess')
		.success(function(data) {
            defered.resolve(data);
		})
        .error(function(err) {
            defered.reject(err)
        });


        return promise;
	};

	return ml;

}]);