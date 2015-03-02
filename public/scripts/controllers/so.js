'use strict';

/**
 * @ngdoc function
 * @name parseApp.controller:SoCtrl
 * @description
 * # SoCtrl
 * Controller of the parseApp
 */
angular.module('parseApp')
  .controller('SoCtrl', function ($scope,soFactory,messageFactory,userFactory) {

    $scope.questions = [];
    $scope.userCount = 0;
    $scope.userName = "";
    $scope.question = "";
    $scope.addedQuestion = 0;
   $scope.signedUsers =[];
    $scope.users =[];
    $scope.count= 0;

    soFactory.searchQuestions("MS SQL Server").then(function (data) {
      $scope.questions = data;

      //$scope.register();
    }, function (error) {
      console.log(error);
    })

    $scope.register = function () {

        $scope.questions.items.forEach(function (u) {
          $scope.users.push({name:u.owner.display_name, password:'123456'});
      });



      $scope.users.forEach(function (u) {

        console.log(u);
        userFactory.signUp(u).then(function (signedUp) {
          var user = JSON.parse(JSON.stringify(signedUp));
          u.objectId = user.objectId;
          console.log(u);

          var questionToAdd = $scope.questions.items[$scope.userCount];
          $scope.addMessage(questionToAdd,signedUp);
          $scope.userCount +=1;

        }, function (error) {
          console.log(error);
        });


      });

    }
    $scope.addMessage = function (questionToAdd,user) {



        var q = {};
        q.title = questionToAdd.title;

        q.body = questionToAdd.body;

        q.user = user;
        console.log(user);
        q.views =questionToAdd.view_count;
        q.tags = [];
        questionToAdd.tags.forEach(function (t) {
          q.tags.push({id:'1TfjEFbJxx',title:t});
          q.tags.push({id:'Bo65rxbN3R',title:'Visual Studio'});
        })

        messageFactory.addNewQuestion(q).then(function (d) {
          $scope.question = d.title;

        });
        $scope.count = $scope.count +1;

      };


  });
