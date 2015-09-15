var Parse = require('parse').Parse;

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
