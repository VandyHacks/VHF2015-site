var FB = require('FB');
var React = require('react');
var Parse = require('parse').Parse;
var ParseUtils = require('./ParseUtils');

var PreRegisterConfirmation = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      email: this.props.user.get('email'),
      justChangedEmail: false,
    };
  },

  _onSubmit(e) {
    e.preventDefault();

    var {user} = this.props;
    var {email} = this.state;
    var self = this;

    user.setEmail(email);
    user.save(null, {
      error: ParseUtils.onError,
      success: function(user) {
        var cb = (changed) => {
          self.setState({
            justChangedEmail: !!changed,
          });
        };

        cb(true);
        setTimeout(cb, 4000);
      },
    });
  },

  _onChange() {
    this.setState({email: event.target.value});
  },

  render() {
    var {email, justChangedEmail} = this.state;
    return (
      <div id="confirmation">
        <div className="alert alert-success" role='alert'>Thanks! We'll let you know when we open registration at the email below!</div>
        {!justChangedEmail ? null : <div className='alert alert-success' role='alert'>Successfully changed email!</div>}
        <form id="emailChangeForm" className="form-inline text-center" onSubmit={this._onSubmit}>
          <div className="form-group">
            <label className="sr-only" htmlFor="emailField">Email address</label>
            <input type="email" className="form-control" id="emailField" placeholder="Email" value={email} onChange={this._onChange} />
          </div>
          <button type="submit" className="btn btn-default">Change Email</button>
        </form>
      </div>
    );
  }
});

module.exports = PreRegisterConfirmation;
