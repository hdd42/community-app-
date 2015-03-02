'use strict';

/**
 * @ngdoc service
 * @name parseApp.ioClientService
 * @description
 * # ioClientService
 * Service in the parseApp.
 */
angular.module('parseApp')
  .service('ioClientService', function ($timeout) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    var user = JSON.parse(JSON.stringify(Parse.User.current()));
    //var socketUrlRemote = 'http://messageapp.azurewebsites.net/?user='+user.username || 'guest';
    var socketUrl = 'http://localhost:3000/?user='+(user ? user.username : 'guest');
    this.socket = io(socketUrl);

    this.on = function(eventName, callback) {
      if (this.socket) {
        this.socket.on(eventName, function(data) {
          $timeout(function() {
            callback(data);
          });
        });
      }
    };

    this.emit = function(eventName, data) {
      if (this.socket) {
        this.socket.emit(eventName, data);
      }
    };

    this.removeListener = function(eventName) {
      if (this.socket) {
        this.socket.removeListener(eventName);
      }
    };


  });
