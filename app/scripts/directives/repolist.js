'use strict';

/**
 * @ngdoc directive
 * @name heinzelmannchen.directive:repoList
 * @description
 * # repoList
 */
angular.module('heinzelmannchen')
  .directive('repoList', function (RepoData, $rootScope) {
    return {
      templateUrl: 'views/repolist.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        scope.repoModel = {
          repos: RepoData.get()
        }

        scope.addRepo = function(repoString) {
          RepoData.addRepoString(repoString)
          scope.repoModel.search = '';
        }

        scope.resetRepos = function() {
          RepoData.clear();
          scope.repoModel.repos = RepoData.get();
        }

        scope.removeRepoAtIndex = function(index) {
          var repo = scope.repoModel.repos[index];
          RepoData.remove(repo);
          scope.repoModel.repos = RepoData.get();
        }

      }
    };
  });
