var FB = require('FB');
var React = require('react');
var Parse = require('parse').Parse;
var ParseUtils = require('./ParseUtils');

var SignIn = React.createClass({

  _onSuccessfulSubmit(user) {
    var self = this;
    var {email, firstName, lastName, gender} = user.attributes;

    if (email && firstName && lastName && gender) {
      return;
    }

    FB.api(
      "/" + user.attributes.authData.facebook.id,
      function (response) {
        if (response && !response.error) {
          ParseReact.Mutation.Set(
            ParseReact.currentUser,
            {
              'email': response.email,
              'firstName': response.first_name,
              'lastName': response.last_name,
              'gender': response.gender,
            }
          ).dispatch()
          .then(function(){}, ParseUtils.onError);
        } else {
          // TODO: Properly handle this error
          console.log('FB auth error: ');
          console.log(response);
        }
      }
    );
  },

  _onSubmit() {
    Parse.FacebookUtils.logIn('email,user_friends',
      {
        error: ParseUtils.onError,
        success: this._onSuccessfulSubmit,
      }
    );
  },

  render() {
    return (
      <div className="text-center">
        <span>Sign in below, and we'll let you know when registration opens!</span>
        <a href="#" onClick={this._onSubmit}>
          <img src="/sign-in.png" className="img-responsive" />
        </a>
      </div>
    );
  }
});

module.exports = SignIn;
