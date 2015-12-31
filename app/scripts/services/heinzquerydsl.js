'use strict';

angular.module('heinzelmannchen')
  .service('QueryDSL', function () {

    function isIntegerSearch(x) { return Math.round(x) === parseInt(x, 10) };

    function isLabelSearch(s) { return s.indexOf('label:') === 0; }

    function isTimestampSearch(s) {
      return s.indexOf('created:') === 0 || s.indexOf('updated:') === 0;
    }

    function toPeriodMillis(period) {
      var match = period.match(/([0-9]+)\s?(s|sec|second|m|min|minute|h|hour|d|day|w|week)?s?$/);
      if(match && match.length === 3) {
        var unitValue = match[1];
        switch (match[2]) {
          case 'w':
          case 'week':
            unitValue *= 7;
          case 'd':
          case 'day':
            unitValue*= 24
          case 'h':
          case 'hour':
            unitValue *= 60
          case 'm':
          case 'min':
          case 'minute':
            unitValue *= 60
          case 's':
          case 'sec':
          case 'second':
            return unitValue*1000;
          default:
            return -1;
        }
      } else {
        console.debug('Unrecognized format in :' + period);
        console.debug(match)
        return -1;
      }
    }


    return {
      isIntegerSearch: isIntegerSearch,
      isLabelSearch: isLabelSearch,
      isTimestampSearch: isTimestampSearch,
      toPeriodMillis: toPeriodMillis
    }

  });
