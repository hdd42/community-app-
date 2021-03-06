/**
 * Created by huseyin on 27.2.2015.
 */
var io = require('socket.io');
//var config = require('../config');
var globalIO ;

var socketConnection = function socketConnection(socket){
    var request = socket.request;
    var data = socket.client;
    socket.emit('message', {message: 'Connected!  , info => '+data.id});
    console.log('Client connected => '+socket.id +"  ,  info => "+request._query['user']+", id : "+data.id);

    socket.on('newQuestionCreated', function (data) {
        console.log("data : "+JSON.stringify(data));
        socket.broadcast.emit('newQuestionCreated',data);
    });

//
    socket.on('newArticleCreated', function (data) {
        console.log("data : "+JSON.stringify(data));
        socket.broadcast.emit('newArticleCreated',data);
    });
};


exports.startIo = function startIo(server){
   var connection = io.listen(server);

    //var live = connection.of('/live');
    //live.on('connection', socketConnection);
    connection.on('connection', socketConnection);


   globalIO = connection;
    return connection;
};


exports.sendNewEvent = function (data,clientId) {
        globalIO.emit('newEvent',data);
};

