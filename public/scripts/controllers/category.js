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
        $scope.tab_1 ='active'
    if ($routeParams.topic) {
            var topic = $routeParams.topic;
            if(topic == 'articles') {
                $scope.tab_1 = '';
                $scope.tab_2 = 'active';
            }
            }

    $scope.questions = [];
    $scope.articles = [];

    $rootScope.pageTitle = "Category";
    var catId =$routeParams.id;

    $scope.category={};

   categoryFactory.getOneCategory(catId).then(function (category) {

     $scope.category = category;
   })

   categoryFactory.getCategoryQuestions(catId).then(function (questions) {

            $scope.questions = questions;
   }, function (error) {
       console.log(error)
   })

    categoryFactory.getCategoryArticles(catId).then(function (articles) {

            $scope.articles = articles;
        }, function (error) {
            console.log(error)
        })

  });
