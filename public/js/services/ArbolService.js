angular.module('ArbolService', []).factory('Arbol', ['$http', '$q', function($http, $q) {
	var arbol = {};

	arbol.armar = function(catsConProds){

		catsConProds 		= array(catsConProds);

		//////////// pasar categorias a casacada
		var arbol = [];
		angular.forEach(catsConProds, function(cat) {
			arbol.push(pushEnCascada(cat.path_from_root, cat.associated_prods));
		});
		////////////


		var arbol2 = angular.copy(arbol);

		var aux = [];
		angular.forEach(arbol, function(hoja) {			
			var tree = new TreeModel();
			var masterTree = tree.parse(hoja);
			angular.forEach(arbol2, function(hoja2) {
				var additionalData = tree.parse(hoja2);
				if (hoja.id == hoja2.id) mergeNodes(masterTree, additionalData);
			});
			aux.push(masterTree.model);
		});

		////////// ordenar
		aux.sort(compare);
		//////////
		var aux2 = angular.copy(aux);
		aux = [];
		var cod = '';
		angular.forEach(aux2, function(hoja) {
			if (cod != hoja.id) aux.push(hoja);
			cod = hoja.id;
		});
		//////////

		return aux;

	}


	var array = function(object){
	  	return $.map(object, function(value, index) {
		    return [value];
		});
  	}

	var pushEnCascada = function(array, associated_prods){
		var niveles = array.length;
		var aux = associated_prods;
		for (var i = niveles - 1; i >= 0; i--) {
			aux = {'id':array[i].id, 'name':array[i].name, 'children':[aux]}
		};

		return aux
	}



	var compare = function(a,b) {
	  if (a.name < b.name)
	    return -1;
	  else if (a.name > b.name)
	    return 1;
	  else 
	    return 0;
	}




	// Check if n1 and n2 have the same id
	function idEq(n1) {
	    return function (n2) {
	        return n1.model.id === n2.model.id;
	    };
	}

	// Check if n1 contains the given n2 child
	function hasChild(n1) {
	    return function (n2Child) {
	        return n1.children.some(idEq(n2Child));
	    };
	}

	function mergeNodes(n1, n2) {
	    var n1HasN2Child, i, n2Child;
	    
	    // Check which n2 children are present in n1
	    n1HasN2Child = n2.children.map(hasChild(n1));
	    
	    // Iterate over n2 children
	    for (i = 0; i < n1HasN2Child.length; i++) {
	        n2Child = n2.children[i];
	        if (n1HasN2Child[i]) {
	            // n1 already has this n2 child, so lets merge them
	            n1Child = n1.first({strategy: 'breadth'}, idEq(n2Child));
	            mergeNodes(n1Child, n2Child);
	        } else {
	            // n1 does not have this n2 child, so add it
	            n1.addChild(n2Child);
	        }
	    }
	}

	return arbol;
}]);