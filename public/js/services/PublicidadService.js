angular.module('PublicidadService', []).factory('Publicidad', ['$http', '$q', 'DB', 'ML', function($http, $q, DB,ML) {
	var pub = {};
	pub.obtenerProductosRandom = function(publicidad){	
	    var defered = $q.defer();
	    var promise = defered.promise;

		DB.getProductosByCategoria(publicidad.destino).then(function(data) {
			var arr = array(data);
			var prods = [];
			prods.push(arr[0]);
			prods.push(arr[1]);
			prods.push(arr[2]);
			prods.push(arr[3]);
			prods.push(arr[4]);
			prods.push(arr[5]);
			prods.push(arr[6]);

			var ret = [];
			angular.forEach(prods, function(prod) {
				ML.getItem(prod.id).then(function(data) {
					ret.push({
						title: 		data.title,
						picture: 	data.pictures[0],
						link: 		data.permalink
					});

					if (prods[prods.length-1].id == prod.id) defered.resolve(ret);
				}, function(data) {
				});
			});
		});

        return promise;
	};

	var array = function(myObj){
		return $.map(myObj, function(value, index) {
		    return [value];
		});
	}

	return pub;
}]);0