'use strict';

/**
 * @ngdoc function
 * @name parseApp.controller:QuestionCtrl
 * @description
 * # QuestionCtrl
 * Controller of the parseApp
 */
angular.module('parseApp')
  .controller('QuestionCtrl', function ($scope,$location,$routeParams,messageFactory ,  $timeout,$rootScope) {



    if (!$routeParams.id) {
      $location.path("/");
    }

    var returnUrl = $location.path();


    var questionId = $routeParams.id;
    $rootScope.pageTitle ="Question Details";
    $scope.question = {};
    $scope.yourAnswer ="";
    $scope.startInvite = false;
    $scope.emailSending = false;
    $scope.emailSent = false;
    $scope.hotQuestions = [];
    $scope.hotQuestionLoading = true;
    $scope.questionLoading =true;
    //
    messageFactory.getOneMessage(questionId).then(function (q) {

      $scope.question = q;

      messageFactory.getHotMessages($scope.question.category.objectId).then(function (questions) {

        $scope.hotQuestions = questions;

        //console.log(q);
      }, function (error) {
        console.log(error);
      });

      $scope.hotQuestionLoading = false;
      $scope.questionLoading =false;
      //console.log(q);
    }, function (error) {
      console.log(error);
    });

    $scope.newAnswer = function () {

      if(!Parse.User.current()){

        $rootScope.returnUrl =returnUrl;
        $location.path("/login");

        return ;
      }
      var answer = {};

      answer.body = $scope.yourAnswer;
      answer.questionId = $scope.question.objectId;

      messageFactory.addAnswer(answer).then(function (result) {
        // $scope.question.answers.push(result);
        $scope.question.answers.push(result);
        $scope.question.answer_count +=1;

        $scope.yourAnswer ="";
      }, function (error) {
        console.log(error);
      });



    };

    $scope.newComment = function (comment) {
      if(!Parse.User.current()){
        $rootScope.returnUrl =returnUrl;
        $location.path("/login");
        return ;
      }

      var newComment ={};

      var user = JSON.parse(JSON.stringify(Parse.User.current()));
      newComment.user = user.username;
      newComment.comment = comment.comment;
      newComment.createdAt =new Date();
      newComment.questionId = $scope.question.objectId;
      newComment.answerId =comment.id;
      console.log(newComment);

      messageFactory.addComment(newComment).then(function (result) {
        var index = $scope.question.answers.indexOf(comment);

        $scope.question.answers[index].comments.push(result);
        comment.comment = "";
      });
    }

    $scope.questionComment = function () {
      if(!Parse.User.current()){
        $rootScope.returnUrl =returnUrl;
        $location.path("/login");
        return ;
      }

      var comment={};
      comment.comment =$scope.qComment;
      comment.createdAt = Date.now();
      var user = JSON.parse(JSON.stringify(Parse.User.current()));
      comment.user = user.username;

      messageFactory.addQuestionComment($scope.question.objectId,comment).then(function (result) {
        $scope.question.question_comments.push(result);
        $scope.qComment = "";
      }, function (error) {
        console.log(error);
      });

    };

    $scope.Vote = function (id, upDown) {
      if(!Parse.User.current()){
        $rootScope.returnUrl =returnUrl;
        $location.path("/login");
        return ;
      }

      messageFactory.Vote(id,upDown).then(function (result) {
        $scope.question.votes = result.votes;
        $scope.question.upVote = result.upVote;
        $scope.question.downVote = result.downVote;

      }, function (error) {
        console.log(error);
      });
    };

    $scope.Invite = function () {
      if(!Parse.User.current()){
        $rootScope.returnUrl =returnUrl;
        $location.path("/login");
        return ;
      }


      $scope.emailSending = true;

      var email = {};
      email.toEmail =$scope.inviteEmail;
      email.sender =  $rootScope.sessionUser.email;
      email.link = $location.url();

      Parse.Cloud.run('sendInviteEmail', email, {
        success: function(result) {
          $scope.inviteEmail ="";
          $timeout(function () {
            $scope.startInvite = false;
            $scope.emailSending = false;
            $scope.emailSent = true;
            $timeout(function () {
              $scope.emailSent = false;
            },2000)
          },1000);
        },
        error: function(error) {
        }
      });





    }

    $scope.solvedProblem = function (ans) {
      messageFactory.solvedProblem($scope.question.objectId,ans.id).then(function (result) {
       $scope.question.solved = true;
        console.log(result);
        ans.solved =result;
        console.log(ans.solved);

      }, function (error) {

      });

    };



  });
