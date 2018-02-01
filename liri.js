
require("dotenv").config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var keys = require('./keys.js')


//API keys
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//User inputs
var command = process.argv[2];
var searchItem = process.argv[3];
for (var i =4; i< process.argv.length; i++) {
    searchItem += ` + ${process.argv[i]}`
}
console.log(searchItem)
//logic
switch (command) {
    case "my-tweets":
        getTweets();
        break;

    case "spotify-this-song":
        searchSong();
        break;
    case "movie-this":
          searchMovie()  
        break;
    default:
        break;
}

//Functions
//tweets info grab
function getTweets() {
    var params = {screen_name: 'deveLOVEper1234'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
        for (var i = 0; i< tweets.length; i++){ 
        console.log(`tweet ${i+1}:`)     
        console.log(tweets[i].created_at);
        console.log(tweets[i].text);
        console.log("-----------------------------------------------------")
        }
    }
    });
}

//spotify song search 
function searchSong() {
spotify.search({ type: 'track', query: searchItem }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    //Artist Name
  console.log("Artist: "+ data.tracks.items[0].artists[0].name);
  //Song Name
  console.log("Song Name: " + data.tracks.items[0].name); 
  //preview link 
  console.log("Preview: "+ data.tracks.items[0].preview_url); 
  //album name
  console.log("Album: "+ data.tracks.items[0].album.name); 
  });
}


function searchMovie() {
    //ombd movie search
    request(`http://www.omdbapi.com/?t=${searchItem}&plot=short&apikey=trilogy`, function(error, response, body) {

    // If the request is successful (i.e. if the response status code is 200)
    if (!error && response.statusCode === 200) {
        //Movie Title
        console.log("Movie: " + JSON.parse(body).Title);
        // Year Made
        console.log("Year: " + JSON.parse(body).Year); 
        // imbd rating
        console.log("IMBD Rating: " + JSON.parse(body).imdbRating);  
        // rotten tomatoes rating 
        console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
        // country produced 
        console.log("Produced in: " + JSON.parse(body).Country);
        // language 
        console.log("Produced in: " + JSON.parse(body).Language);
        // plot 
        console.log("Plot: " + JSON.parse(body).Plot);
        // actors 
        console.log("Actors: " + JSON.parse(body).Actors);
    }
    });
}