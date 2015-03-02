'use strict';

/**
 * @ngdoc service
 * @name parseApp.generalFactory
 * @description
 * # generalFactory
 * Factory in the parseApp.
 */
angular.module('parseApp')
  .factory('generalFactory', function ($http,$q) {
    // Service logic
    // ...

    var getCities = function (state) {
       var defered = $q.defer();


      var url ="http://gomashup.com/json.php?fds=geo/usa/zipcode/state/"+state+"&callback=JSON_CALLBACK";
      ($http.jsonp(url).success(function (data) {
        var Fcities = JSON.parse(JSON.stringify((data.result || data.data.result)));
        console.log(Fcities);
        var cities = [];
        Fcities.result.forEach(function (item) {
          cities.push(item.City + " - " + item.Zipcode);
        })

        defered.resolve(cities);
      }).error(function (error) {
        defered.reject(error);
      }))

      return defered.promise;

    }

    // Public API here
    return {
      getCities: getCities
    };
  });
