var $ = require('jquery');
var React = require('react');
var Parse = require('parse').Parse;
var PreRegisterBox = require('./PreRegisterBox');

var x = require('./jquery.fittext-1.2.js');

var LOCALHOST = 'localhost';
var FB_PROD_ID = 508263295995091;
var FB_DEV_ID = 524904174331003;

Parse.initialize("DfoMH2OG5zwZ2Fsr0cbcuYkT2NFSrq89zBRIah3H", "UQRnGd3jIMfcg3HLg0sTQhqCdIFcHCx1yPeaE3nP");
Parse.FacebookUtils.init({
  appId: window.location.host.slice(0, LOCALHOST.length) === LOCALHOST ?
    FB_DEV_ID :
    FB_PROD_ID,
  cookie: true,  // enable cookies to allow Parse to access the session
  xfbml: true,  // initialize Facebook social plugins on the page
  version: 'v2.3' // point to the latest Facebook Graph API version
});

React.render(
  <PreRegisterBox />,
  document.getElementById('react-hook')
);

$(".full-width-text").fitText();
