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
        omdb(value);
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
                var tweetCreationDate = tweets[i].created_at;

                console.log(
                    "----------------------------------------" +
                    "\n @_DorianMacias: " + tweetText +
                    "\n Creation Date: " + tweetCreationDate
                );

                fs.appendFile("logs/twitterLog.txt",
                    "----------------------------------------" +
                    "\n @_DorianMacias: " + tweetText +
                    "\n Creation Date: " + tweetCreationDate
                );
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
        value = "She's Out of Her Mind";
    }
    spotify.search({
        type: 'track',
        query: value
    }, function (error, data) {
        if (error) {
            console.log('Error occurred: ' + error);
            return;
        }
        var songInfo = data.tracks.items;

        console.log(
            "----------------------------------------" +
            "\n Artist(s): " + songInfo[0].artists[0].name +
            "\n Song Title: " + songInfo[0].name +
            "\n Album: " + songInfo[0].album.name +
            "\n Preview Link: " + songInfo[0].preview_url +
            "\n----------------------------------------"
        );

        fs.appendFile("logs/spotifyLog.txt",
            "----------------------------------------" +
            "\n Artist(s): " + songInfo[0].artists[0].name +
            "\n Song Title: " + songInfo[0].name +
            "\n Album: " + songInfo[0].album.name +
            "\n Preview Link: " + songInfo[0].preview_url +
            "\n----------------------------------------"
        );
    });
} // End spotifyThis function

// Start of omdb Function
function omdb() {

    console.log("Initializing omdb Function")
    if (!value) {
        value = 'Stranger Than Fiction';
    }
    request("http://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=trilogy", function (error, response, data) {

        if (!error && response.statusCode === 200) {

            var movieInfo = JSON.parse(data);

            console.log(
                "----------------------------------------" +
                "\n Title: " + movieInfo.Title +
                "\n Year: " + movieInfo.Year +
                "\n IMDB Rating: " + movieInfo.imdbRating +
                "\n Rotten Tomatoes Rating: " + movieInfo.Ratings[1].Value +
                "\n Country of Origin: " + movieInfo.Country +
                "\n Language: " + movieInfo.Language +
                "\n Plot: " + movieInfo.Plot +
                "\n Actors: " + movieInfo.Actors +
                "\n ----------------------------------------"
            );

            fs.appendFile("logs/omdbLog.txt",
                "----------------------------------------" +
                "\n Title: " + movieInfo.Title +
                "\n Year: " + movieInfo.Year +
                "\n IMDB Rating: " + movieInfo.imdbRating +
                "\n Rotten Tomatoes Rating: " + movieInfo.Ratings[1].Value +
                "\n Country of Origin: " + movieInfo.Country +
                "\n Language: " + movieInfo.Language +
                "\n Plot: " + movieInfo.Plot +
                "\n Actors: " + movieInfo.Actors +
                "\n ----------------------------------------"
            );

        }
    });

} // End of omdb Function

// Start of doWhatItSays function
function doWhatItSays() {

    fs.readFile('random.txt', 'utf8', function (error, data) {
        var randomArray = data.split(',');
        value = randomArray[1];

        if (error) {
            console.log(error);
        } else {
            if (randomArray[0] === 'spotify-this-song') {
                spotifyThis();
            }
        }
    });
} // end doWhatItSays function