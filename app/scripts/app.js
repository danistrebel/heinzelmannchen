'use strict';

/**
 * @ngdoc overview
 * @name heinzelmannchenApp
 * @description
 * # heinzelmannchenApp
 *
 * Main module of the application.
 */
angular
  .module('heinzelmannchen', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    // 'ngSanitize',
    'ngTouch',
    'ngMaterial'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/graph', {
        templateUrl: 'views/heinz.html',
        controller: 'HeinzCtrl'
      })
      .when('/token', {
        template: '<p>Accepting Token</p>',
        controller: 'TokenReceiverCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function($mdThemingProvider) {
  var cotivityBlueMap = $mdThemingProvider.extendPalette('indigo', {
    '500': '00254A'
  });
  var cotivityYellowMap = $mdThemingProvider.extendPalette('amber', {
    '500': 'FCB43B'
  });
  $mdThemingProvider.definePalette('cotivityBlue', cotivityBlueMap);
  $mdThemingProvider.definePalette('cotivityYellow', cotivityYellowMap);

  $mdThemingProvider.theme('default')
    .primaryPalette('cotivityBlue')
    .accentPalette('cotivityYellow');
  });
