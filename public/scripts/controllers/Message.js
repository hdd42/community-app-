'use strict';

/**
 * @ngdoc function
 * @name parseApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the parseApp
 */
angular.module('parseApp')
  .controller('MessagesCtrl',['$scope','messageFactory','categoryFactory','$location',
    '$rootScope','ioClientService',
    function ($scope,messageFactory,categoryFactory, $location,$rootScope,ioClientService) {

      $rootScope.pageTitle ="New Question";
    $scope.categories =[];
    $scope.tags =[];
    $scope.tags_filter ="";
    $scope.newQuestion={};
    $scope.newQuestion.body ="";
    $scope.questionTags =[]



    categoryFactory.getAllCategories().then(function (data) {
      $scope.categories = data;
      $scope.categories.forEach(function (item) {
        $scope.tags.push({title:item.title  , id:item.objectId, description:item.description});
      });
    });


      $scope.addTags = function (tag) {
        $scope.questionTags.push(tag);
        var index = $scope.tags.indexOf(tag);
        $scope.tags.splice(index,1);
        //$scope.tags_filter ="";
      }

      $scope.postQuestion = function () {
        $scope.newQuestion.tags = [];
        $scope.questionTags.forEach(function (t) {
          $scope.newQuestion.tags.push({id : t.id ,
          title: t.title
          });
        })


        messageFactory.addNewQuestion($scope.newQuestion).then(function (result) {
          ioClientService.emit('newQuestionCreated',result)
         $location.path('/question/'+result.objectId+'/'+result.title);

        }, function (error) {
          console.log(error);
        });



      };

  }]);
