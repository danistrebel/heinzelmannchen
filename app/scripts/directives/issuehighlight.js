'use strict';

angular.module('heinzelmannchen')
  .directive('issueHighlight', function () {
    return {
      templateUrl: 'views/issuehighlight.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.highlightModel = {
          terms: []
        };

        function highlightTermMatch(searchKey) {
          var matches = d3.selectAll('circle[number="' + searchKey + '"]');
          if(matches.length>0) {
            matches.classed('searched', true).classed('pulse', true);
          } else {
            console.debug('No node found for search: ' + searchKey);
          }
        }

        function clearHighlights() {
          d3.selectAll('circle').classed('pulse', false).classed('searched', false);
        }

        scope.searchByTerm = function() {
          d3.selectAll('circle.pulse').classed('pulse', false);
          highlightTermMatch(scope.highlightModel.search);
          scope.highlightModel.terms.push(scope.highlightModel.search);
          scope.highlightModel.search = '';
        };

        scope.removeTermAtIndex = function(i) {
          scope.highlightModel.terms.splice(i, 1);
          clearHighlights();
          _.each(scope.highlightModel.terms, function(term) {
            highlightTermMatch(term);
          });
        }

        scope.resetHighlights = function() {
          scope.highlightModel.terms = [];
          clearHighlights();
        }
      }
    };
  });
