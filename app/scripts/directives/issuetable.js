'use strict';

angular.module('heinzelmannchen')
  .directive('issueTable', function ($rootScope, IssueData) {
    return {
      templateUrl: 'views/issuetable.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        $rootScope.$on('updateGraph', function() {
          var issues = IssueData.get();

          var milestones = _.uniq(_.pluck(issues, 'milestone'));
          scope.indexedMilestones = _.indexBy(milestones, 'id');
          scope.issuesByMilestone = _.groupBy(issues, function(issue){
            if(issue.milestone) {
              return issue.milestone.id;
            } else {
              return -1;
            }
          });
        });

      }
    };
  });
