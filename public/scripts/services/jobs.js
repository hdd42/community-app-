'use strict';

/**
 * @ngdoc service
 * @name parseApp.jobs
 * @description
 * # jobs
 * Factory in the parseApp.
 */
angular.module('parseApp')
  .factory('jobsFactory', function ($q) {

    var jobList = [];


    var getAllJobs = function () {


      var jobsDeferred = $q.defer();


      if(jobList.length){
        jobsDeferred.resolve(jobList);
      }else{

        var jobs = Parse.Object.extend("Jobs");
        var query = new Parse.Query(jobs);


        query.descending("createdAt");
        query.limit(100);
        query.find({
          success: function(results) {

            jobList = JSON.parse(JSON.stringify(results));
            jobsDeferred.resolve(jobList);
          },
          error: function(error) {
            jobsDeferred.reject(error);
          }
        });
      }

      return jobsDeferred.promise;
    } ;

    var getFiveJobs = function () {
      var defered = $q.defer();
      var fivePost = [];

      getAllJobs().then(function (data) {
        console.log(data);
        for(var i = 0; i < 5; i++){
          fivePost.push({title:data[i].title,state:data[i].companyState});

        }
        defered.resolve(fivePost);
      });


      return defered.promise;

    }

    var getOneJob = function (title) {
      var d = $q.defer()
      var selectedJob = {};


      jobList.some(function (item) {
        if(item.title == title){
          selectedJob = item;

          return true;
        }
      })
      d.resolve(selectedJob);

      return d.promise;


    }
    var postJob = function (newJob) {
      var jobDeffered =  $q.defer();

      var Job = Parse.Object.extend("Jobs");
      var job = new Job();

      job.save(newJob, {
        success: function(result) {
          // Execute any logic that should take place after the object is saved.
          var added = JSON.parse(JSON.stringify(result));
          jobList.push(added);
          jobDeffered.resolve(added);
        },
        error: function(category, error) {

          jobDeffered.reject(error.message);
        }
      });

      return jobDeffered.promise;

    };

    // Public API here
    return {
      postJob: postJob,
      getAllJobs:getAllJobs,
      getFiveJobs:getFiveJobs,
      getOneJob:getOneJob

    }
  });
