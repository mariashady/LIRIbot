// Link to keys file
var keys = require("./keys.js");

// Require .env file
require("dotenv").config();

// Info for Spotify
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

console.log(keys.spotify);

// User command and input
let userInput = process.argv[2];
let userQuery = process.argv.slice(3).join(" ");

function userCommand(userInput, userQuery) {
    switch (userInput) {
        case "spotify-this":
            spotifyThisSong();
            break;
    }
}

userCommand(userInput, userQuery);

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

        for (i = 0; i < spotifyArr.length; i++) {
            console.log(`\nArtist: ${data.tracks.items[i].album.artists[0].name} \nSong: ${data.tracks.items[i].name}\nAlbum: ${data.tracks.items[i].album.name}\nSpotify Link: ${data.tracks.items[i].external_urls.spotify}\n`)
        };
    });
}