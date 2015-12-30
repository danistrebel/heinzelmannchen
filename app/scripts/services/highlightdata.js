'use strict';

angular.module('heinzelmannchen')
  .service('HighlightData', function ($rootScope, GraphApi, $location) {

    var highlights = [];

    function updateQueryParams() {
      $location.search('hl', _.map(highlights, function(hl) { return hl.searchKey;}));
    }

    function getAll() {
      return highlights;
    }

    function silentAdd(data) {
      highlights.push(data);
    }

    function addHighlight(data) {
      GraphApi.clearAllPulse();
      if (_.contains(highlights, data)) {
        return { error: "Issue already highlighted." };
      }
      var found = GraphApi.highlightTermMatch(data);
      if(found) {
        highlights.push(data);
        updateQueryParams();
        return { ok: true};
      } else {
        return { error: "No match found." };
      }
    }

    function clearAll() {
      highlights = [];
      GraphApi.clearAllHighlights();
    }

    function remove(highlight) {
      highlights = _.without(highlights, highlight);
      updateQueryParams();
      reapplyAll();
    }

    function reapplyAll() {
      GraphApi.clearAllHighlights();
      _.each(highlights, function(term) {
        GraphApi.highlightTermMatch(term);
      });
    }


    return {
      add: addHighlight,
      silentAdd: silentAdd,
      remove: remove,
      clear: clearAll,
      reapplyHighlights: reapplyAll,
      get: getAll,
    }
  });
