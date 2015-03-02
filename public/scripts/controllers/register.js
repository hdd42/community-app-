'use strict';

/**
 * @ngdoc function
 * @name parseApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the parseApp
 */
angular.module('parseApp')
  .controller('RegisterCtrl', function ($rootScope,$scope, userFactory,$location ) {
    //{"name":"weewrwe","email":"email@emil.com","password":"123456","confirmPassword":"123456"}

    $scope.signinError = false;

    $scope.signUp = function () {

      userFactory.signUp($scope.signup).then(function (signedUp) {
        $rootScope.sessionUser =JSON.parse(JSON.stringify(signedUp));
        $location.path('/');
      }, function (error) {
       $scope.signinError=error;
      });
    }


  });
