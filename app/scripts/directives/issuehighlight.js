'use strict';

angular.module('heinzelmannchen')
  .directive('issueHighlight', function (GraphApi, $mdToast, HighlightData, defaultHighlightColor, defaultHighlightShape) {
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
            color: defaultHighlightColor,
            shape: defaultHighlightShape
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
        };

        scope.updateHighlight = function() {
          HighlightData.reapplyHighlights();
        };

        function toastMessage(msg) {
          $mdToast.show(
            $mdToast.simple()
              .textContent(msg)
              .position('top right')
              .hideDelay(2000)
          );
        }

        scope.shapeIcon = function(t) {
          var iconMap = {
            c: 'circle',
            o: 'outline',
            h: 'hidden'
          }
          return iconMap[t];
        };

        scope.toggleShape = function(i) {
          var shapes = ['c', 'o', 'h'];
          var highlight = scope.highlightModel.terms[i];
          var newShapeIndex = (shapes.indexOf(highlight.shape) + 1) % shapes.length;
          highlight.shape = shapes[newShapeIndex];
          HighlightData.reapplyHighlights();
        }

      }
    };
  });
