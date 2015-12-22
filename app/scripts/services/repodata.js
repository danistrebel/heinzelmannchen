'use strict';

angular.module('heinzelmannchen')
  .service('RepoData', function ($rootScope, GithubApi, $location, IssueData) {

    var repos = [];

    function updateQueryParams() {
      var repoStrings = _.map(getAll(), function(repo) { return repo.org + "/" + repo.name; });
      $location.search('repo', repoStrings);
    }

    function getAll() {
      return repos;
    }

    function addRepo(repo) {
      GithubApi.loadIssues(repo.org, repo.name);
      repos.push(repo)
      updateQueryParams();
    }

    function addRepoString(repoString) {
      var split = repoString.replace(/ /g,'').split('/');
      if(split.length === 2) {
        var repo = { org: split[0], name: split[1]};
        addRepo(repo);
      } else {
        alert('Please provide the repo information in the form of \"org/repo\".')
        console.error('invalid repo string: ' + repoString);
      }
    }

    function clearAll() {
      repos = [];
      IssueData.clear();
      updateQueryParams();
    }

    function removeRepo(repo) {
      repos = _.reject(repos, function(oldRepo) { return oldRepo.name === repo.name && oldRepo.org === repo.org;});
      IssueData.removeIssuesForRepo(repo);
      updateQueryParams();
    }

    return {
      add: addRepo,
      addRepoString: addRepoString,
      clear: clearAll,
      get: getAll,
      remove: removeRepo
    }
  });
