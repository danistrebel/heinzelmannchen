'use strict';

angular.module('heinzelmannchen')
  .controller('HeinzCtrl', function ($routeParams, $location, RepoData) {


    //load repos from query parameter or set a default placeholder repo
    if($routeParams.repo) {
      if( typeof $routeParams.repo === 'string' ) {
        RepoData.addRepoString($routeParams.repo);
      } else if( Object.prototype.toString.call( $routeParams.repo ) === '[object Array]' ) {
        _.each($routeParams.repo, function(repo) { RepoData.addRepoString(repo);});
      } else {
        alert('Your query paramerter contained unexpected data.');
      }
    } else {
      RepoData.addRepoString('cotiviti/heinzelmannchen');
    }

  });
