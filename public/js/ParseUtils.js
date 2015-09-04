var Parse = require('parse').Parse;

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

function onError(obj, err) {
  // Sometimes we're passed an obj as the first param
  // if we use certain queries. Dumb Parse doesn't standardize
  // their error callbacks, right?
  if (err === undefined) {
    err = obj;
  }
  console.log("Parse Error:");
  console.log(err);

  switch (err.code) {
    case Parse.Error.INVALID_SESSION_TOKEN:
      Parse.User.logOut();
      break;
  }
}

module.exports = {
  onError,
};
