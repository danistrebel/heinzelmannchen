'use strict';

/**
 * @ngdoc service
 * @name heinzelmannchen.IssueSyntax
 * @description
 * # IssueSyntax
 * Service in the heinzelmannchen.
 */
angular.module('heinzelmannchen')
  .service('IssueSyntax', function () {

    function processIssues(issues) {
      var milestones = {};
      var users = [];
      var milestoneDependencies = [];
      var userDependencies = [];
      var indicationDependencies = [];

      //extract dependencies from the graph
      _.each(issues, function(issue) {
        if(issue.milestone) {
          if(!milestones[issue.milestone.id]) {
            milestones[issue.milestone.id] = issue.milestone;
          }
          milestoneDependencies.push({milestone: issue.milestone.id, issue: issue.id});
        }

        if(issue.assignee) {
          if(!users[issue.assignee.id]) {
            users[issue.assignee.id] = issue.assignee;
          }
          userDependencies.push({user: issue.assignee.id, issue: issue.id});
        }
        var dependentIssues = findIssueDependencies(issue).map(function(dependentIssueUrl) {
          return _.find(issues, function(otherIssue) {
              return otherIssue.html_url == dependentIssueUrl;
            }) || dependentIssueUrl;
        });
        _.each(dependentIssues, function(dependentIssue) {
          if(dependentIssue.id) {
            indicationDependencies.push({
              source: issue.id,
              target: dependentIssue.id
            });
          } else {
            console.warn("Referenced issue " + dependentIssue + " was not found as referenced in " + issue.html_url);
          }
        });
      });

      return {
        issues: _.indexBy(issues, 'id'),
        users : users,
        milestones: milestones,
        milestoneDependencies: milestoneDependencies,
        userDependencies: userDependencies,
        indicationDependencies: indicationDependencies
      };
    }

    function parseIssueDependency(url, defaultOrg, defaultRepo) {
      var re = /\* \[ \] (\#|https:\/\/github\.com\/(.*)\/(.*)\/issues\/)(\d+).*/g;
      var issueDependencies = [];
      var match;
      while (match = re.exec(url)) {
        var number = match[4];
        var org = match[2] || defaultOrg;
        var repo = match[3] || defaultRepo
        issueDependencies.push("https://github.com/" + org + "/" + repo + "/issues/" + number);
      }
      return issueDependencies;
    }

    function parseIssueUrl(url) {
      var re = /https:\/\/github\.com\/(.*)\/(.*)\/(issues|pull)\/\d+.*/g;
      var match = re.exec(url);
      var org = "???";
      var repo = "???"
      if(match) {
        var org = match[1];
        var repo = match[2];
      }

      return {org: org, repo: repo};
    }

    function findIssueDependencies(issue) {

      if(!issue.body) {
        return [];
      }

      var parsedIssueUrl = parseIssueUrl(issue.html_url);
      var issueOrg = parsedIssueUrl.org;
      var issueRepo = parsedIssueUrl.repo;

      var startDependenciesSection = issue.body.indexOf("# Dependencies");
      if(startDependenciesSection<0) {
        return [];
      } else {
        var dependenciesSection = issue.body.substring(startDependenciesSection);
        return parseIssueDependency(dependenciesSection, issueOrg, issueRepo);
      }
    }

    function nodeLabel(node) {
      if(node.heinzTitle) {
        return node.heinzTitle;
      }
      var title = undefined;
      if(node.type === 'users') {
        title = node.login;
      } else if(node.type === 'issues') {
        title = parseIssueUrl(node.html_url).repo + "#" + node.number + " - " + node.title;
      } else if(node.type === 'milestones') {
        title = "M - " + node.title;
      }
      node.heinzTitle = title;
      return title;
    }

    function buildDependenciesGraph(dependencies) {
      function makeNodes(type) {
        return _.map(_.values(dependencies[type]), function(e) {e.type = type; return e;});
      }

      var users = makeNodes("users");
      var issues = makeNodes("issues");
      var milestones = makeNodes("milestones");
      var nodes = _.union(users, issues, milestones);
      var links = [];
      var issueDependencyTracker = {}

      // assemble milestone -> issue dependencies
      _.each(dependencies.milestoneDependencies, function(dep) {
        links.push({
          source: dependencies.milestones[dep.milestone],
          target: dependencies.issues[dep.issue]
        });
      });

      // assemble issue -> user dependencies
      _.each(dependencies.userDependencies, function(dep) {
        links.push({
          source: dependencies.issues[dep.issue],
          target: dependencies.users[dep.user]
        });
      });

      _.each(dependencies.indicationDependencies, function(dep) {

        var sourceIssue = dependencies.issues[dep.source];
        var targetIssue = dependencies.issues[dep.target];

        if(!targetIssue.incomming) {
          targetIssue.incomming = [];
        }
        targetIssue.incomming.push(dep.source);

        if(!sourceIssue.outgoing) {
          sourceIssue.outgoing = [];
        }
        sourceIssue.outgoing.push(dep.target);

        if(!targetIssue.incommingDependenciesCount) {
          targetIssue.incommingDependenciesCount = 1;
        } else {
          targetIssue.incommingDependenciesCount += 1;
        }

        issueDependencyTracker[dep.target] = true;

        links.push({
          source: sourceIssue,
          target: targetIssue
        });
      });

      //propagate dependencies count
      while(!_.isEmpty(issueDependencyTracker)) {
        var newTracker = {};
        _.each(_.keys(issueDependencyTracker), function(dependencyId) {
          var targetIssue = dependencies.issues[dependencyId];
          var sourcesDependencySums = _.map(targetIssue.incomming, function(sourceIssueId) {
            var sourceIssue = dependencies.issues[sourceIssueId];
            return (sourceIssue.incommingDependenciesCount || 0) + 1;
          });

          var dependencySum = _.reduce(sourcesDependencySums, function(memo, num){ return memo + num; }, 0);

          if(targetIssue.incommingDependenciesCount !== dependencySum) {
            targetIssue.incommingDependenciesCount = dependencySum;
            if(targetIssue.outgoing) {
              _.each(targetIssue.outgoing, function(outgoingId){
                newTracker[outgoingId] = true;
              });
            }
          }
        })
        issueDependencyTracker = newTracker;
      }

      _.each(dependencies.issues, function(issue) {
        delete issue.incomming;
        delete issue.outgoing;
      })

      return {
        nodes: nodes,
        links: links,
        users: users
      };
    }

    return {
      processIssues: processIssues,
      parseIssueUrl: parseIssueUrl,
      nodeLabel: nodeLabel,
      buildDependenciesGraph: buildDependenciesGraph
    }
  });
