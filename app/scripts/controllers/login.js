'use strict';

/**
 * Login and marketing stuff.
 */
angular.module('heinzelmannchen')
  .controller('LoginCtrl', function ($location) {
    if(localStorage.heinzAuth) {
      $location.path('/graph')
    }
  });
