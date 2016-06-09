angular.module('CategoriasCtrl', ['ui.bootstrap']).controller('CategoriasController', function($scope, $window, DB, Arbol) {

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


	$scope.titleModal = 'Categoría seleccionada: ';
    $scope.showModal  = false;
    $scope.catOrigen = {};
    $scope.tipo = {};
    $scope.catDestino = {};


	$scope.openModal = function(cat){

		$scope.button = {id:0, name:"Seleccione tipo de Reselling"};
		$scope.actions = [{id:1 , name:'Día'}, {id:2 , name:'Mes'}];

		$scope.button2 = '';
		$scope.actions2 = [];

		$scope.currentTab = 1;

		$scope.toggleModal();
		$scope.titleModal 	= 'Categoría seleccionada: ' + cat.name;
    	$scope.catOrigen 	= cat;
	};

	$scope.selectCategoryCrossSelling = function(cat){
		$scope.tipo = {value:1, description: 'CrossSelling'};
    	$scope.catDestino = cat;
	};

	$scope.selectCategoryCrossProduct = function(cat){
		$scope.tipo = {value:3, description: 'CrossProduct'};
    	$scope.catDestino = cat;    	//generarRelacion();
	};

    $scope.toggleModal = function(){
        $scope.showModal = !$scope.showModal;
    };

	$scope.numbersDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
	$scope.numbersMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

	var generarEvento = function(){
		resetModal();
    	DB.saveRelaciones([{origen:$scope.catOrigen, destino:$scope.catDestino, tipo: $scope.tipo}]);
	}

  	var resetModal = function(){
        $scope.showModal = false;
  	}

	$scope.confirmCrossSelling = function(){
		generarEvento();
	}

	$scope.confirmCrossProduct = function(){
		generarEvento();
	}


////////Reselling ////////

  $scope.change = function(action){
    $scope.button = action;
    if (action.id == 1){
    	$scope.button2 = 'Ingrese cantidad de Días';
    	$scope.actions2 = $scope.numbersDays;
    }else{
	    $scope.button2 = 'Ingrese cantidad de Meses';
	    $scope.actions2 = $scope.numbersMonths;
    }
  };

  $scope.change2 = function(name){
    $scope.button2 = name;
  };

  $scope.confirmReselling = function(){
    if ($scope.button.id > 0 && $scope.button2 > 0) {
    	DB.saveRelaciones([{origen:$scope.catOrigen, reselling:{tipo: {value:$scope.button.id, description:($scope.button.id == 1) ? 'Día/s' : 'Mes/es' }, cantidad: $scope.button2}, tipo: {value:2, description:'ReSelling'} }]);
    	resetModal();
    }else alert('ingrese reselling');
  }

  $scope.relatedCategories = function(){
  	resetModal();
  	$window.location.href = '/relaciones';
  }

//////////////////////////

});