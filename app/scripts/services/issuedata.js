'use strict';

angular.module('heinzelmannchen')
  .service('IssueData', function ($rootScope) {

    var issues = [];

    function broadcastUpdate() {
      $rootScope.$broadcast('updateGraph');
    }

    function getAll() {
      return issues;
    }

    function addIssues(data) {
      for (var i = 0; i < data.length; i++) {
        issues.push(data[i]);
      }
      broadcastUpdate();
    }

    function clearAll() {
      issues = [];
      broadcastUpdate();
    }

    function removeIssuesForRepo(repo) {
      issues = _.reject(issues, function(issue) { return issue.url.indexOf(repo.org + "/" + repo.name) >= 0; });
      broadcastUpdate();
    }

    return {
      add: addIssues,
      clear: clearAll,
      get: getAll,
      removeIssuesForRepo: removeIssuesForRepo
    }
  });
