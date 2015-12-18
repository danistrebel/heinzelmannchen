'use strict';

angular.module('heinzelmannchen')
  .controller('HeinzCtrl', function (GithubApi, $rootScope, IssueData, $routeParams, $location) {

    if($routeParams.repo) {
      if( typeof $routeParams.repo === 'string' ) {
        loadRepoIssues($routeParams.repo);
      } else if( Object.prototype.toString.call( $routeParams.repo ) === '[object Array]' ) {
        _.each($routeParams.repo, function(repo) {loadRepoIssues(repo);});
      } else {
        alert('Your query paramerter contained unexpected data.');
      }
    } else {
      $location.search('repo', 'cotiviti/heinzelmannchen')
      GithubApi.loadIssues('cotiviti', 'heinzelmannchen');
    }

    function loadRepoIssues(repoString) {
      var split = repoString.split('/');
      if(split.length === 2) {
        GithubApi.loadIssues(split[0], split[1]);
      } else {
        console.error('invalid repo string: ' + repoString);
      }
    }

  });
