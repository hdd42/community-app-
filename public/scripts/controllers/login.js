'use strict';

/**
 * @ngdoc function
 * @name parseApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the parseApp
 */
angular.module('parseApp')
  .controller('LoginCtrl', function ($rootScope,$scope,userFactory,$location) {
   $scope.loginError = false;
    var returnUrl = $rootScope.returnUrl || null;
    $scope.signIn = function () {


      userFactory.logIn($scope.userToLogin).then(function (login) {
        $rootScope.sessionUser=JSON.parse(JSON.stringify(login));
        //console.log($rootScope.sessionUser);

        console.log(returnUrl);
        returnUrl ?  $location.path(returnUrl ) : $location.path('/');



      }, function (error) {
       $scope.loginError = error;
      });
    }
    //userToLogin.login,userToLogin.pass
  });
