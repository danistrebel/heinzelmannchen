'use strict';

angular.module('heinzelmannchen')
  .service('GithubApi', function ($http, IssueData, $window, authProxyUrl, $location) {

    function getToken() {
      return localStorage.heinzAuth;
    }

    function redirectToAuth() {
      var hash = $window.location.hash;
      var queryParamStart = hash.indexOf('?');
      var searchString = queryParamStart > 0 ? hash.substr(queryParamStart) : '';
      $window.location.href = authProxyUrl + searchString;
    }

    function checkToken() {
      var token = getToken()
      if(!token) {
        redirectToAuth();
      }
    }

    function issueURI(org, repo, page) {
      var pageParam = page ? '&page=' + page : '';
      return 'https://api.github.com/repos/' + org + '/' + repo + '/issues?per_page=100' + pageParam;
    }

    function loadIssues(org, repo, page) {
      checkToken()

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

    function userPromise() {
      checkToken()
      return $http.get('https://api.github.com/user', { headers: {'Authorization': 'token ' + getToken()}})
    }

    return {
      loadIssues: loadIssues,
      user: userPromise,
      redirectToAuth: redirectToAuth
    };
  });
