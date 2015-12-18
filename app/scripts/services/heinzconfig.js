'use strict';

/**
 * @ngdoc service
 * @name heinzelmannchen.heinzConfig
 * @description
 * # heinzConfig
 * Constant in the heinzelmannchen.
 */
angular.module('heinzelmannchen')
  .constant('graphConfig', {
    color : d3.scale.category20(),
    zoom : d3.behavior.zoom()
  });
