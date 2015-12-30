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
          var searchModel = {searchKey: scope.highlightModel.search};
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
          HighlightData.remove(scope.highlightModel.terms[i]);
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
