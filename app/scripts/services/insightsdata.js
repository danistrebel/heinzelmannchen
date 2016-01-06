'use strict';

/**
 * @ngdoc service
 * @name heinzelmannchen.InsightsData
 * @description
 * # InsightsData
 * Service in the heinzelmannchen.
 */
angular.module('heinzelmannchen')
  .service('InsightsData', function () {
    var insightsModel = {};

    return {
      model: insightsModel
    };
  });
