'use strict';

/**
 * @ngdoc directive
 * @name heinzelmannchen.directive:colorPicker
 * @description
 * # colorPicker
 */
angular.module('heinzelmannchen')
  .directive('colorPicker', function () {
    return {
      templateUrl: 'views/colorpicker.html',
      restrict: 'E',
      scope: {
        color: '='
      }
    };
  });
