'use strict';

angular.module('heinzelmannchen')
  .directive('issueInsights', function (InsightsData, $rootScope) {
    return {
      templateUrl: 'views/issueinsights.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.insightsModel = {
          dependenciesShown : true
        };

        InsightsData.model.dependenciesShown = true;

        scope.toggleDependencyCounts = function() {
          scope.insightsModel.dependenciesShown = !scope.insightsModel.dependenciesShown;
          InsightsData.model.dependenciesShown = scope.insightsModel.dependenciesShown;
          $rootScope.$broadcast('updateGraph');
        }
      }
    };
  });
