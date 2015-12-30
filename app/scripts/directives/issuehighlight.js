'use strict';

angular.module('heinzelmannchen')
  .directive('issueHighlight', function (GraphApi, $mdToast, HighlightData) {
    return {
      templateUrl: 'views/issuehighlight.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.highlightModel = {
          terms: HighlightData.get()
        };

        scope.searchByTerm = function() {
          var found = HighlightData.add(scope.highlightModel.search);
          if (found.ok) {
            scope.highlightModel.terms = HighlightData.get();
            scope.highlightModel.search = '';
          } else {
            toastMessage(found.error);
          }
        };

        scope.removeTermAtIndex = function(i) {
          scope.highlightModel.terms.splice(i, 1);
          GraphApi.clearAllHighlights();
          _.each(scope.highlightModel.terms, function(term) {
            GraphApi.highlightTermMatch(term);
          });
        }

        scope.resetHighlights = function() {
          HighlightData.clearAll();
        }

        function toastMessage(msg) {
          $mdToast.show(
            $mdToast.simple()
              .textContent(msg)
              .position('top right')
              .hideDelay(2000)
          );
        }
      }
    };
  });
