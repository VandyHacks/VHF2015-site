var React = require('react');
var BetterSignIn = require('./BetterSignIn.react');
var Parse = require('parse').Parse;
var ParseUtils = require('./ParseUtils');

var ApplicationStatus = React.createClass({

  getInitialState() {
    return {
      user: Parse.User.current(),
      application: null,
    };
  },

  componentDidMount() {
    this._loadApp();
  },

  _loadApp() {
    if (Parse.User.current()) {
      var applicationQuery = new Parse.Query('Application');
      applicationQuery.equalTo('hacker', Parse.User.current());
      applicationQuery.find(
        (apps) => {
          this.setState({
            application: apps[0]
          });
        },
        ParseUtils.onError
      );
    }
  },

  _onLoad() {
    this.setState(
      {user: Parse.User.current()}
    );
    this._loadApp();
  },

  _rsvp(yes) {
    this.state.application.set('coming', yes);
    this.state.application.save().then(
      (application) => {
        this.setState({
          application
        });
        this.forceUpdate();
      },
      (app, error) => {
        alert("Unable to RSVP. Please notify us with this error code: " + error.code);
      }
    );
  },

  _onYes() {
    this._rsvp(true);
  },

  _onNo() {
    this._rsvp(false);
  },

  render() {
    var {user, application} = this.state;

    if (!user) {
      return <BetterSignIn onLogin={this._onLoad}/>;
    }

    if (!application) {
      return null;
    }

    if (application.get('coming') === false) {
      return <div>
        <p>Thanks for confirming "no". Sorry you can't make it! Maybe next time!</p>
      </div>
    }


    var busSchoolsRegexen = [
      [/(geo.+(tech|state)|University of Georgia)/gi, "https://www.facebook.com/groups/825286634255315/", "Georgia Tech"],
      [/purd/gi, "https://www.facebook.com/groups/1602873143313552/", "Purdue"],
      [/(duke|unc)/gi, "https://www.facebook.com/groups/973507226005365/", "Duke and UNC"]
    ];

    var travel = <div>
      <p>We are unfortunately unable to provide travel reimbursement.</p>
    </div>;
    var travelURL;
    var regionName;
    busSchoolsRegexen.map((row) => {
      if (user.get('school').match(row[0])) {
        travelURL = row[1];
        regionName = row[2];
        travel = <div>
        <p>
          We are sending a bus to {regionName}, so travel will be fully reimbursed. More details on transportation will be made available in the next couple of weeks.
          In the meantime, please join this Facebook group - all transportation logistics will primarily be communicated through it: <a href={travelURL} target="_new">{travelURL}</a>
        </p>
        <p>
          Empty seats on the day of will be filled on a first-come, first-serve basis by anyone who wants to come last-minute - so, please tell your friends!
        </p>
        </div>;
      }
    });

    var buttons = <div>
      <p>Are you coming to VandyHacks?</p>
      <button type="button" className="btn btn-primary" onClick={this._onYes}>Yes</button>
      <button type="button" className="btn btn-danger" onClick={this._onNo}>No</button>
    </div>;
    if (application.get('coming') === true) {
      buttons = <p className="gold">Thanks for confirming "yes"! We'll see you there!</p>
    }

    var message;
    if (application.get('status') === 'accepted') {
      message = "accepted";
      message = <div>
        <h3>Congratulations!</h3>
        <p>You have been accepted into VandyHacks II!</p>
        <p>It will take place from 10PM, Friday, October 2 to 3PM, Sunday, October 4 at Vanderbilt University in Nashville, TN.</p>
        <p>Please join the VandyHacks II participant group to keep up with all the latest updates and interact with other participants: <a target="_new" href="https://www.facebook.com/groups/143656289311972/">https://www.facebook.com/groups/143656289311972/</a></p>
        {travel}
        <p>Please RSVP by <strong style={{"fontSize": "1.1em"}}>September 14 at 11:59PM</strong>. At that time, we will accept people off the waitlist.</p>
        <br/>
        {buttons}
      </div>;
    } else if (application.get('status') === 'waitlisted') {
      message = "waitlisted";
    } else if (application.get('status') === 'rejected') {
      message =
        <div>
          <h3>Sorry!</h3>
          <p>Thank you so much for applying to participate in VandyHacks II! We received an extraordinary number of awesome applications, and for that, we are beyond grateful.</p>
          <p>This season, we decided to use a <strong>random lottery</strong> for our acceptances. Unfortunately, your name was not chosen, and we will be unable to offer you a spot at VandyHacks.</p>
          <p>We hope that you will continue to apply in the future and come chill with us in Nashville!</p>
          <p>As always, feel free to email us with any questions or concerns.</p>
          <br/>
          <i style={{"fontSize": "0.8em"}}>PS: Were you super pumped about coming to VandyHacks? Are you willing to pay your own way here? Shoot us an email, tell us why you want to come, and we'll see what we can do!</i>
        </div>;
    }

    return (
      <div>
        {message}
      </div>
    );
  }
});

module.exports = ApplicationStatus;
