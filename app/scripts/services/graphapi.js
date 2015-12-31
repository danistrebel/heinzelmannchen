'use strict';

/**
 * Allowing modifictions on the existing graph.
 */
angular.module('heinzelmannchen')
  .service('GraphApi', function (QueryDSL) {

    function clearAllHighlights() {
      d3.selectAll("circle.searched").style('fill', null).style('stroke', null).style('stroke-width', null);
      d3.selectAll('circle').classed('pulse', false).classed('searched', false);
    }

    function highlightTermMatch(searchModel) {
      //if skip if hidden
      if(searchModel.shape == 'h') {
        return true;
      }

      var searchKey = searchModel.searchKey;

      var matches = [];

      if(QueryDSL.isIntegerSearch(searchKey)) {
        matches = matchByIssueNumber(searchModel);
      } else if (QueryDSL.isLabelSearch(searchKey)) {
        matches = matchByLabel(searchKey.substr(searchKey.indexOf(':')+1));
      } else if (QueryDSL.isTimestampSearch(searchKey)) {
        matches = matchByTimeStamp(
          searchKey.substr(0, searchKey.indexOf(':')),
          searchKey.substr(searchKey.indexOf(':')+1)
        )
      }

      if(matches.length>0  && matches[0].length>0) {
        matches.classed('searched', true);
        if(searchModel.shape == 'o') {
          matches.style('stroke', searchModel.color)
          matches.style('stroke-width', '4px')
        } else if(searchModel.shape == 'c') {
          matches.style('fill', searchModel.color);
        } else {
          // don't do anything
        }
        return true;
      } else {
        console.debug('No node found for search: ' + searchKey);
        return false;
      }
    }



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

    function matchByTimeStamp(kind, period) {
      var periodMillis = QueryDSL.toPeriodMillis(period);
      var todayMillis = (new Date()).getTime();
      return d3.selectAll('circle.issues').filter(function(d) {
        var kindTimeMillis = (new Date(d[kind + '_at'])).getTime();
        return d[kind + '_at'] && (todayMillis - kindTimeMillis < periodMillis);
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
