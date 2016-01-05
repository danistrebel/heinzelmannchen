'use strict';

/**
* @ngdoc directive
* @name heinzelmannchen.directive:dependencyGraph
* @description
* # dependencyGraph
*/
angular.module('heinzelmannchen')
.directive('dependencyGraph', function ($rootScope, IssueData, IssueSyntax, graphConfig, HighlightData) {
  return {
    template: '',
    restrict: 'A',
    replace: true,
    link: function postLink(scope, element, attrs) {

      $rootScope.$on('updateGraph', function() {
        var dependencyModel = IssueSyntax.processIssues(IssueData.get());
        redrawGraph(dependencyModel);
        HighlightData.reapplyHighlights();
      })

      var svg = d3.select('#dependency-graph').append('svg')
      .call(graphConfig.zoom.on('zoom', rescale))
      .on('dblclick.zoom', null);

      var graphContainer = svg.append('g').attr("id", "graph-container");
      var issueLinksContainer = graphContainer.append('g');
      var issueNodesContainer = graphContainer.append('g');

      svg.append("svg:defs").selectAll("marker")
        .data([["endBig", 45], ["endDefault", 28]])
        .enter().append("svg:marker")
        .attr("id", function(d) { return d[0];})
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", function(d) { return d[1];})
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");

      var userAvatars = svg.append('svg:defs');


      var allLinks = function() {return issueLinksContainer.selectAll(".link"); };
      var allNodes = function() {return issueNodesContainer.selectAll('.node'); };
      var allAvatars = function() {return userAvatars.selectAll(".avatar"); };

      var force = d3.layout.force()
        .charge(-300)
        .linkDistance(80)
        .on("tick", function() {
          allLinks().attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

          allNodes().attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
        });

      function rescale() {
        var trans = d3.event.translate;
        var scale = d3.event.scale;
        graphContainer.attr('transform', 'translate(' + trans + ') scale(' + scale + ')');
      }

      function dragstarted() { // jshint ignore:line
        d3.event.sourceEvent.stopPropagation();
      }

      function redrawGraph(dependencies) {

        var width = document.getElementById('dependency-graph').clientWidth - 10;
        var height = document.getElementById('dependency-graph').parentNode.clientHeight - 10;

        force.size([width, height]);
        svg.attr("width", width).attr("height", height);

        function buildDependenciesGraph(dependencies) {
          function makeNodes(type) {
            return _.map(_.values(dependencies[type]), function(e) {e.type = type; return e;});
          }

          var users = makeNodes("users");
          var issues = makeNodes("issues");
          var milestones = makeNodes("milestones");
          var nodes = _.union(users, issues, milestones);
          var links = [];

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
            links.push({
              source: dependencies.issues[dep.source],
              target: dependencies.issues[dep.target]
            });
          });

          return {
            nodes: nodes,
            links: links,
            users: users
          };
        }

        var graph = IssueSyntax.buildDependenciesGraph(dependencies);

        force
          .nodes(graph.nodes)
          .links(graph.links)
          .start();

        var drag = force.drag()
          .origin(function(d) { return d; })
          .on('dragstart', dragstarted);

        //Update user avatars (Github User Avatar)
        var avatarsUpdate = allAvatars().data(graph.users, function(d) { return d.id; })
        avatarsUpdate.enter().append("pattern")
          .attr("id", function(d) { return "avatar_" + d.id; })
          .attr("width", "20")
          .attr("height", "20")
          .attr("x", 0)
          .attr("y", 0)
          .attr("viewbox", "0 0 20 20")
          .append("svg:image")
          .attr("xlink:href", function(d) { return d.avatar_url; })
          .attr("width", 40)
          .attr("height",40)
          .attr("x", 0)
          .attr("y", 0)
          .attr("class", "avatar");

        avatarsUpdate.exit().remove();

        //Update issue links
        var linksUpdate = allLinks().data(graph.links)

        linksUpdate.enter().append("line")
          .attr("class", "link")
          .attr("marker-end", function(d) {
            if (d.target.type === "users") {
              return "url(#endBig)";
            } else {
              return "url(#endDefault)";
            }
          });

        linksUpdate.exit().remove();

        //Update issue nodes
        var nodesUpdate = allNodes().data(graph.nodes, function(d) { return d.id; });

        nodesUpdate.enter().append('circle')
          .attr('class', function(d) {
            var classes = 'node';
            classes += ' ' + d.type;
            return classes;
          })
          .attr("number", function(d) { return d.number; })
          .attr("type", function(d) { return d.type; })
          .style("fill", function(d) {
            if(d.type === 'users') {
              return "url(#avatar_" + d.id + ")";
            }
          })
          .attr("r", function(d) {
            if(d.type === "users") {
              return 20;
            } else {
              return 10;
            }
          })
          .on('click', function(d, ev) {   if (d3.event.defaultPrevented || !d.html_url) {return;} window.open(d.html_url, '_blank').focus();})
          .call(drag)
          .append("title").text(IssueSyntax.nodeLabel);


        nodesUpdate.exit().remove();

      }


    }
  };
});
