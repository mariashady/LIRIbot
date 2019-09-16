// Link to keys file
require("dotenv").config();
const keys = require("./keys.js");

let request = require("request");

// const moment = require("moment"); 

const fs = require("fs");


// Info for Spotify
console.log(keys.spotify);
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

let bandsintown = (keys.bandsintown);


// User command and input
let userInput = process.argv[2];
let userQuery = process.argv.slice(3).join(" ");

function userCommand(userInput, userQuery) {
    switch (userInput) {
        case "concert-this":
            concertThis();
            break;
        case "spotify-this":
            spotifyThisSong();
            break;
        case "movie-this":
            movieThis();
            break;
        case "do-this":
            doThis(userQuery);
            break;
        default:
            console.log("I don't understand");
            break;
    }
}

userCommand(userInput, userQuery);

function concertThis() {
    console.log(`\n----\n\nSEARCHING FOR: "${userQuery}'s next show:`);
    request("https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=codingbootcamp" + bandsintown, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            let userBand = JSON.parse(body);
            if(userBand.length > 0) {
                for (i = 0; i < 1; i ++) {
                    console.log(`\n----\n\nArtists: ${userBand[i].lineup[0]} \nVenue: ${userBand[i].venue.name}\nVenue Location: ${userBand[i].venue.latitude},${userBand[i].venue.longitude}\nVenue City: ${userBand[i].venue.country}`)

                    let concertDate = moment(userBand[i].datetime).format("MM/DD/YYYY hh:00 A");
                    console.log(`Date and Time: ${concertDate}\n\n----`);
                };
            } else {
                console.log('Band or concert not found.');
            };
        };
    });
};

function spotifyThisSong() {
    console.log(`\n----\n\nSEARCHING FOR: "${userQuery}"`);

    // If user query not found, pass value of "ace of base"
    if(!userQuery) {
        userQuery = "the sign ace of base"
    };

    // Spotify search query format
    spotify.search({
        type: 'track',
        query: userQuery,
        limit: 1
    }, function (error, data) {
        if (error) {
            return console.log('Error occurred: ' + error);
        }
        let spotifyArr = data.tracks.items;

        // for (i = 0; i < spotifyArr.length; i++) {
        //     console.log(`\nArtist: ${data.tracks.items[i].album.artists[0].name} \nSong: ${data.tracks.items[i].name}\nAlbum: ${data.tracks.items[i].album.name}\nSpotify Link: ${data.tracks.items[i].external_urls.spotify}\n`)
        // };

        spotifyArr.forEach(function(songInfo){
            console.log(`\nArtist: ${songInfo.album.artists[0].name} \nSong: ${songInfo.name}\nAlbum: ${songInfo.album.name}\nSpotify Link: ${songInfo.external_urls.spotify}\n`)
            
        })
    });

}

function movieThis() {
    console.log(`\n----\n\nSEARCHING FOR: "${userQuery}"`);
    if (!userQuery) {
        userQuery = "mr nobody";
    };

    request("http://www.omdbapi.com/?t=" + userQuery + "&apikey=578190eb", function (error, response, body) {
        let userMovie = JSON.parse(body);
        let ratingsArr = userMovie.Ratings;
        if (ratingsArr.length > 2) {}

        if(!error && response.statusCode === 200) {
            console.log(`\n----\n\nTitle: ${userMovie.Title}\nCast: ${userMovie.Actors}\nReleased: ${userMovie.Year}\nIMDb Rating: ${userMovie.imdbRating}\nRotten Tomatoes Rating: ${userMovie.Ratings[1].Value}\nCountry: ${userMovie.Country}\nLanguage: ${userMovie.Language}\nPlot: ${userMovie.Plot}\n\n----`) 
        } else {
            return console.log("Movie not found. Error: " + error)
        };
    })


};

function doThis() {

    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
    let dataArr = data.split(",");

    userInput = dataArr[0];
    userQuery = dataArr[1];

    userCommand(userInput, userQuery);

    });
};
