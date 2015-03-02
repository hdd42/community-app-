'use strict';

/**
 * @ngdoc function
 * @name parseApp.controller:PostJobCtrl
 * @description
 * # PostJobCtrl
 * Controller of the parseApp
 */
angular.module('parseApp')
  .controller('PostJobCtrl', function ($scope,jobsFactory,general,$http,$location,$rootScope) {
    if (!$rootScope.sessionUser) {
      $rootScope.returnUrl = $location.path();
      $location.path("/login");
    }


  $scope.requirement = "";
  $scope.niceToHave = "";

    $scope.job  = {};//.requirements
    $scope.job.requirements = [];
    $scope.job.nice_to_have = [];
    $scope.job.key_responsibilities = [];
    $scope.job.companyState = "";
    $scope.job.about_company =[];
    $scope.job.levels = [];
    $scope.job.user = Parse.User.current();
    $scope.states= general.getStates();
    $scope.cities = [];


  $scope.addRequirements = function () {
    $scope.job.requirements.push($scope.requirement);
    $scope.requirement = "";
  }
  $scope.removeRequirement = function (r) {
      var index =  $scope.job.requirements.indexOf(r);
      $scope.job.requirements.splice(index,1);
    }

    $scope.addNiceToHave = function () {
      $scope.job.nice_to_have.push($scope.niceToHave);
      $scope.niceToHave = "";
    }
    $scope.removeNiceToHave = function (n) {
      var index =  $scope.job.requirements.indexOf(n);
      $scope.job.nice_to_have.splice(index,1);
    }

    $scope.addResponsibilities = function () {
      $scope.job.key_responsibilities.push($scope.responsibility);
      $scope.niceToHave = "";
    }
    $scope.removeResponsibilities = function (n) {
      var index =  $scope.job.key_responsibilities.indexOf(n);
      $scope.job.key_responsibilities.splice(index,1);
    }


    $scope.$watch('job.companyState', function (oldValue,newValue) {

      if(oldValue){
        $scope.cities = [];
        var url ="http://gomashup.com/json.php?fds=geo/usa/zipcode/state/"+oldValue+"&callback=JSON_CALLBACK";
        $http.jsonp(url).then(function (data) {

        var cities =data.data || data.data.result;

          cities.result.forEach(function (item) {
            $scope.cities.push(item.City+" - "+item.Zipcode);
          })

        }, function (error) {
          console.log(error)
        });


      }
      return;
    })

    $scope.publish = function () {

        if (!$rootScope.sessionUser) {
          $rootScope.returnUrl = $location.path();
          $location.path("/login");
        }

      $scope.job.levels = jobLevels();
      $scope.job.title=$scope.job.title.trim();
      $scope.job.about_company.push({size:$scope.job.companySize});
      $scope.job.about_company.push({state:$scope.job.companyState});
      $scope.job.about_company.push({city:$scope.job.companyCity});

      jobsFactory.postJob($scope.job).then(function (data) {

      }, function (error) {
        console.log(error);
      })
    }

    var jobLevels = function () {
      var selectedLevels =[];
     if($scope.candidateLevelsAll){
       selectedLevels.push('All Levels');
     }
      if($scope.candidateLevels9){
        selectedLevels.push('Senior / > 9 Years');
      }
      if($scope.candidateLevels58){
        selectedLevels.push('Medium / 5-8 years');
      }
      if($scope.candidateLevels24){
        selectedLevels.push('2-4 years');
      }
      if($scope.candidateLevels02){
        selectedLevels.push('Entry /0-2');
      }

      return selectedLevels;
    }

  });


