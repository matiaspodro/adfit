angular.module('MLService', []).factory('ML', ['$http', '$q', 'DB', function($http, $q, DB) {
	var ml = {};
      
  	var array = function(object){
	  	return $.map(object, function(value, index) {
		    return [value];
		});
  	}

	ml.todasLasCategoriasConProductos = function(catId){		
	    var defered = $q.defer();
	    var promise = defered.promise;


		DB.getProductos().then(function(prods) {
			var productos = array(prods);
			var countProds = productos.length;

			var cats = [];
			angular.forEach(productos, function(prod) {
				ml.getItem(prod.id).then(function(item) {

					$http.get('https://api.mercadolibre.com/categories/'+item.category_id)
					.success(function(cat) {

						var result = cats.filter(function( obj ) {
						  if (obj.id == cat.id){
						  	obj.associated_prods.push({'name':prod.id, 'name':prod.id});
						  	return true;
						  }else{
						  	return false;
						  }
						});

						if(result.length == 0){
							cat.associated_prods = [{'id':prod.id, 'name':prod.id}];
							cats.push(cat);
							var formatArray = [cat];
							DB.saveCategorias(formatArray);
						}

						defered.resolve('Se han guardado las actualizaciones en la Base de Datos.');

					})
					.error(function(err) {
					    defered.reject(err)
					});


				}, function(err) {
			       defered.reject(err);
				});
			});
		}, function(err) {
	       defered.reject(err);
		});






        return promise;
	};

		ml.todasLasCategorias = function(){		
	    var defered = $q.defer();
	    var promise = defered.promise;

		$http.get('https://api.mercadolibre.com/sites/MLA/categories')
		.success(function(data) {
			var items1 = data;
			DB.saveCategorias(items1);

			defered.resolve('Se han guardado las actualizaciones en la Base de Datos.');				
		})
	   .error(function(err) {
	       defered.reject(err)
	   });


        return promise;
	};

	ml.todosLosProductos = function(){		
	    var defered = $q.defer();
	    var promise = defered.promise;

	    $http.get('/getMLAccess')
		.success(function(dataToken) {
			$http.get('https://api.mercadolibre.com/users/'+dataToken.profile_user.id+'/items/search?access_token='+dataToken.access_token+'&sort=date_desc&offset=0')
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
				var pages 			= Math.ceil(data.paging.total / data.paging.limit);
				//var pages 			= 3;

				for (var i = 50; i < pages*cant; i+=50) {

					$http.get('https://api.mercadolibre.com/users/'+dataToken.profile_user.id+'/items/search?access_token='+dataToken.access_token+'&sort=date_desc&offset='+i)
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
		var ultimoID 		= -1;
	    var deferedPPAL 	= $q.defer();
	    var promisePPAL 	= deferedPPAL.promise;

		DB.getLast().then(function(last) {
			ultimoID = last.id;

		    $http.get('/getMLAccess')
			.success(function(dataToken) {
				$http.get('https://api.mercadolibre.com/orders/search?seller='+dataToken.profile_user.id+'&access_token='+dataToken.access_token+'&sort=date_desc&offset=0')
				.success(function(data) {

					var cant 			= data.paging.limit;
					var pages 			= Math.ceil(data.paging.total / data.paging.limit);
					//var pages 			= 3;

					    var getPromises = function() {
					    	var promise;
		    				var promises = [];
						    for (var i = 0; i < pages*cant; i+=cant) {
								promise = $http.get('https://api.mercadolibre.com/orders/search?seller='+dataToken.profile_user.id+'&access_token='+dataToken.access_token+'&sort=date_desc&offset='+i);
					            promises.push(promise);
						 	}

						    $q.all(promises).then(function(resp) {
						        console.log(resp);
						        guardarVentas(resp, cant);						        
						    }, function(indexError) {
						    	deferedPPAL.reject('falló servicio ML');
						    });
						};

					    var guardarVentas = function(array) {
					    	var promise1;
					    	var promise2;
		    				var promises = [];
							angular.forEach(array, function(value) {
								var items1raMitad = value.data.results;
								var items2daMitad = value.data.results;
								promise1 = DB.saveVentas(items1raMitad.slice(0, (cant/2)));
								promises.push(promise1);
								promise2 = DB.saveVentas(items2daMitad.slice((cant/2), cant));
								promises.push(promise2);
							});


						    $q.all(promises).then(function(resp) {
						    	deferedPPAL.resolve('Las ventas se han actualizado');		        
						    }, function(indexError) {
						    	deferedPPAL.resolve('Las ventas se han actualizado');
						    });
						};

						getPromises();
				})
		        .error(function(err) {
		            deferedPPAL.reject(err)
		        });
			})
	        .error(function(err) {
	            deferedPPAL.reject(err)
	        });
		
		});


        return promisePPAL;
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

			$http.get('https://api.mercadolibre.com/items/'+itemId)
			.success(function(data) {
            	defered.resolve(data);
			})
	        .error(function(err) {
	            defered.reject(err)
	        });


        return promise;
	};


	ml.getItemDescription = function(itemId){
	    var defered = $q.defer();
	    var promise = defered.promise;

			$http.get('https://api.mercadolibre.com/items/'+itemId+'/description')
			.success(function(data) {
            	defered.resolve(data);
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