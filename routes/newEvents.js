
var express = require('express');
var router = express.Router();
var io = require('../socket');
/* GET new event. */

router.get('/', function(req, res, next) {
    console.log('in new event');
    io.sendNewEvent(req.query.title);

    console.log('New event!!!');
    res.status(200).send('Message Sent!');
});


router.post('/', function(req, res, next) {
    console.log('in new event');
    io.sendNewEvent(JSON.stringify(req.body));

    console.log('New event!!!');
   // res.status(200).send('Message Sent!');
    res.status(200).send('req.body.data => '+req.body.title+"--\n req.body => "+JSON.stringify(req.body));
});


module.exports = router;


