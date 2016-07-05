angular.module('PublicidadService', []).factory('Publicidad', ['$http', '$q', 'DB', 'ML', function($http, $q, DB,ML) {
	var pub = {};
	pub.obtenerProductosRandom = function(publicidad){	
	    var defered = $q.defer();
	    var promise = defered.promise;

		DB.getProductosByCategoria(publicidad.destino.id).then(function(data) {
			var arr = array(data);

			var random = function(){
			    return 0.5 - Math.random();
			};

			//var sarassa = $filter('orderBy')(arr, random);

			var prods = [];
			if (arr[0]!= undefined) prods.push(arr[0]);
			if (arr[1]!= undefined) prods.push(arr[1]);
			if (arr[2]!= undefined) prods.push(arr[2]);
			if (arr[3]!= undefined) prods.push(arr[3]);
			if (arr[4]!= undefined) prods.push(arr[4]);
			if (arr[5]!= undefined) prods.push(arr[5]);
			if (arr[6]!= undefined) prods.push(arr[6]);

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