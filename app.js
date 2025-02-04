require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => {
    res.render('index')
});
   
 app.get("/artist-search",(req, res) =>{
    console.log("helloooo",req.query )
    spotifyApi
  .searchArtists(req.query.theArtistName)
  .then(data => {
   // console.log('The received data from the API: ', data.body.artists.items);
    res.render('artist-search-results', {artists: data.body.artists.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
 });

 app.get('/albums/:artistId', (req, res) => {
  console.log("Id is: ", req.params.artistId)
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then((data)=>{
    res.render('albums', {albums: data.body.items})
  })
});

app.get("/tracks/:artistId", (req,res) => {
  console.log(req.params.artistId)
  spotifyApi
  .getAlbumTracks(req.params.artistId)
  .then((data) => {
    console.log({tracks:data.body.items})
    res.render("tracks",{tracks: data.body.items})
  })
})

app.listen(4001, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));


