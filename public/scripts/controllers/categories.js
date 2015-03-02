'use strict';

/**
 * @ngdoc function
 * @name parseApp.controller:CategoryCtrl
 * @description
 * # CategoryCtrl
 * Controller of the parseApp
 */
angular.module('parseApp')
  .controller('CategoryCtrl', function ($scope,categoryFactory,$rootScope) {

    $scope.loading = true;
    $scope.categories = [];
    $scope.cat ="";
    $scope.selectedCategory ={
      title:"",
      body:""
    };
    $rootScope.pageTitle ="Categories";

    categoryFactory.getAllCategories().then(function (result) {
      $scope.categories =result;
      $scope.loading = false;

    }, function (error) {
      console.log(error);
    });



    $scope.addNewCategory = function () {
      //angular.element("#addNewCategory").modal();
     //console.log($scope.selectedCategory);

      categoryFactory.addNewCategory($scope.selectedCategory).then(function (result) {
        angular.element("#addCategoryModal").modal('hide');
        //$scope.categories.push($scope.selectedCategory);
        $scope.selectedCategory ={};

      }, function (error) {
        console.log(error);
      });

    };
    //addCategoryModal
    $scope.startEditing = function (c) {
      $scope.selectedCategory = c ;
      angular.element("#addCategoryModal").modal();
     $scope.categoryEditing = true;

    };

    $scope.saveCategory = function () {

      categoryFactory.updateCategory($scope.selectedCategory).then(function (result) {
        angular.element("#addCategoryModal").modal('hide');
        //$scope.categories.push($scope.selectedCategory);
        var index = $scope.categories.indexOf($scope.selectedCategory);
        $scope.categories[index] = result;
        $scope.selectedCategory ={};

      }, function (error) {
        console.log(error);
      });

    };

    $scope.deleteCategory = function (category) {

      if(!confirm("Are you sure to delete this category ? "+category.title));
         return;

      categoryFactory.deleteCategory(category).then(function (result) {

        var index = $scope.categories.indexOf(category);
        $scope.categories.splice(index , 1);


      }, function (error) {
        console.log(error);
      });

    };

  });
