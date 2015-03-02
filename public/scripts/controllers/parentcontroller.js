'use strict';

/**
 * @ngdoc function
 * @name parseApp.controller:ParentcontrollerCtrl
 * @description
 * # ParentcontrollerCtrl
 * Controller of the parseApp
 */
angular.module('parseApp')
  .controller('ParentcontrollerCtrl', function ($scope,ioClientService,messageFactory) {

    //var vm = this;
    ioClientService.on('connection', function (data) {
      console.log('Baglandim');
    })

    ioClientService.on('message', function (data) {
      console.log('on message : '+JSON.stringify(data));
    });

    ioClientService.on('newQuestionCreated', function (data) {
      messageFactory.addQuestionToList(data);
     // console.log('on new event : '+JSON.stringify(data));
    });
    ioClientService.on('newArticleCreated', function (data) {
      //messageFactory.addQuestionToList(data);
      console.log('on new event : '+JSON.stringify(data));
    });

    //console.log('in parent controller');

  });
