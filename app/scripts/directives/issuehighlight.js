'use strict';

angular.module('heinzelmannchen')
  .directive('issueHighlight', function () {
    return {
      templateUrl: 'views/issuehighlight.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.highlightModel = {};

        scope.searchByTerm = function() {
          d3.selectAll("circle.pulse").classed('pulse', false);

          var searchKey = scope.highlightModel.search;
          var matches = d3.selectAll("circle[number='" + searchKey + "']");
          if(matches.length>0) {
            matches.classed('searched', true).classed('pulse', true);
          } else {
            console.debug("No node found for search: " + searchKey);
          }
        };

        scope.resetHighlights = function() {
          d3.selectAll("circle").classed('pulse', false).classed('searched', false);
        }
      }
    };
  });
