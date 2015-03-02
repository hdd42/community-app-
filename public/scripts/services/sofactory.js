'use strict';

/**
 * @ngdoc service
 * @name parseApp.soFactory
 * @description
 * # soFactory
 * Factory in the parseApp.
 */
angular.module('parseApp')
  .factory('soFactory', function ($http, $q) {


    var mainSearchUrl = "https://api.stackexchange.com/2.2/search/advanced?filter=!9YdnSJ*_S&fromdate=1341100800&todate=1412121600&";
   mainSearchUrl += "order=desc&pagesize=100&sort=activity&site=stackoverflow&q=";
   // var inTitleUrl = "https://api.stackexchange.com/2.2/search?order=desc&sort=activity&";
   // inTitleUrl += "fromdate=1341100800&todate=1412121600&order=desc&pagesize=5&site=stackoverflow&intitle=";



    var searchQuestions = function (search) {
      var questionsDeferred = $q.defer();

      $http({

        url: mainSearchUrl + search,
        method: 'GET'
      }).success(function (data) {

        questionsDeferred.resolve(data);
      }).error(function () {

        questionsDeferred.reject();
      });

      return questionsDeferred.promise;
    }


    // Public API here
    return {
      searchQuestions:searchQuestions
    };
  });
