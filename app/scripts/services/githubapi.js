'use strict';

angular.module('heinzelmannchen')
  .service('GithubApi', function ($http, IssueData) {

    function getToken() {
      return localStorage.heinzAuth;
    }

    function issueURI(org, repo, page) {
      var pageParam = page ? '&page=' + page : '';
      return 'https://api.github.com/repos/' + org + '/' + repo + '/issues?per_page=50' + pageParam;
    }

    function loadIssues(org, repo, page) {
      var url = issueURI(org, repo, page)
      console.debug('loading: ' + url);
      $http.get(url, { headers: {'Authorization': 'token ' + getToken()}}).success(function (data, status, headers) {
        //Add issues to the data store
        IssueData.add(data);

        //Check for paginated content
        var linkHeader = headers('link');
        if (linkHeader && linkHeader.indexOf('rel="next"') > 0) {
          loadIssues(org, repo, (page||1)+1);
        }
      });
    }

    return {
      loadIssues: loadIssues
    };
  });
