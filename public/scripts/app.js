'use strict';

/**
 * @ngdoc overview
 * @name parseApp
 * @description
 * # parseApp
 *
 * Main module of the application.
 */
angular
  .module('parseApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'textAngular','720kb.socialshare'
  ])
  .config(function ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/messages', {
        templateUrl: '../views/messages.html',
        controller: 'MessagesCtrl'
      })

      .when('/categories', {
        templateUrl: '../views/categories.html',
        controller: 'CategoryCtrl'
      })

      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/question/:id/:title', {
        templateUrl: 'views/question.html',
        controller: 'QuestionCtrl'
      })
      .when('/category', {
        templateUrl: 'views/category.html',
        controller: 'CategoryCtrl'
      })
      .when('/category/:title/:topic?/:id', {
        templateUrl: 'views/category.html',
        controller: 'CategoryDetailCtrl'
      })

      .when('/so', {
        templateUrl: 'views/so.html',
        controller: 'SoCtrl'
      })
      .when('/job-listing/:title?', {
        templateUrl: 'views/job-listing.html',
        controller: 'JobListingCtrl'
      })
      .when('/post-job', {
        templateUrl: 'views/post-job.html',
        controller: 'PostJobCtrl'
      })
      .when('/article/:title?/:id?', {
        templateUrl: 'views/article.html',
        controller: 'ArticleCtrl'
      })
      .when('/add-article', {
        templateUrl: 'views/add-article.html',
        controller: 'AddArticleCtrl'
      })
      .when('/articles', {
            templateUrl: 'views/articles.html',
            controller: 'ArticlesCtrl'
        })
      .when('/questions', {
            templateUrl: 'views/questions.html',
            controller: 'QuestionsCtrl'
        })
      .when('/apply-job/:jobTitle/:jobId', {
            templateUrl: 'views/apply-job.html',
            controller: 'ApplyToJobCtrl'
        })

        //
      .otherwise({
        redirectTo: '/'
      });



    $locationProvider.html5Mode(true);
  })

  .run(function($rootScope) {

    $rootScope.sessionUser =JSON.parse(JSON.stringify(Parse.User.current()));
    $rootScope.signOut = function () {
      Parse.User.logOut();
      $rootScope.sessionUser = null;

    };
    $rootScope.pageTitle ="";



   });


