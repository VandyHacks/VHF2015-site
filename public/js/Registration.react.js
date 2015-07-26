var React = require('react');
var Select = require('react-select');
var SignIn = require('./SignIn.react');
var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var ParseUtils = require('./ParseUtils');
var $ = require('jquery');

var HACKATHON_NAME = 'VandyHacks II';

var hasApp = false;

var Registration = React.createClass({

  mixins: [ParseReact.Mixin],

  getInitialState() {
    return {
      uploadAgain: false, // upload a new resume to replace old one
    };
  },

  observe() {
    var Hackathon = Parse.Object.extend('Hackathon');
    var Application = Parse.Object.extend('Application');
    var hackathonQuery = new Parse.Query(Hackathon);
    hackathonQuery.equalTo('name', HACKATHON_NAME);
    var applicationQuery = new Parse.Query(Application);
    applicationQuery.matchesQuery('hackathon', hackathonQuery);
    applicationQuery.matchesQuery('hacker', Parse.User.current());

    return {
      user: ParseReact.currentUser,
      schools: new Parse.Query('School'),
      majors: new Parse.Query('Major'),
      application: applicationQuery,
      hackathon: hackathonQuery,
    };
  },

  _saveApplication() {
    //create/update Application
    if (!hasApp) {
      var app = {
        hacker: curUser,
        hackathon: this.data.hackathon[0],
      };

      ParseReact.Mutation.Create('Application', app)
      .dispatch({waitForServer: true})
      .then(function(){
      }, ParseUtils.onError);

      hasApp = true;
    } else {
      ParseReact.Mutation.Set(
        this.data.application[0],
        {
        }
      )
      .dispatch({waitForServer: true})
      .then(function(){
      }.bind(this), ParseUtils.onError);
    }
  },

  _saveUser(file) {
    var curUser = Parse.User.current();
    // TODO: add validation (if needed, html5 seems to have it handled)

    // update User
    var x = {};
    [
      'email',
      'firstName',
      'lastName',
      'github',
      'linkedin',
      'gender',
      'graduatingYear',
      'foodRestrictions',
      'shirtSize',
      'specialNeeds',
    ].forEach(key => {
      curUser.set(key, this.data.user[key]);
      x[key] = this.data.user[key];
    });

    if (file) {
      curUser.set('resume', file);
    }

    curUser.save();
  },

  _onSave(e) {
    if (e) {
      e.preventDefault();
    }

    if (!hasApp && this.data.application.length > 0) {
      hasApp = true;
    }

    var resumeUpload = React.findDOMNode(this.refs.resume);
    if (resumeUpload && resumeUpload.files.length) {
      var file = resumeUpload.files[0];

      var parseFile = new Parse.File(file.name, file);
      parseFile.save().then(function(file) {
        // The file has been saved to Parse.
        this._saveUser(file);
        this.setState({
          uploadAgain: false,
        });
      }.bind(this), ParseUtils.onError);
    } else {
      this._saveUser();
    }

    this._saveApplication();
  },

  componentDidMount() {
    // jquery haxx0rs because the scrolling to an invalid input is off due to
    // the absolute positioned header
    var delay = 150;
    var offset = 100; // roughly height of header + some padding

    document.addEventListener('invalid', function(e){
       $(e.target).addClass("invalid");
       $('html, body').animate({scrollTop: $($(".invalid")[0]).offset().top - offset }, delay);
    }, true);

    document.addEventListener('change', function(e){
       $(e.target).removeClass("invalid");
    }, true);
  },

  _onUserChange(name, e) {
    this.data.user[name] = e.target.value;
    this.forceUpdate();
  },

  render() {
    var {user} = this.data;

    if (!user) {
      return <SignIn />;
    } else {
      return (
        <form onSubmit={this._onSave}>
          <div className="form-group">
            <label htmlFor="email" className="required">Email address*</label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="Email"
              required="required"
              value={user.email}
              onChange={this._onUserChange.bind(this, "email")}
            />
            <p className="help-block">We'll use this for all communications, so make sure it's right!</p>
          </div>
          <div className="form-group">
            <label htmlFor="firstName" className="required">Name*</label>
            <input
              id="firstName"
              type="text"
              className="form-control"
              placeholder="First Name"
              required="required"
              value={user.firstName}
              onChange={this._onUserChange.bind(this, "firstName")}
            />
            <input
              id="lastName"
              type="text"
              className="form-control"
              placeholder="Last Name"
              required="required"
              value={user.lastName}
              onChange={this._onUserChange.bind(this, "lastName")}
            />
          </div>
          <div className="form-group">
            <label className="required">Gender*</label>
            <select
              className="form-control input-md"
              required="required"
              value={user.gender}
              onChange={this._onUserChange.bind(this, "gender")} >
              <option value="">Please select a gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="required">School*</label>
            <p>searchable select</p>
          </div>
          <div className="form-group">
            <label className="required">Graduating Year*</label>
            <select
              className="form-control input-md"
              required="required"
              value={user.graduatingYear}
              onChange={this._onUserChange.bind(this, "graduatingYear")} >
              <option value="">Please select a year</option>
              <option value="2015">2015</option>
              <option value="2016">2016</option>
              <option value="2017">2017</option>
              <option value="2018">2018</option>
              <option value="2019">2019</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="required">Major(s)*</label>
            <p>searchable select</p>
          </div>
          <div className="form-group">
            <label htmlFor="github">Github/LinkedIn</label>
            <input
              id="github"
              type="text"
              className="form-control"
              placeholder="https://github.com/username"
              value={user.github}
              onChange={this._onUserChange.bind(this, "github")}
            />
            <input
              id="linkedin"
              type="text"
              className="form-control"
              placeholder="https://www.linkedin.com/in/username"
              value={user.linkedin}
              onChange={this._onUserChange.bind(this, "linkedin")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="resume" id="resumeLabel">Resume</label>
            {
              !this.state.uploadAgain && user.resume ?
              <div className="alert alert-success resume-alert" role="alert">
                Resume Successfully Uploaded
                <br />
                <a
                  href=""
                  onClick={
                    (e) => {
                      this.setState({uploadAgain: true});
                      e.preventDefault();
                    }
                  }
                >(Upload Again?)</a>
              </div> :
              <input type="file" id="resume" ref="resume" />
            }
            <p className="help-block">Some of our sponsors get this, so make sure it's polished!</p>
          </div>
          <div className="form-group">
            <label className="required">Food Restrictions*</label>
            <select
              className="form-control input-lg"
              required="required"
              value={user.foodRestrictions}
              onChange={this._onUserChange.bind(this, "foodRestrictions")} >
              <option value="none">None</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="required">Shirt Size*</label>
            <select
              className="form-control input-lg"
              required="required"
              value={user.shirtSize}
              onChange={this._onUserChange.bind(this, "shirtSize")} >
              <option value="">Please select a size</option>
              <option value="S">Small</option>
              <option value="M">Medium</option>
              <option value="L">Large</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="specialneeds">Special Needs</label>
            <textarea
              className="form-control"
              rows="2"
              id="specialneeds"
              value={user.specialNeeds}
              onChange={this._onUserChange.bind(this, "specialNeeds")}
            />
          </div>
          <button type="submit" className="btn btn-primary">Save Application</button>
        </form>
      );
    }
  }
});

module.exports = Registration;
