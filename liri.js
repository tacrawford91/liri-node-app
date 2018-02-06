require("dotenv").config();
//require fs - aids in writting and in reading files
const fs = require('file-system');
// require cmd - aids in writing command line command in .js files
const cmd = require('node-command-line');
// require twitter - aids in api call
const Twitter = require('twitter');
// require spotify - aids in api call
const Spotify = require('node-spotify-api');
//require request - aids in making ajax calls/ non-server based api calls
const request = require('request');
//require keys for twitter and spotify
const keys = require('./keys.js');
// require log - imple logger 
const log = require('simple-node-logger').createSimpleLogger("log.txt");


//API keys
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);

//User inputs
var command = process.argv[2];
var searchItem = process.argv.slice(3);

//log users command
log.info(`user command and search param: ${command} ${searchItem}`)

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
    case "do-what-it-says":
        randomSearch();  
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
            log.info(`
            tweet ${i+1}:
            ${tweets[i].created_at}
            ${tweets[i].text}
            -----------------------------------------------------`);    
            }
        };
    })
}

//spotify song searconst
function searchSong() {
    //check if song was supplied
    if (searchItem.length === 0 ){
        //if no song default to the sign Ace of Base 
        searchItem = "The Sign Ace of Base"
    }
spotify.search({ type: 'track', query: searchItem }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
  log.info(`
            Artist: ${data.tracks.items[0].artists[0].name}
            Song Name: ${data.tracks.items[0].name} 
            Preview: ${data.tracks.items[0].preview_url}
            Album: ${data.tracks.items[0].album.name}`); 
  });
}

function searchMovie() {
     //check if movie was supplied
     if (searchItem.length === 0 ){
        //if no movie, default to Mr. Nobody
        searchItem = "Mr. Nobody"
    }
    //ombd movie search
    request(`http://www.omdbapi.com/?t=${searchItem}&plot=short&apikey=trilogy`, function(error, response, body) {

    // If the request is successful (i.e. if the response status code is 200)
    if (!error && response.statusCode === 200) {
         log.info(`
                Movie: ${JSON.parse(body).Title}       
                Year: ${JSON.parse(body).Year} 
                IMBD Rating: ${JSON.parse(body).imdbRating}  
                Rotten Tomatoes Rating: ${JSON.parse(body).Ratings[1].Value}
                Produced in: ${JSON.parse(body).Country}
                Produced in: ${JSON.parse(body).Language}
                Plot: ${JSON.parse(body).Plot}
                Actors: ${JSON.parse(body).Actors}`)
        }
    });
}

//node do what it says
function randomSearch() {
//Setting up reading random.txt
fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
    return log.info(err)
    };
    //seperate string and store in new vars for search
    var randomCommand = data.split(",")[0];
    var randomParam = data.split(",")[1];
    function runLiri() {
        //rerun liri.js with the command and param from the random.txt
        cmd.run(`node liri.js ${randomCommand} ${randomParam}`)
    }
    runLiri()
    });

}
