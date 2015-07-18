var FB = require('FB');
var React = require('react');
var Parse = require('parse').Parse;
var ParseUtils = require('./ParseUtils');

var PreRegisterEntry = React.createClass({

  propTypes: {
    onNewUser: React.PropTypes.func,
  },

  getInitialState: function() {
    return {
      user: null
    };
  },

  _onSuccessfulSubmit(user) {
    var self = this;

    FB.api(
      "/" + user.attributes.authData.facebook.id,
      function (response) {
        if (response && !response.error) {
          //fbq('track', 'LoggedIn');
          /* handle the result */
          user.setEmail(response.email);
          user.set('firstName', response.first_name);
          user.set('lastName', response.last_name);
          user.set('gender', response.gender);
          user.save(null, {
            error: ParseUtils.onError,
            success: function(user) {
              self.setState({
                user,
              });
              self.props.onNewUser(user);
            },
          });
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

module.exports = PreRegisterEntry;
