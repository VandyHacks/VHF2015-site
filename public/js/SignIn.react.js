var FB = require('FB');
var React = require('react');
var Parse = require('parse').Parse;
var ParseUtils = require('./ParseUtils');

var SignIn = React.createClass({

  propTypes: {
    onLogin: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    return {
      email: '',
      errorMessage: '',
      password: '',
    };
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

  _onFormLogin(e) {
    var {email, password} = this.state;

    e.preventDefault();

    if (email === '' || password === '') {
      // morons
      return;
    }

    var user = new Parse.User();
    user.set("username", email);
    user.set("password", password);
    user.set("email", email);

    var onSuccess = () => {
      this.setState({errorMessage: ''});
      this.props.onLogin();
    };

    user.signUp(null, {
      success: onSuccess,
      error: (user, error) => {
        ParseUtils.onError(error);
        if (error.code === Parse.Error.USERNAME_TAKEN) {
          Parse.User.logIn(email, password, {
            success: onSuccess,
            error: (user, error) => {
              if (error.code === Parse.Error.OBJECT_NOT_FOUND) {
                this.setState({errorMessage: 'Invalid password for given email.'});
              } else {
                this.setState({errorMessage: 'Unknown error ' + error.code + '. Please try again or report.'});
              }
            }
          });
        } else {
          this.setState({errorMessage: 'Unknown error ' + error.code + '. Please try again or report.'});
        }
      },
    });
  },

  render() {
    var {email, errorMessage, password} = this.state;

    return (
      <div className="row text-center">
        <div className="col-xs-12 col-sm-6">
          <a href="#" onClick={this._onSubmit}>
            <img src="/sign-in.png" className="sign-in" />
          </a>
        </div>
        <div className="col-xs-12 col-sm-6">
          {
            errorMessage &&
              <div className="alert alert-danger" role="alert">{errorMessage}</div>
          }
          <form onSubmit={this._onFormLogin}>
            <div className="form-group">
              <label htmlFor="loginEmail">Email Address</label>
              <input type="email" className="form-control" id="loginEmail" placeholder="Email" value={email} onChange={(e) => this.setState({email:e.target.value})} required/>
            </div>
            <div className="form-group">
              <label htmlFor="loginPass">Password</label>
              <input type="password" className="form-control" id="loginPass" placeholder="Password" value={password} onChange={(e) => this.setState({password:e.target.value})} required/>
            </div>
            <button type="submit" className="btn btn-default">Register/Login</button>
          </form>
        </div>
      </div>
    );
  }
});

module.exports = SignIn;
