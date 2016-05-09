angular.module('categoryDirective', []).directive('category', ['$compile', function($compile) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      padre: '=padre',
      padreVisible: '=padreVisible',
      callbackModal: '=callbackModal',
      selected: '=selected'
    },
    templateUrl: 'js/directives/views/categoria.html',
    link: function (scope) {
      scope.visible = true;
      scope.visible2 = true;
      scope.destinoId = '';
    },    
    compile: function (el) {
        var contents = el.contents().remove();
        var compiled;
        return function(scope,el){

            scope.doClick = function(a){
              scope.destinoId = a.id;
              scope.callbackModal(a);
            };


            if(!compiled)
                compiled = $compile(contents);
            
            compiled(scope,function(clone){
                el.append(clone);
            });

        };
    }
  };
}]);