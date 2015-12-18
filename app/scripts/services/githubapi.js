'use strict';

angular.module('heinzelmannchen')
  .service('GithubApi', function ($http, IssueData, $window, authProxyUrl, $location) {

    function getToken() {
      return localStorage.heinzAuth;
    }

    function redirectToAuth() {
      $window.location.href = authProxyUrl + '?redirectTo=' + $location.url();
    }

    function issueURI(org, repo, page) {
      var pageParam = page ? '&page=' + page : '';
      return 'https://api.github.com/repos/' + org + '/' + repo + '/issues?per_page=50' + pageParam;
    }

    function loadIssues(org, repo, page) {
      var token = getToken()
      if(!token) {
        redirectToAuth();
      }
      var url = issueURI(org, repo, page)
      console.debug('loading: ' + url);
      $http.get(url, { headers: {'Authorization': 'token ' + getToken()}}).then(function (response) {
        //Add issues to the data store
        IssueData.add(response.data);

        //Check for paginated content
        var linkHeader = response.headers('link');
        if (linkHeader && linkHeader.indexOf('rel="next"') > 0) {
          loadIssues(org, repo, (page||1)+1);
        }
      }, function (response) {
        if(response.status === 401) {
          redirectToAuth();
        } else {
          console.error(data);
        }
      });
    }

    return {
      loadIssues: loadIssues
    };
  });
