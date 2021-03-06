'use strict';

/**
 * @ngdoc service
 * @name parseApp.category
 * @description
 * # category
 * Factory in the parseApp.
 */
angular.module('parseApp')
  .factory('categoryFactory', function ($q) {
    // Service logic

    var categoryList = [];


    var getAllCategories = function () {
      var categoryDeferred = $q.defer();

      var categories = Parse.Object.extend("Category");
      var query = new Parse.Query(categories);

      if(categoryList.length){
        categoryDeferred.resolve(categoryList);
      }else{
        query.find({
          success: function(results) {
            categoryList = JSON.parse(JSON.stringify(results));
            categoryDeferred.resolve(categoryList);
          },
          error: function(error) {
            categoryDeferred.reject(error);
          }
        });
      }


      return categoryDeferred.promise;
    };

    var addNewCategory = function (newCategory) {
      var categoryAddDeferred = $q.defer();

      var Category = Parse.Object.extend("Category");
      var category = new Category();

     category.set("title",newCategory.title);
     category.set("description",newCategory.description);

      category.save(null, {
        success: function(result) {
          // Execute any logic that should take place after the object is saved.
        var added = JSON.parse(JSON.stringify(result));
        categoryList.push(added);
          categoryAddDeferred.resolve(added);
        },
        error: function(category, error) {

          categoryAddDeferred.reject(error.message);
        }
      });


      return categoryAddDeferred.promise;
    };

    var updateCategory = function (updateCategory) {
      var categoryUpdatedDeferred = $q.defer();

      var Category = Parse.Object.extend("Category");
      var category = new Parse.Query(Category);

      category.get(updateCategory.objectId, {
        success: function(category) {
          category.set("title",updateCategory.title);
          category.set("description",updateCategory.description);
          category.save();
          categoryUpdatedDeferred.resolve(JSON.parse(JSON.stringify(category)));
          // The object was retrieved successfully.
        },
        error: function(object, error) {
          categoryUpdatedDeferred.reject(error.message);
        }
      });


      return categoryUpdatedDeferred.promise;
    };

    var deleteCategory = function (deleteCategory) {
      var categoryDeleteDeferred = $q.defer();

      var Category = Parse.Object.extend("Category");
      var category = new Parse.Query(Category);

      category.get(deleteCategory.objectId, {
        success: function(category) {
          category.destroy();
          categoryDeleteDeferred.resolve("ok");
          // The object was retrieved successfully.
        },
        error: function(object, error) {
          categoryDeleteDeferred.reject(error.message);
        }
      });


      return categoryDeleteDeferred.promise;
    };

    var getOneCategory = function (id) {
      var categoryDeferred = $q.defer();

      categoryList.some(function (cat) {
        if(cat.objectId == id){
          categoryDeferred.resolve(cat);
          return true;
        }
      });

      return categoryDeferred.promise;
    };

    var getCategoryQuestions = function (id) {
        var defered = $q.defer();

        var category = new Parse.Object("Category");
        var questions = Parse.Object.extend("Messages");
        category.id = id;
        var query = new Parse.Query(questions);

        query.equalTo('category',category);

        query.include(["category","user"]);
        query.select(["objectId","title","body","tags","views",
            "votes","answer_count","answers","solved","invited_count","upVote","downVote",
            "question_comments","category.title","user.username"]);

        query.limit(30);

        query.descending("createdAt");
        query.find({
            success: function(results) {
            defered.resolve(JSON.parse(JSON.stringify(results)))
            },
            error: function(error) {
               defered.reject(error);
            }
        });


        return defered.promise;
    }


    var getCategoryArticles = function (id) {
            var defered = $q.defer();


             var category = new Parse.Object("Category");
            var articles = Parse.Object.extend("Articles");
            category.id = id;
            var query = new Parse.Query(articles);

            query.equalTo('category',category);
            query.limit(50);
            query.descending("createdAt");
            query.find({
                success: function(results) {
                    defered.resolve(JSON.parse(JSON.stringify(results)))
                },
                error: function(error) {
                    defered.reject(error);
                }
            });


            return defered.promise;
        }

    // Public API here
    return {
      getAllCategories: getAllCategories,
      addNewCategory:addNewCategory,
      updateCategory:updateCategory,
      deleteCategory:deleteCategory,
      getOneCategory:getOneCategory,
      getCategoryQuestions:getCategoryQuestions,
      getCategoryArticles:getCategoryArticles
    };


  });
