require("dotenv").config();

var fs = require('fs');
var keys = require('./keys.js');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

var action = process.argv[2];
var value = process.argv[3];

// Keys 

// Switch Function
switch (action) {
    case 'my-tweets':
        myTweets();
        break;
    case 'spotify-this-song':
        spotifyThis();
        break;
    case 'movie-this':
        omdb();
        break;
    case 'do-what-it-says':
        doWhatItSays();
        break;
}
// Start myTweets function
function myTweets() {

    var client = new Twitter(keys.twitterKeys);
    var params = {
        screen_name: '_DorianMacias',
        count: 20
    }
    console.log("initalizing myTweets function")

    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (i = 0; i < tweets.length; i++) {
                var tweetText = tweets[i].text;
                console.log('Tweet: ' + tweetText);
                var tweetCreationDate = tweets[i].created_at;
                console.log("Creation Date: " + tweetCreationDate);
            }
        } else {
            console.log(error);
        }
    });
} // End myTweets function

// Start spotifyThis function
function spotifyThis() {

    var spotify = new Spotify(keys.spotifyKeys);
    console.log("Intializing spotify Function")

    if (!value) {
        value = 'All the Small Things';
    }
    spotify.search({
        type: 'track',
        query: value
    }, function (error, data) {
        if (!error && response.statusCode === 200) {
            console.log('Error occurred: ' + err);
            return;
        }
        var songInfo = data.tracks.items;
        console.log("Artist(s): " + songInfo[0].artists[0].name);
        console.log("Song: " + songInfo[0].name);
        console.log("Album: " + songInfo[0].album.name);
        console.log("Preview Link: " + songInfo[0].preview_url);
        
    });
} // End spotifyThis function

function omdb() {

// Then run a request to the OMDB API with the movie specified
request("http://www.omdbapi.com/?t=remember+the+titans&y=&plot=short&apikey=trilogy", function(error, response, data) {

  // If the request is successful (i.e. if the response status code is 200)
  if (!error && response.statusCode === 200) {

    var movieInfo = JSON.parse(data);
    // console.log(movieInfo);
    console.log("Title: " + movieInfo.Title);
    console.log("Year: " + movieInfo.Year)
    console.log("IMDB Rating: " + movieInfo.imdbRating);
    console.log("Rotten Tomatoes Rating: " + movieInfo.Ratings[1].Value)
    console.log("Country of Origin: " + movieInfo.Country);
    console.log("Language: " + movieInfo.Language);
    console.log("Plot: " + movieInfo.Plot);
    console.log("Actors: " + movieInfo.Actors); 
  }
});

}