angular.module('templateDirective', []).directive('formInput', [function() {
return {
        restrict: 'E',
        scope: {
          publicidad: '=publicidad'
        },
        compile: function(element, attrs) {
            return function(scope,element){
                var htmlText = '<div class="">' + scope.publicidad.info.email +'</div>';
                element.replaceWith(htmlText);
            }
        }
    };
}]);