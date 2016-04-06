'use strict';

angular.module('heinzelmannchen')
  .directive('issueFilter', function ($rootScope, IssueSyntax, IssueData) {
    return {
      templateUrl: 'views/issuefilter.html',
      restrict: 'E',
      link: function postLink(scope) {

        scope.filterOptions = {
          milestones: []
        };

        scope.filterModel = {
          milestone: null
        };

        $rootScope.$on('updateGraph', function() {
          scope.filterOptions.milestones = _.values(IssueSyntax.processIssues(IssueData.get()).milestones);
        });

        scope.filterChanged = function() {
          IssueData.setFilter(scope.filterModel);
        };
      }
    };
  });
