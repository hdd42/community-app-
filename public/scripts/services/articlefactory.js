'use strict';

/**
 * @ngdoc service
 * @name parseApp.articleFactory
 * @description
 * # articleFactory
 * Factory in the parseApp.
 */
angular.module('parseApp')
  .factory('articleFactory', function ($q) {
    // Service logic
    // ...
   var articleList = [];

    var getAllArticles = function () {


      var articleDeferred = $q.defer();


      if(articleList.length){
        articleDeferred.resolve(articleList);
      }
      else{

        var articles = Parse.Object.extend("Articles");
        var query = new Parse.Query(articles);
        query.include(["category","user"]);
        query.select(["objectId","title","body","tags","views",
          "votes","category.title","user.username"]);
        query.descending("createdAt");
        query.limit(10);
        query.find({
          success: function(results) {

            articleDeferred.resolve(JSON.parse(JSON.stringify(results)));
          },
          error: function(error) {
            articleDeferred.reject(error);
          }
        });
      }

      return articleDeferred.promise;
    } ;


    var addNewArticle = function (newArticle) {


      var articleAddDeferred = $q.defer();

      var Message = Parse.Object.extend("Articles");
      var Category = Parse.Object.extend("Category");


      var article = new Message();

      var category = new Category();
      category.id = newArticle.category;// || 'hcXjdA9o4g';
      var user =Parse.User.current();

      article.set("user",user);
      article.set("category",category);
      article.set("title",newArticle.title);
      article.set("body",newArticle.body);
      article.set("tags",newArticle.tags);

      article.set("views",0);
      article.set("votes",0);
      article.set("article_comments",[]);

      article.set("upVote",0);
      article.set("downVote",0);

      article.set("title_lower",newArticle.title.toLowerCase());
      article.set("body_lower",newArticle.title.toLowerCase()+" " + newArticle.body.toLowerCase());

      article.save(null,{
        success: function(results) {
          var addedArticle = JSON.parse(JSON.stringify(results));
          articleList.push(addedArticle);
          articleAddDeferred.resolve(addedArticle);
        },
        error: function(error) {
          articleAddDeferred.reject(error);
        }
      });


      return articleAddDeferred.promise;
    } ;

    var getOneArticle = function (id) {
      var articleDefer = $q.defer();
      var Article = Parse.Object.extend("Articles");
      var query = new Parse.Query(Article);


      query.get(id, {
        success: function(article) {

          articleDefer.resolve(JSON.parse(JSON.stringify(article)));
          // The object was retrieved successfully.
        },
        error: function(object, error) {
          articleDefer.reject(error.message);
        }
      });


      return articleDefer.promise;
    };

    var getLast10Articles = function () {
      var list = $q.defer()

      if(articleList.length){
        list.resolve(articleList.slice(0,10));
      }

      var articles = Parse.Object.extend("Articles");
      var query = new Parse.Query(articles);
      query.include(["category","user"]);
      query.select(["objectId","title","body","tags","views",
        "votes","category.title","user.username"]);
      query.descending("createdAt");
      query.limit(10);
      query.find({
        success: function(results) {

          list.resolve(JSON.parse(JSON.stringify(results)));
        },
        error: function(error) {
          list.reject(error);
        }
      });


      return list.promise;
    }

    var postComment = function (articleId , comment) {
      var articleDefer = $q.defer();
      var Article = Parse.Object.extend("Articles");
      var query = new Parse.Query(Article);


      query.get(articleId, {
        success: function(article) {
          article.increment("views");

          article.add('article_comments',comment);
          article.save();
          articleDefer.resolve(JSON.parse(JSON.stringify(article)));
          // The object was retrieved successfully.
        },
        error: function(object, error) {
          articleDefer.reject(error.message);
        }
      });

      return articleDefer.promise;
    }

    var Vote = function (id, upDown) {
      var voteDeffered = $q.defer();

      var Article = Parse.Object.extend("Articles");

      var query = new Parse.Query(Article);

      query.get(id,{
        success: function (article) {
          if(upDown == "up"){
            article.increment("upVote");
          }else{
            article.increment("downVote");
          }
          article.increment("votes");
          article.save();

          var index = articleList.indexOf(article);
          articleList[index] = article;
          voteDeffered.resolve(JSON.parse(JSON.stringify(article)));

        },
        error: function (error) {
          voteDeffered.reject(error);
        }
      })
      return voteDeffered.promise;
    }
    // Public API here
    return {
      getAllArticles:getAllArticles,
      addNewArticle: addNewArticle,
      getOneArticle:getOneArticle,
      getLast10Articles:getLast10Articles,
      postComment:postComment,
      Vote:Vote
    };
  });
