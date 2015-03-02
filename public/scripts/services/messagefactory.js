'use strict';

/**
 * @ngdoc service
 * @name parseApp.messageFactory
 * @description
 * # messageFactory
 * Factory in the parseApp.
 */
angular.module('parseApp')
  .factory('messageFactory', function ($q) {
    // Service logic
    // ...
    var messageList = [];
    var topFiveList = [];

    var getAllMessages = function () {


      var messageDeferred = $q.defer();


      if(messageList.length){
        messageDeferred.resolve(messageList);
      }else{

        var messages = Parse.Object.extend("Messages");
        var query = new Parse.Query(messages);
        query.include(["category","user"]);
        query.select(["objectId","title","body","tags","views",
          "votes","answer_count","answers","solved","invited_count","upVote","downVote",
          "question_comments","category.title","user.username"]);
        query.descending("createdAt");
        query.limit(40);
        query.find({
          success: function(results) {

            messageList = JSON.parse(JSON.stringify(results));
            messageDeferred.resolve(messageList);
          },
          error: function(error) {
            messageDeferred.reject(error);
          }
        });
      }

       return messageDeferred.promise;
    } ;
   var getTopFive = function () {
     var messageDeferred = $q.defer();


     if(topFiveList.length){
       messageDeferred.resolve(topFiveList);
     }else{

       var messages = Parse.Object.extend("Messages");
       var query = new Parse.Query(messages);

       query.select(["objectId","title","views"]);
       query.descending("views");
       query.limit(5);
       query.find({
         success: function(results) {

           topFiveList = JSON.parse(JSON.stringify(results));
           messageDeferred.resolve(topFiveList);
         },
         error: function(error) {
           messageDeferred.reject(error);
         }
       });
     }

     return messageDeferred.promise;
   }

    var searchInMessages = function (searchTerm) {


      var messageDeferred = $q.defer();
      var searchResult =[];

     // var mainQuery = Parse.Query.or.apply(this, queries);
      var messages = Parse.Object.extend("Messages");
      var query = new Parse.Query(messages);




      var queries = searchTerm.searchTerm.split(' ').filter(function (item) {
        if(item.length > 2) return true;
      })

      query.include(["category","user"]);
      query.select(["objectId","title","body","tags","views",
        "votes","answer_count","answers","solved","invited_count","upVote","downVote",
        "question_comments","category.title","user.username"]);
      query.limit(15);
      query.descending("createdAt");


        if(searchTerm.searchIn == "title"){
          queries.forEach(function (item) {
            query.matches("title_lower", ".*"+item+".*");
          })

        }else{

          queries.forEach(function (item) {
            query.matches("body_lower", ".*"+item+".*");
          })


        }
        query.find({
          success: function(results) {

            searchResult= JSON.parse(JSON.stringify(results));
            messageDeferred.resolve(searchResult);
          },
          error: function(error) {
            messageDeferred.reject(error);
          }
        });

      return messageDeferred.promise;
    } ;


    var addNewQuestion = function (newQuestion) {


      var messageAddDeferred = $q.defer();

      var Message = Parse.Object.extend("Messages");
      var Category = Parse.Object.extend("Category");


      var message = new Message();

      var category = new Category();
      category.id = newQuestion.category;// || 'hcXjdA9o4g';
      var user =Parse.User.current();
      message.set("user",user);

      message.set("category",category);
      message.set("title",newQuestion.title);
      message.set("body",newQuestion.body);
      message.set("tags",newQuestion.tags);
      message.set("answers",[]);
      message.set("answer_count",0);
     //message.set("views",newQuestion.views);

      message.set("views",0);
      message.set("votes",0);
      message.set("question_comments",[]);
      message.set("invited_count",0);
      message.set("solved",false);
      message.set("upVote",0);
      message.set("downVote",0);
      message.set("solved",false);
      message.set("title_lower",newQuestion.title.toLowerCase());
      message.set("body_lower",newQuestion.title.toLowerCase()+" " + newQuestion.body.toLowerCase());

      message.save(null,{
          success: function(results) {
           var addedQuestion = JSON.parse(JSON.stringify(results));
            messageList.push(addedQuestion);
            messageAddDeferred.resolve(addedQuestion);
          },
          error: function(error) {
            messageAddDeferred.reject(error);
          }
        });


      return messageAddDeferred.promise;
    } ;

    var getOneMessage = function (id) {
      var deferred = $q.defer();
      var found = false;

      messageList.forEach(function (message) {
        if(message.objectId == id){
          message.views ? (message.views +=1) : message.views =1;
          deferred.resolve(message);
          found = true;
          var Message = Parse.Object.extend("Messages");
          var query = new Parse.Query(Message);
          query.get(message.objectId,{
            success: function (question) {
              question.increment("views");
              question.save();
            },error: function (object,error) {
              console.log(error);
            }
          })
        }
      });

      if(!found)
      {
        var Question = Parse.Object.extend("Messages");

        var query = new Parse.Query(Question);

        query.get(id,{
          success: function(question) {

            deferred.resolve(JSON.parse(JSON.stringify(question)));


            messageList.push(JSON.parse(JSON.stringify(question)));

          },
          error: function(error) {
            deferred.reject(error);
          }
        });

      }

      return deferred.promise;
    };

    var getHotMessages = function (catId) {
      var deferred = $q.defer();

      var Question = Parse.Object.extend("Messages");
      var Category = Parse.Object.extend("Category");
      var category = new Category();

      category.id = catId;

      var query = new Parse.Query(Question);
      query.equalTo("category",category);
      query.select(["objectId","title"]);
      query.limit(6);
      query.descending("createdAt");

      query.find({
        success: function(results) {

          var questions = JSON.parse(JSON.stringify(results));

          deferred.resolve(questions);
        },
        error: function(error) {
          deferred.reject(error);
        }
      });



      return deferred.promise;
    };


    var addAnswer = function (answer) {

      var answerAddDeferred = $q.defer();

      var Question = Parse.Object.extend("Messages");

      var query = new Parse.Query(Question);



      console.log(JSON.stringify(Parse.User.current()));
      query.get(answer.questionId,{
        success: function(question) {

          var user = JSON.parse(JSON.stringify(Parse.User.current()));

          var newAnswer =  {
            body:answer.body,
            createdAt :new Date(),
            id:Date.now(),
            userId : user.objectId,
            userName:user.username,
            solved:false,
            comments:[]
          };
         question.add('answers',newAnswer);
          question.increment("answer_count");
          question.save();

          messageList.some(function (m) {
            if(m.objectId == question.objectId){
              m.answers.push(newAnswer);

              return true;
            }
          });

          answerAddDeferred.resolve(newAnswer);
        },
        error: function(error) {
          answerAddDeferred.reject(error);
        }
      });

     return answerAddDeferred.promise;
    };

   var addComment = function (comment) {

     var commentDeffered = $q.defer();

     var Question = Parse.Object.extend("Messages");

     var query = new Parse.Query(Question);

     query.get(comment.questionId,{
       success: function(question) {

        var ques =   JSON.parse(JSON.stringify(question));
         console.log(ques);
         var ans_index = 0;
        ques.answers.some(function (ans) {
          console.log("ans.id : "+ans.id+" => "+"comment.id : "+comment.createdAt);
          if(ans.id == comment.answerId){
            ans.comments.push(comment);
            console.log("I've found it!");
            return true;
          }
          ans_index++;
        })
         question.set("answers", ques.answers);
         question.save();

         messageList.some(function (m) {
           if(m.objectId == question.objectId){
             m.answers[ans_index].comments.push(newAnswer);

             return true;
           }
         });

         commentDeffered.resolve(comment);
       },
       error: function(error) {
         commentDeffered.reject(error);
       }
     });

     return commentDeffered.promise;

   };

    var addQuestionComment = function (id, comment) {

      var commentDeffered = $q.defer();

      var Question = Parse.Object.extend("Messages");

      var query = new Parse.Query(Question);

      query.get(id,{
        success: function (result) {
          result.add("question_comments",comment);

          result.save();

          messageList.some(function (m) {
            if(m.objectId == result.objectId){
              m.question_comments.push(comment);

              return true;
            }
          });
          commentDeffered.resolve(comment);

        },
        error: function (error) {
          commentDeffered.reject(error);
        }

      });

      return commentDeffered.promise;

    };

    var Vote = function (id, upDown) {
      var voteDeffered = $q.defer();

      var Question = Parse.Object.extend("Messages");

      var query = new Parse.Query(Question);

      query.get(id,{
        success: function (question) {
          if(upDown == "up"){
            question.increment("upVote");
          }else{
            question.increment("downVote");
          }
          question.increment("votes");
          question.save();

          var index = messageList.indexOf(question);
          messageList[index] = question;
          voteDeffered.resolve(JSON.parse(JSON.stringify(question)));

        },
        error: function (error) {
          voteDeffered.reject(error);
        }
      })
          return voteDeffered.promise;
    }

    var solvedProblem = function (questionId,answer) {

      var correctAnserDeffered = $q.defer();
      var Question = Parse.Object.extend("Messages");
      var query = new Parse.Query(Question);

      query.get(questionId,{
        success: function(question) {
          var user = JSON.parse(JSON.stringify(Parse.User.current()));

          var ques =JSON.parse(JSON.stringify(question));

          var ans_index = 0;
          var solvedUser="";
          ques.answers.some(function (a) {
            if(a.id == answer){
              a.solved = a.user;
              solvedUser = a.user;
              return true;
            }
            ans_index++;
          });
          question.set("answers",ques.answers);
          question.set("solved",true);
          question.save();

          messageList.some(function (m) {
            if(m.objectId == question.objectId){
              m.solved=true;
              m.answers[ans_index]=ques.answers[ans_index];
              return true;
            }
          });

          correctAnserDeffered.resolve(ques.answers[ans_index]);

        },
        error: function (error) {
        correctAnserDeffered.reject(error);
        }

      });

     return correctAnserDeffered.promise;
    };

    var addQuestionToList = function (q) {
      messageList.unshift(JSON.parse(JSON.stringify(q)));
    }
    // Public API here
    return {
      getAllMessages: getAllMessages,
      searchInMessages:searchInMessages,
      getHotMessages:getHotMessages,
      addNewQuestion:addNewQuestion,
      getOneMessage:getOneMessage,
      addAnswer:addAnswer,
      addComment:addComment,
      addQuestionComment:addQuestionComment,
      Vote:Vote,
      solvedProblem:solvedProblem,
      getTopFive:getTopFive,
      addQuestionToList:addQuestionToList
    };
  });
