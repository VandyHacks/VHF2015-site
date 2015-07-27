var FB = require('FB');
var React = require('react');
var Parse = require('parse').Parse;
var ParseUtils = require('./ParseUtils');

var SignIn = React.createClass({

  propTypes: {
    onLogin: React.PropTypes.func.isRequired,
  },

  _onSuccessfulSubmit(user) {
    var self = this;
    var {email, firstName, lastName, gender} = user.attributes;

    if (email && firstName && lastName && gender) {
      this.props.onLogin();
      return;
    }

    FB.api(
      "/" + user.attributes.authData.facebook.id,
      function (response) {
        if (response && !response.error) {
          Parse.User.current().set('email', response.email);
          Parse.User.current().set('firstName', response.first_name);
          Parse.User.current().set('lastName', response.last_name);
          Parse.User.current().set('gender', response.gender);

          Parse.User.current().save()
            .then(function(){}, ParseUtils.onError);
          this.props.onLogin();
        } else {
          // TODO: Properly handle this error
          console.log('FB auth error: ');
          console.log(response);
        }
      }.bind(this)
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
        <span>Sign in below to register!</span>
        <a href="#" onClick={this._onSubmit}>
          <img src="/sign-in.png" className="img-responsive" />
        </a>
      </div>
    );
  }
});

module.exports = SignIn;
