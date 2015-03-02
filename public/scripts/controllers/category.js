'use strict';

/**
 * @ngdoc function
 * @name parseApp.controller:CategoryCtrl
 * @description
 * # CategoryCtrl
 * Controller of the parseApp
 */
angular.module('parseApp')
  .controller('CategoryDetailCtrl', function ($scope,$routeParams,$rootScope,categoryFactory) {

    if (!$routeParams.id) {
      $location.path("/");
    }
    $rootScope.pageTitle = "Category";
    var catId =$routeParams.id;

    $scope.category={};

   categoryFactory.getOneCategory(catId).then(function (category) {

     $scope.category = category;
   })

  });
