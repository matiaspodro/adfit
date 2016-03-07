angular.module('CategoriasCtrl', []).controller('CategoriasController', function($scope, DB, Arbol) {

	$scope.isActive		= true;

	DB.soloLasCategoriasConProductos().then(function(catsConProds){
		$scope.aux = Arbol.armar(catsConProds);
		$scope.isActive				= false;
	});

	$('.tree-toggle').click(function () {
		$(this).parent().children('ul.tree').toggle(200);
	});
	$(function(){
		$('.tree-toggle').parent().children('ul.tree').toggle(200);
	});



    $scope.showModal  = false;
	$scope.openModal = function(){
		$scope.toggleModal();
	};

      $scope.toggleModal = function(){
          $scope.showModal = !$scope.showModal;
      };


});