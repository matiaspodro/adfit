angular.module('LoginCtrl', []).controller('LoginController', function($scope, $http, ML) {
	$scope.login = function(){
		ML.login().then(function(data){
		    console.log(data);
		});
	};

	ML.isLogged().then(function(data){
	    $scope.nickname = data.profile_user.nickname;
	});

	$scope.login();

});