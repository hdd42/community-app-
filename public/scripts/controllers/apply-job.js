'use strict';

/**
 * @ngdoc function
 * @name parseApp.controller:AddArticleCtrl
 * @description
 * # Apply for a Job Ctrl
 * Controller of the parseApp
 */
angular.module('parseApp')
    .controller('ApplyToJobCtrl', function ($scope,$rootScope,ioClientService,$location,$routeParams,fileUploadFactory,$timeout) {

        if (!$rootScope.sessionUser) {
            $rootScope.returnUrl = $location.path();
            $location.path("/login");
        }
     $scope.files = [];
     $scope.jobTitle = $routeParams.jobTitle;
     $scope.jobId = $routeParams.jobId ;
     $scope.proccess = {
         status:false,
         text:"Form not ready!"
     };
        $scope.applicationSuccess = false;
      $scope.user =     $rootScope.sessionUser;

     $scope.apply = function () {
         $scope.proccess = {
             status:true,
             text:"Form Processing..."
         };



         var application = {};
         application.user = Parse.User.current();
         application.company ="Microsoft";
         application.contact = [$scope.user.fullName,$scope.user.email,$scope.user.phone];
         application.resume_cover = $scope.user.coverLetter;

        fileUploadFactory.uploadFiles($scope.files,'JopApply','uploads',application).then(function (data) {

            $scope.proccess = {
                status:true,
                text:"Application Saving...!"
            };


            $timeout(function () {
                $scope.applicationSuccess = true
            },1000)
            ;
            console.log(data);
        }, function (error) {
            $scope.proccess = {
                status:true,
                error_text: error.message
            };
        });
        // $scope.user.files =$scope.files;
         console.log($scope.user);
     }



//listen for the file selected event
    $scope.$on("fileSelected", function (event, args) {
            $scope.$apply(function () {
                if ($scope.files.length < 3) {

                    $scope.files.push(args.file);
                    console.log(args.file.name);

                }
            });
        });
    });
