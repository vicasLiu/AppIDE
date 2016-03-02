"use strict";
var express = require('express');
var app = require('express')();
var http = require('http').Server(app);

app.use(express.static('public'));

app.set('port', process.env.PORT || 3000);
var server = http.listen(app.get('port'), function() {
    console.log('start at port:' + server.address().port);
});
