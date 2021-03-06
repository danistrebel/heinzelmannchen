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
  })
  .constant('authProxyUrl', 'https://heinzelmannchen.herokuapp.com/get_code')
  .constant('defaultHighlightColor', '#64dd17')
  .constant('defaultHighlightShape', 'c');
