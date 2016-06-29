angular.module('MailerService', []).factory('Mailer', ['$http', '$q', 'DB', function($http, $q, DB) {
	var mailer = {};

	mailer.enviarEmail = function(publicidad, template){	
	    var defered = $q.defer();
	    var promise = defered.promise;


			DB.postMailer({
				'publicidad': publicidad, 
				'template': template, 
				'asunto': 'Hola ' + publicidad.info.nickname + ', te interesa alguno de estos productos?', 
				'email': publicidad.info.email
			}).then(function(data) {
				defered.resolve(data);
			});


        return promise;
	};


	return mailer;
}]);