
var express = require('express');
var router = express.Router();
var io = require('../socket');
/* GET new event. */

router.get('/', function(req, res, next) {
    console.log('in new event');
    io.sendNewEvent(req.query.title,null);

    console.log('New event!!!');
    res.status(200).send('Message Sent!');
});





module.exports = router;


