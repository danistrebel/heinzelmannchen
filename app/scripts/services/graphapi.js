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
      var matches = d3.selectAll('circle[number="' + searchModel.searchKey + '"]');
      if(matches.length>0  && matches[0].length>0) {
        matches.classed('searched', true).classed('pulse', true);
        matches.style('fill', searchModel.color || '#64dd17');
        return true;
      } else {
        console.warn('No node found for search: ' + searchModel.searchKey);
        return false;
      }
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
