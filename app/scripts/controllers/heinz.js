'use strict';

angular.module('heinzelmannchen')
  .controller('HeinzCtrl', function ($routeParams, $location, RepoData, HighlightData, $scope, $mdSidenav) {


    //load repos from query parameter or set a default placeholder repo
    handleRouteParams('repo',
      function(repoString) { RepoData.addRepoString(repoString); },
      function() { RepoData.addRepoString('cotiviti/heinzelmannchen'); }
    )

    //load highlights from query parameters
    handleRouteParams('hl', function(highlight) { HighlightData.silentAdd({ searchKey: highlight}); });

    function handleRouteParams(paramName, paramHandler, missingParamAction) {
      if($routeParams[paramName]) {
        if( typeof $routeParams[paramName] === 'string' ) {
          paramHandler($routeParams[paramName]);
        } else if( Object.prototype.toString.call( $routeParams[paramName] ) === '[object Array]' ) {
          _.each($routeParams[paramName], function(param) { paramHandler(param);});
        } else {
          alert('Your query paramerter contained unexpected data in param '+paramName+'.');
        }
      } else if (missingParamAction) {
        missingParamAction();
      }
    }

    $scope.toggleSideNav = function() {
      $mdSidenav('right').toggle();
    }

  });
