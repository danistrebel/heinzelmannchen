'use strict';

/**
 * Login and marketing stuff.
 */
angular.module('heinzelmannchen')
  .controller('LoginCtrl', function ($scope, $location, GithubApi) {

    $scope.authorize = GithubApi.redirectToAuth;

    if(localStorage.heinzAuth) {
      $location.path('/graph')
    }
  });
