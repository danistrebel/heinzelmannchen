define(["jquery", "underscorejs"], function ($, underscore) {

  function apiURI(repo) {
    return "https://api.github.com/repos/" + repo.org + "/" + repo.name + "/issues?per_page=100";
  }

  //controls remaining pagination loads
  var remainingPages = {};

  function loadIssuesPage(heinzConfig, apiURI, page) {

    var requestUrl = apiURI + (page ? "&page=" + page : "");

    return $.ajax({
             url: requestUrl ,
             type: "GET",
             cache: false,
             beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'token ' + heinzConfig.authToken);},
             success: function(res, status, xhr) {
               var pagination = xhr.getResponseHeader("link");
               if (pagination && pagination.indexOf('rel="next"') > 0) {
                  if(!remainingPages[apiURI]) {
                    remainingPages[apiURI] = 1;
                  }
                  remainingPages[apiURI] = remainingPages[apiURI] + 1;
               } else if (remainingPages[apiURI]) {
                 delete remainingPages[apiURI];
               }
             }
          });
  }

  function loadIssues(heinzConfig, success) {
    //load issues for all repos configured in the config file
    var issuePromises = _.map(heinzConfig.repos, function(repo) { return loadIssuesPage(heinzConfig, apiURI(repo));});
    waitForPromises(heinzConfig, issuePromises, [], success);
  }

  function waitForPromises(heinzConfig, issuePromises, paginatedIssues, success) {
    Promise.all(issuePromises).then(function() {
        var issues = _.union(paginatedIssues, _.flatten(arguments));
        if(_.keys(remainingPages).length === 0) {
          success(issues);
        } else {
          var extendedPromises = _.map(_.pairs(remainingPages), function(pair) { return loadIssuesPage(heinzConfig, pair[0], pair[1]); });
          waitForPromises(heinzConfig, extendedPromises, issues, success);
        }
      }, function(err) {
      console.error(err);
    });
  }

  return {
    loadIssues: loadIssues
  };
});
