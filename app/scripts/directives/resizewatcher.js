'use strict';

angular.module('heinzelmannchen')
  .directive('resizeWatcher', function ($rootScope, $window) {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var width = $window.innerWidth;
        var height = $window.innerHeight;
        angular.element($window).bind('resize', function(){

          if(width !== $window.innerWidth || height !== $window.innerHeight) {
            $rootScope.$broadcast('updateGraph');
          }
          width = $window.innerWidth;
          height = $window.innerHeight;
        });
      }
    };
  });
