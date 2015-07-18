var React = require('react');
var Parse = require('parse').Parse;
var ParseUtils = require('./ParseUtils');
var PreRegisterEntry = require('./PreRegisterEntry.react');
var PreRegisterConfirmation = require('./PreRegisterConfirmation.react');

var PreRegisterBox = React.createClass({
  getInitialState() {
    return {
      user: null,
    };
  },

  componentDidMount() {
    var currentUser = Parse.User.current();

    if (currentUser) {
      currentUser.fetch(
        {
          error: ParseUtils.onError,
          success: function(user) {
            this.setState({
              user,
            });
          }.bind(this),
        }
      );
    }
  },

  _onNewUser(user) {
    this.setState({
      user,
    });
  },

  render() {
    var {user} = this.state;
    return (
      <div className="panel panel-default custom-panel">
        <div className="panel-body">
          {user !== null ? null : <PreRegisterEntry onNewUser={this._onNewUser} />}
          {user === null ? null : <PreRegisterConfirmation user={user} />}
        </div>
      </div>
    );
  }
});

module.exports = PreRegisterBox;
