angular.module('VistaPreviaCtrl', []).controller('VistaPreviaController', function($scope, $routeParams, $http, ML, DB, Mailer, Publicidad) {

		DB.getOnePublicidad($routeParams.id).then(function(data) {
			$scope.publicidad = data;

			Publicidad.obtenerProductosRandom($scope.publicidad).then(function(prods){
				$scope.productos = prods;
			});

		});


	$scope.enviarEmail = function(publicidad){


		var elements = document.getElementsByClassName('template-one');
		console.log(elements[0].outerHTML);
		var template = elements[0].outerHTML;

		Mailer.enviarEmail(publicidad, template).then(function(){
		});


	};




});