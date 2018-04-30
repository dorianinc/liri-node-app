
require("dotenv").config();

var fs = require('fs');
var keys = require('./keys.js');
var request = require('request');
var Twitter = require('twitter');
var spotify = require('node-spotify-api')

var action = process.argv[2];
var value = process.argv[3];

switch (action) {
    case 'my-tweets':
        myTweets();
        break;
    case 'spotify-this-song':
        spotify(value);
        break;
    case 'movie-this':
        omdb(value);
        break;
    case 'do-what-it-says':
        doWhatItSays();
        break;
}

function myTweets() {
    var client = new Twitter(keys.twitterKeys);
    var params = {
        screen_name: '_DorianMacias',
        count: 10
        
} // end myTweets function