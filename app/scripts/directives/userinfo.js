'use strict';

/**
 * @ngdoc directive
 * @name heinzelmannchen.directive:userinfo
 * @description
 * # userinfo
 */
angular.module('heinzelmannchen')
  .directive('userinfo', function (GithubApi, $location) {
    return {
      template: '<div class="user-info" layout="column" layout-align="center center"><div><img ng-src="{{user.avatar_url}}"/></div><div><h4>{{user.name || user.login}}</h4></div><div id="logout" ng-click="logout()">logout</div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        scope.userModel = {};

        GithubApi.user().then(function(data) {
          scope.user = data.data;
        })

        scope.logout = function() {
          localStorage.removeItem('heinzAuth');
          $location.url('/');
        };

      }
    };
  });
