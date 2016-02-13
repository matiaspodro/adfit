angular.module('CategoriasCtrl', []).controller('CategoriasController', function($scope, DB) {

  	var array = function(object){
	  	return $.map(object, function(value, index) {
		    return [value];
		});
  	}

	DB.soloLasCategoriasConProductos().then(function(catsConProds){
		$scope.catsConProds 		= array(catsConProds);


		//////////// pasar categorias a casacada
		$scope.arbol = [];
		angular.forEach($scope.catsConProds, function(cat) {
			$scope.arbol.push(pushEnCascada(cat.path_from_root));
		});
		////////////

		////////// meter categorias dentro de su padre correspondiente
		$scope.arbol2 = angular.copy($scope.arbol);
		$scope.aux = [];
		angular.forEach($scope.arbol, function(hoja) {

			var result = $scope.arbol2.filter(function( obj ) {
				if (obj.yo.id == hoja.yo.id) return true;
				else return false;
			});

			hoja.hijos = [];
			angular.forEach(result, function(r) {
				hoja.hijos.push(r.hijos);
			});
		});
		//////////
		
		////////// ordenar
		$scope.arbol.sort(compare);
		//////////


		////////// quitar repetidos
		$scope.arbol2 = angular.copy($scope.arbol);
		$scope.arbol = [];
		var cod = '';
		angular.forEach($scope.arbol2, function(hoja) {
			if (cod != hoja.yo.id) $scope.arbol.push(hoja);
			cod = hoja.yo.id;
		});
		//////////

	});


	var pushEnCascada = function(array){
		var niveles = array.length;
		var aux = [];
		for (var i = niveles - 1; i >= 0; i--) {
			aux = {'yo':array[i], 'hijos':aux}
		};
		return aux
	}


	var compare = function(a,b) {
	  if (a.yo.name < b.yo.name)
	    return -1;
	  else if (a.yo.name > b.yo.name)
	    return 1;
	  else 
	    return 0;
	}


});