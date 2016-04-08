'use strict';

angular.module('heinzelmannchen')
  .service('IssueData', function ($rootScope, IssueSyntax) {

    var issues = [];
    var filter = {};

    function broadcastUpdate() {
      $rootScope.$broadcast('updateGraph');
    }

    function getAll() {
      return issues;
    }

    function getFilteredModel() {
      var unfilteredModel = IssueSyntax.processIssues(issues);
      if (!filter.milestone) {
          return unfilteredModel;
      }

      var milestoneFilter = filter.milestone;


      var filteredMilestoneDependencies = _.filter(unfilteredModel.milestoneDependencies, function(md) { return md.milestone === milestoneFilter; });
      var milestoneIssueIds = _.pluck(filteredMilestoneDependencies, 'issue');

      var fringeIssueIds = _.union(milestoneIssueIds, []);

      while(fringeIssueIds.length !== 0) {
        _.map(fringeIssueIds, function(fringeId) {
          var relatedIssues = _.map(unfilteredModel.indicationDependencies, function(dep) {
            if(dep.source === fringeId) {
              return [dep.source, dep.target];
            }
          });

          var flatIds = _.uniq(_.flatten(relatedIssues));
          var newStuff = _.compact(_.difference(flatIds, milestoneIssueIds));
          milestoneIssueIds = _.union(milestoneIssueIds, flatIds);
          fringeIssueIds = newStuff;
        });

      }

      var userDependencies = _.filter(unfilteredModel.userDependencies, function(ud) { return _.contains(milestoneIssueIds, ud.issue);});
      var userKeys = _.pluck(userDependencies, 'user');

      var filtered =  {
        milestones :[],
        milestoneDependencies: [],
        issues: _.indexBy(_.filter(unfilteredModel.issues, function(i) { return _.contains(milestoneIssueIds, i.id);}), 'id'),
        userDependencies: userDependencies,
        indicationDependencies: _.filter(unfilteredModel.indicationDependencies, function(i) { return (_.contains(milestoneIssueIds, i.source) && _.contains(milestoneIssueIds, i.target));}),
        users: _.indexBy(_.filter(_.values(unfilteredModel.users), function(user) { return _.contains(userKeys, user.id); }), 'id')
      };
      return _.extend(filtered);
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

    function setFilter(newFilter) {
      filter = newFilter;
      broadcastUpdate();
    }

    return {
      add: addIssues,
      clear: clearAll,
      get: getAll,
      removeIssuesForRepo: removeIssuesForRepo,
      getFilteredModel: getFilteredModel,
      setFilter: setFilter
    };
  });
