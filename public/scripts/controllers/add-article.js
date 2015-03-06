'use strict';

/**
 * @ngdoc function
 * @name parseApp.controller:AddArticleCtrl
 * @description
 * # AddArticleCtrl
 * Controller of the parseApp
 */
angular.module('parseApp')
  .controller('AddArticleCtrl', function ($scope,categoryFactory,articleFactory,$rootScope,ioClientService,$location) {

    if (!$rootScope.sessionUser) {
                $rootScope.returnUrl = $location.path();
                $location.path("/login");
        }


    $rootScope.pageTitle ="New Question";
    $scope.categories =[];
    $scope.tags =[];
    $scope.tags_filter ="";
    $scope.newArticle={};
    $scope.newArticle.body ="";
    $scope.articleTags =[]


    categoryFactory.getAllCategories().then(function (data) {
      $scope.categories = data;
      $scope.categories.forEach(function (item) {
        $scope.tags.push({title:item.title  , id:item.objectId, description:item.description});
      });
    });

    $scope.addTags = function (tag) {
      $scope.articleTags.push(tag);
      var index = $scope.tags.indexOf(tag);
      $scope.tags.splice(index,1);
      //$scope.tags_filter ="";
    }


    $scope.postArticle = function () {
      $scope.newArticle.tags = [];
      $scope.articleTags.forEach(function (t) {
        $scope.newArticle.tags.push({id : t.id ,
          title: t.title
        });
      })


      articleFactory.addNewArticle($scope.newArticle).then(function (result) {
        ioClientService.emit('newArticleCreated',result)
        $location.path('/article/'+result.title.split(' ').join('-')+'/'+result.objectId);

      }, function (error) {
        console.log(error);
      });



    };

  });
