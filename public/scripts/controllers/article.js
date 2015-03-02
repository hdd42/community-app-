'use strict';

/**
 * @ngdoc function
 * @name parseApp.controller:ArticleCtrl
 * @description
 * # ArticleCtrl
 * Controller of the parseApp
 */
angular.module('parseApp')
  .controller('ArticleCtrl', function ($scope,$location,articleFactory,$routeParams,$rootScope) {

    $scope.article ={};

    if (!$routeParams.id) {
      $location.path('/articles');
    }

   var returnUrl = $location.path();
    var articleId = $routeParams.id ;

    articleFactory.getOneArticle(articleId).then(function (result) {
      $scope.article = result ;

    }, function (error) {
      console.log(error)
    });
//comment.body
    $scope.postComment = function () {
      var c = {};
      c.body=$scope.comment.body;
      c.user=$rootScope.sessionUser.username;
      c.createdAt = Date.now();
      articleFactory.postComment($scope.article.objectId,c).then(function (result) {
        $scope.article.article_comments.push(c) ;

      }, function (error) {
        console.log(error)
      });
    };


    $scope.Vote = function (id, upDown) {
      if(!Parse.User.current()){
        $rootScope.returnUrl =returnUrl;
        $location.path("/login");
        return ;
      }

      articleFactory.Vote(id,upDown).then(function (result) {
        $scope.article.votes = result.votes;
        $scope.article.upVote = result.upVote;
        $scope.article.downVote = result.downVote;

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

  });
