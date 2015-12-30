'use strict';

/**
 * Allowing modifictions on the existing graph.
 */
angular.module('heinzelmannchen')
  .service('GraphApi', function () {

    function clearAllHighlights() {
      d3.selectAll("circle.searched").style('fill', null);
      d3.selectAll('circle').classed('pulse', false).classed('searched', false);
    }

    function highlightTermMatch(searchModel) {
      var searchKey = searchModel.searchKey;

      var matches = [];

      if(isInteger(searchKey)) {
        matches = matchByIssueNumber(searchModel);
      } else if (isLabelSearch(searchKey)) {
        matches = matchByLabel(searchKey.substr(searchKey.indexOf(':')+1))
      }

      if(matches.length>0  && matches[0].length>0) {
        matches.classed('searched', true).classed('pulse', true);
        matches.style('fill', searchModel.color);
        return true;
      } else {
        console.debug('No node found for search: ' + searchKey);
        return false;
      }
    }

    function isInteger(x) { return Math.round(x) === parseInt(x, 10) };

    function isLabelSearch(s) { return s.indexOf('label:') === 0; }

    function matchByIssueNumber(searchModel) {
      return d3.selectAll('circle.issues[number="' + searchModel.searchKey + '"]');
    }

    function matchByLabel(label) {
      return d3.selectAll('circle.issues').filter(function(d) {
        return _.some(d.labels, function(dLabel) {
          return dLabel.name.toLowerCase() == label.toLowerCase();
        })
      });
    }

    function clearAllPulse() {
      d3.selectAll('circle.pulse').classed('pulse', false);
    }

    return {
      clearAllHighlights: clearAllHighlights,
      highlightTermMatch: highlightTermMatch,
      clearAllPulse: clearAllPulse
    };
  });
