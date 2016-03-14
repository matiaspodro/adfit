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


	$scope.titleModal = 'a';
    $scope.showModal  = false;
    $scope.catOrigen = {};
    $scope.catDestino = {};


	$scope.openModal = function(cat){
		$scope.toggleModal();
		$scope.titleModal 	= cat.name;
    	$scope.catOrigen 	= cat;
	};

	$scope.selectCategory = function(cat){
    	$scope.catDestino = cat;
    	generarEvento();
	};

    $scope.toggleModal = function(){
        $scope.showModal = !$scope.showModal;
    };

	$scope.selectResellingOption = function(){
		alert('sarasa');
	}

	$scope.numbersDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
	$scope.numbersMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

	var generarEvento = function(){
    	console.log($scope.catOrigen.name + ' a ' + $scope.catDestino.name);
	}
});