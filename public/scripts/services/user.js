'use strict';

/**
 * @ngdoc service
 * @name parseApp.user
 * @description
 * # user
 * Factory in the parseApp.
 */
angular.module('parseApp')
  .factory('userFactory', function ($q) {
     //{"name":"weewrwe","email":"email@emil.com","password":"123456","confirmPassword":"123456"}
    var signUp= function (userToRegister) {
      var userDeferred = $q.defer();

      var user = new Parse.User();
      user.set("username", userToRegister.name);
      user.set("password", userToRegister.password);
      user.set("email",userToRegister.email);

      user.signUp(null, {
        success: function(user) {
          userDeferred.resolve(user);

        },
        error: function(user, error) {
          // Show the error message somewhere and let the user try again.
          userDeferred.reject("Error: " + error.code + " " + error.message);
        }
      })

      return userDeferred.promise;
    };

    var logIn= function (userToLogin) {
      var userLoginDeferred = $q.defer();

      Parse.User.logIn(userToLogin.login,userToLogin.pass, {
        success: function(user) {
          // Do stuff after successful login.
          userLoginDeferred.resolve(user);
        },
        error: function(user, error) {
          userLoginDeferred.reject("Error: " + error.code + " " + error.message);
        }
      });

      return userLoginDeferred.promise;
    };

    // Public API here
    return {
      signUp:signUp,
      logIn:logIn
    };
  });
