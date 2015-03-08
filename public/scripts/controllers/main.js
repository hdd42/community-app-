'use strict';

/**
 * @ngdoc function
 * @name parseApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the parseApp
 */
angular.module('parseApp')
  .controller('MainCtrl', function ($scope,messageFactory,$location,jobsFactory,ioClientService,articleFactory,$timeout) {

    $scope.loading = true;
    $scope.messages = [];
    $scope.currentMessages =[];
    $scope.searchResults =[];
    $scope.unAnsweredMessages = [];
    $scope.unAnswered_tab_active =false;
    $scope.mes ="";
    $scope.lastPart = false;
    $scope.justStarted = true;
    $scope.search_tab_active = false;
    $scope.unanswered = false;
    $scope.tab_1 ='active'
    $scope.searchActive =false;
    $scope.searchRange ="";
    $scope.startCount = 0;
    $scope.currentCount = 10;
    $scope.searching =false;
    $scope.noMatchFound = false;
    $scope.jobs =[];
    $scope.popularQuestions=[];
    $scope.articles = [];

    $scope.askQuestion = function () {
      $location.path('/messages');
    };

    $scope.showCategories = function () {
      $location.path('/categories');
    };

    $scope.filterUnAnswered = function () {
      $scope.unAnswered_tab_active = true;
      $scope.unanswered='active';
      $scope.tab_1 = '';
    }

    $scope.currentMessageSet = function () {
      $scope.currentMessages=[];

      var start = $scope.startCount;
      for($scope.startCount; start < $scope.currentCount; start++ ){
        $scope.currentMessages.push($scope.messages[start]);

      }
    }

    messageFactory.getAllMessages().then(function (result) {
      $scope.messages =result;

      //$scope.currentMessages

      $scope.loading = false;
      $scope.currentMessageSet();

    }, function (error) {
      console.log(error);
    }).then(function () {
      //set unanswered questions
      $scope.messages.forEach(function (item) {
        if(!item.solved){
          $scope.unAnsweredMessages.push(item);
        }


      });
    }, function (error) {
      console.log(error);
    }).then(function () {
      articleFactory.getLast10Articles().then(function (data) {
        $scope.articles = data;
      })

    }, function (error) {
      console.log(error)
    });

    messageFactory.getTopFive().then(function (data) {

      var toSort =data;
      toSort.sort(function (a,b) {
        if (a.views < b.views)
          return 1;
        if (a.views > b.views)
          return -1;
        return 0;

      });


      $scope.popularQuestions = toSort;

    }, function (error) {
      console.log(error);
    });

    jobsFactory.getFiveJobs().then(function (data) {
      $scope.jobs = data;

    })


    $scope.previous = function () {
      if($scope.startCount > 0){
        $scope.startCount+=10;
      }
      $scope.currentMessageSet();
    };

    $scope.next = function () {
      $scope.currentMessages =[];
      $scope.justStarted = false;
      $scope.startCount = $scope.currentCount;
      $scope.currentCount = $scope.currentCount + 10;

      $scope.currentMessageSet();
      if($scope.currentCount == $scope.messages)
      {
        $scope.lastPart = true;
      }
    };

    $scope.search = function () {




        if(!$scope.search.searchTerm){
            $scope.emptySearch = true;

            $timeout(function () {

                $scope.emptySearch = false;
                return;
            },2000);


        }
        else{
            $scope.search_tab_active =true;
            $scope.searchTab ='active';
            $scope.tab_1 ='';
            $scope.tab_2 ='';
            $scope.searching =true;


            //search.searchTerm"
            //inTitleDesc
            //inTitleOnly
            var searchTerm = {};
            $scope.searchRange = angular.element('#searchRange').val();


            if(!$scope.searchRange)
            {
                searchTerm.searchRange ="";
            }
            else{
                var sr = $scope.searchRange.split('-');
                searchTerm.startDate = sr[0].trim();
                searchTerm.endDate = sr[1].trim();
            }

            searchTerm.searchIn = angular.element("input[name='searchOptions']:checked").val() || 'title';

            searchTerm.searchTerm = $scope.search.searchTerm.toLowerCase();
            console.log(searchTerm);

            messageFactory.searchInMessages(searchTerm).then(function (result) {
                $scope.searchResults =result;

                $scope.searching =false;

                if(result.length < 1){
                    $scope.noMatchFound = true;
                }
                $scope.searchActive = false;
            }, function (error) {
                console.log(error);
            });

        }



    }



    ioClientService.on('newQuestionCreated', function (data) {
      $scope.currentMessages.unshift(JSON.parse(JSON.stringify(data)));
      console.log('on new event : '+JSON.stringify(data));
    });

      });



