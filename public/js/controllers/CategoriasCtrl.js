angular.module('CategoriasCtrl', []).controller('CategoriasController', function($scope, DB) {


	$('.tree-toggle').click(function () {
		$(this).parent().children('ul.tree').toggle(200);
	});

  	var array = function(object){
	  	return $.map(object, function(value, index) {
		    return [value];
		});
  	}

	DB.soloLasCategoriasPadresConProductos().then(function(catsPadres){
		console.log(catsPadres);
		$scope.categoriasPadres 		= array(catsPadres);


	});



});