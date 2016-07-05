angular.module('EventosCtrl', ['ui.bootstrap']).controller('EventosController', function($scope, $http, ML, DB) {

	$scope.filteredEventos 		= [];
	$scope.eventos 					= [];
	$scope.maxSize 					= 5;
	$scope.isActive					= true;
  
	$scope.numPages = function () {
    	return Math.ceil($scope.eventos.length / $scope.numPerPage);
  	};
  
  	$scope.$watch('currentPage + numPerPage', function() {
    	var begin 	= (($scope.currentPage - 1) * $scope.numPerPage)
    	, end 		= begin + $scope.numPerPage;
    
    	//$scope.filteredEventos = $scope.eventos.slice(begin, end);


    	var evs = $scope.eventos.slice(begin, end);
		var i = 0;

		angular.forEach(evs, function(ev) {
			ML.getItem(ev.product_id).then(function(item) {
				ev.thumbnail = item.secure_thumbnail;
				ev.title = item.title;
				i++;
				if (evs.length == i){
					$scope.filteredEventos = evs;
				}

			});
		});

  	});
      
  	var array = function(object){
	  	return $.map(object, function(value, index) {
		    return [value];
		});
  	}

	DB.getEventos().then(function(data) {
		$scope.eventos 		= array(data);
		$scope.currentPage 		= 1;
		$scope.numPerPage 		= 10;
		$scope.isActive			= false;
	});



	$scope.procesarReselling = function(){

		DB.generateReselling({}).then(function(data) {

		});
	};

	$scope.tituloTipo = function(tipo){
		if (tipo == '1') return 'CrossSelling';
		else if (tipo == '2') return 'Reselling';
		else if (tipo == '3') return 'CrossProduct';
		else return '';
	};

});