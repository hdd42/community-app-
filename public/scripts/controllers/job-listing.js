'use strict';

/**
 * @ngdoc function
 * @name parseApp.controller:JobListingCtrl
 * @description
 * # JobListingCtrl
 * Controller of the parseApp
 */
angular.module('parseApp')
  .controller('JobListingCtrl', function ($scope,jobsFactory,$location,$routeParams) {



    $scope.jobList =null;
    $scope.job =null;

    if (!$routeParams.title) {
      jobsFactory.getAllJobs().then(function (data) {
        $scope.jobList = data;

      });
    }
    else{
        var title = $routeParams.title.split('-').join(' ');

      console.log(title);
      jobsFactory.getOneJob(title).then(function (data) {
        console.log(data);
        $scope.job = data;

      });
    }

  });
