
var express = require('express');
var router = express.Router();
var io = require('../socket');
/* GET home page. */
router.post('/newEvent', function(req, res, next) {
    io.sendNewEvent(req.body);
    console.log('New event!!!');
    res.status(200).send('Message Sent!');
});

module.exports = router;


