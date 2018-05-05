require("dotenv").config();

var fs = require('fs');
var keys = require('./keys.js');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

//Keys
var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

var action = process.argv[2];
var value = process.argv[3];

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

    var params = {
        screen_name: '_DorianMacias',
        count: 20
    }
    console.log("initalizing myTweets function")

    client.get('statuses/user_timeline', params, function (error, tweetsData, response) {
        if (!error) {

            for (i = 0; i < tweetsData.length; i++) {
                var tweetText = tweetsData[i].text;
                var tweetDate = tweetsData[i].created_at;

                var tweetInfo =
                    "\r\n----------------------------------------" +
                    "\r\n @_DorianMacias: " + tweetText +
                    "\r\n Post Date: " + tweetDate

                console.log(tweetInfo);

                fs.appendFile("logs/twitterLog.txt", tweetInfo, function (error) {
                    if (error) {
                        console.log(error);
                    }
                });

            }
        } else {
            console.log(error);
        }
    });
} // End myTweets function

// Start spotifyThis function
function spotifyThis() {

    console.log("Intializing spotify Function")

    if (!value) {
        value = "She's Out of Her Mind";
    }

    spotify.search({type: 'track', query: value}, function (error, data) {

        if (error) {
            console.log('Error occurred: ' + error);
            return;
        }

        var songData = data.tracks.items[0]
        var songInfo =
            "----------------------------------------" +
            "\r\n Artist(s): " + songData.artists[0].name +
            "\r\n Song Title: " + songData.name +
            "\r\n Album: " + songData.album.name +
            "\r\n Song Preview: " + songData.preview_url +
            "\r\n----------------------------------------";

        console.log(songInfo);

        fs.appendFile("logs/spotifyLog.txt", songInfo, function (error) {

            if (error) {
                console.log(error);
            }
        });

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

            var movieData = JSON.parse(data);

            var movieInfo =
                "----------------------------------------" +
                "\r\n Title: " + movieData.Title +
                "\r\n Year: " + movieData.Year +
                "\r\n IMDB Rating: " + movieData.imdbRating +
                "\r\n Rotten Tomatoes Rating: " + movieData.Ratings[1].Value +
                "\r\n Country of Origin: " + movieData.Country +
                "\r\n Language: " + movieData.Language +
                "\r\n Plot: " + movieData.Plot +
                "\r\n Actors: " + movieData.Actors +
                "\r\n ----------------------------------------";
            console.log(movieInfo)

            fs.appendFile("logs/omdbLog.txt", movieInfo, function (error) {

                if (error) {
                    console.log(error);
                }

            });

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