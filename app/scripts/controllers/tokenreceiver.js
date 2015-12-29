'use strict';

/**
 * Accepts a access_token as query param and stores it locally.
 */
angular.module('heinzelmannchen')
  .controller('TokenReceiverCtrl', function ($location, $routeParams) {
    if($routeParams.access_token) {
      var token = $routeParams.access_token;
      localStorage.heinzAuth = token;
      //Clear auth related query params
      $location.search('access_token', null);
      $location.search('scope', null);
      $location.search('state', null);
      $location.search('token_type', null);
      //Keeps any other query params which we might have added
      $location.path('/graph');
    }
  });
