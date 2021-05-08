const express = require("express");
const app = express();

const Podlet = require("@podium/podlet");
const fs = require("fs");

const dotenv = require('dotenv');

dotenv.config({
  path: `process.env`
});


const port = process.env.PORT || 7101 


// Basic definition of the podlet
const podlet = new Podlet({
  name: "vueReceivePod", // required
  version: "0.1.0", // required
  pathname: "/", // required
  manifest: "/manifest.json", // optional, defaults to '/manifest.json'
  development: true, // optional, defaults to false
});

// All css and js files in the build folder should be added to the podlet definition.
let vueCssAssets = fs.readdirSync('dist/css');
vueCssAssets.forEach((element) => {
  if(element.indexOf('.css') !== -1 && element.indexOf('.css.map') === -1){
    podlet.css({ value: `${process.env.ENTRY_BASE_URL}/css/${element}`});
  }
});
let vueJsAssets = fs.readdirSync('dist/js');
vueJsAssets.forEach((element) => {
  if(element.indexOf('.js') !== -1 && element.indexOf('.js.map') === -1){
    podlet.js({ value: `${process.env.ENTRY_BASE_URL}/js/${element}`, defer: true });
  }
});
// create a static link to the files for demo purposes. 
// In production the localhost URL should be a URL going to a CDN or static file hosting.
app.use("/css", express.static("dist/css/"));
app.use("/js", express.static("dist/js/"));

// apply middleware
app.use(podlet.middleware());

// add HTML to send. This is the div ID in public/index.html
app.get(podlet.content(), (req, res) => {
  res.status(200).podiumSend('<div id="vue-receive"></div>');
});

// generate the podlet manifest
app.get(podlet.manifest(), (req, res) => {
  res.status(200).send(podlet);
});

app.set('port', process.env.PORT || port);

app.listen(app.get('port'), function () {
  console.log('Servidor en puerto ' + app.get('port'));
  console.log('Ir a http://localhost:' + app.get('port'));
  console.log('MODE:' + process.env.NODE_ENV);
  console.log('BASE:' + process.env.ENTRY_BASE_URL);  
});

