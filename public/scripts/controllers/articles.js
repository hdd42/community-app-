'use strict';

/**
 * @ngdoc function
 * @name parseApp.controller:ArticlesCtrl
 * @description
 * # ArticlesCtrl
 * Controller of the parseApp
 */
angular.module('parseApp')
  .controller('ArticlesCtrl', function ($scope,articleFactory) {

        $scope.articles = [];

        articleFactory.getAllArticles().then(function (result) {
           $scope.articles = result;
        });

  });
