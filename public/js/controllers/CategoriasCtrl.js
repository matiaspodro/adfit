angular.module('CategoriasCtrl', []).controller('CategoriasController', function($scope, DB) {

	DB.soloLasCategoriasConProductos().then(function(catsConProds){
		$scope.catsConProds 		= array(catsConProds);

		//////////// pasar categorias a casacada
		$scope.arbol = [];
		angular.forEach($scope.catsConProds, function(cat) {
			$scope.arbol.push(pushEnCascada(cat.path_from_root, cat.associated_prods));
		});
		////////////


		$scope.arbol2 = angular.copy($scope.arbol);

		$scope.aux = [];
		angular.forEach($scope.arbol, function(hoja) {			
			var tree = new TreeModel();
			var masterTree = tree.parse(hoja);
			angular.forEach($scope.arbol2, function(hoja2) {
				var additionalData = tree.parse(hoja2);
				if (hoja.id == hoja2.id) mergeNodes(masterTree, additionalData);
			});
			$scope.aux.push(masterTree.model);
		});

		////////// ordenar
		$scope.aux.sort(compare);
		//////////
		$scope.aux2 = angular.copy($scope.aux);
		$scope.aux = [];
		var cod = '';
		angular.forEach($scope.aux2, function(hoja) {
			if (cod != hoja.id) $scope.aux.push(hoja);
			cod = hoja.id;
		});
		//////////

	});




	$('.tree-toggle').click(function () {
		$(this).parent().children('ul.tree').toggle(200);
	});
	$(function(){
		$('.tree-toggle').parent().children('ul.tree').toggle(200);
	})

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

});