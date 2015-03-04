'use strict';

/**
 * @ngdoc function
 * @name parseApp.controller:ArticlesCtrl
 * @description
 * # ArticlesCtrl
 * Controller of the parseApp
 */
angular.module('parseApp')
  .controller('ArticlesCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
