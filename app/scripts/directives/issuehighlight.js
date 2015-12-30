'use strict';

angular.module('heinzelmannchen')
  .directive('issueHighlight', function (GraphApi, $mdToast, HighlightData, defaultHighlightColor) {
    return {
      templateUrl: 'views/issuehighlight.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.highlightModel = {
          terms: HighlightData.get()
        };

        scope.searchByTerm = function() {
          var searchModel = {
            id: Math.random(),
            searchKey: scope.highlightModel.search,
            color: defaultHighlightColor
          };
          var found = HighlightData.add(searchModel);
          if (found.ok) {
            scope.highlightModel.terms = HighlightData.get();
            scope.highlightModel.search = '';
          } else {
            toastMessage(found.error);
          }
        };

        scope.removeTermAtIndex = function(i) {
          scope.highlightModel.terms.splice(i, 1);
          HighlightData.reapplyHighlights();
        }

        scope.updateHighlight = function() {
          HighlightData.reapplyHighlights();
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
