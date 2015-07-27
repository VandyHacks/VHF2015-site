var React = require('react');
var Select = require('react-select');
var SignIn = require('./SignIn.react');
var Parse = require('parse').Parse;
var ParseUtils = require('./ParseUtils');

var $ = require('jquery');
var cx = require('react-classset');

var HACKATHON_NAME = 'VandyHacks II';
var offset = 100; // roughly height of header + some padding
var delay = 150;
var schoolInvalid = false;
var majorsInvalid = false;

var USER_PROPS = [
  {name: 'email', required: true,},
  {name: 'firstHackathon', required: true,},
  {name: 'firstName', required: true,},
  {name: 'foodRestrictions', required: false,},
  {name: 'gender', required: true,},
  {name: 'github', required: false,},
  {name: 'graduatingYear', required: true,},
  {name: 'lastName', required: true,},
  {name: 'linkedin', required: false,},
  {name: 'major', required: true,},
  {name: 'school', required: true,},
  {name: 'shirtSize', required: true,},
  {name: 'specialNeeds', required: false,},
];

var APP_PROPS = [
  {name: 'needsTravelReimbursement', required: false,}
];

class ApplicationUtils {
  constructor(ctx) {
    this.ctx = ctx;
  }

  load() {
    var hackathonQuery = new Parse.Query('Hackathon')
      .equalTo('name', HACKATHON_NAME);
    var applicationQuery = new Parse.Query('Application')
      .matchesQuery('hackathon', hackathonQuery)
      .equalTo('hacker', Parse.User.current());

    hackathonQuery.find(
      (hackathons) => {
        if (!hackathons.length) {
          throw new Error('Hackathon ${HACKATHON_NAME} not found');
        }
        applicationQuery.find(
          (apps) => {
            if (apps.length) {
              this.ctx.setState({application: apps[0]});
            } else {
              var app = new (Parse.Object.extend('Application'))();
              app.set('hacker', Parse.User.current());
              app.set('hackathon', hackathons[0]);
              app.save()
                .then(
                  (app) => {
                    this.ctx.setState({application: app });
                  },
                  ParseUtils.onError
                );
            }
          },
          ParseUtils.onError
        );
      }
    );
  }

  validate() {
    return APP_PROPS.filter(prop => prop.required).every(key => {
      var val = this.ctx.state.application.get(key.name);
      if (val == null || val === '') {
        return false;
      } else {
        return true;
      }
    });
  }

  updateField(field, e) {
    this.ctx.state.application.set(field, e.target.value);
    this.ctx.forceUpdate();
  }

  save() {
    if (this.validate()) {
      // TODO: all props are valid, send to server, update UI with good-alert
      this.ctx.state.application.save()
        .then(function() {}, ParseUtils.onError);
    }
  }
}

class UserUtils {
  constructor(ctx) {
    this.ctx = ctx;
  }

  validate() {
    return USER_PROPS.filter(prop => prop.required).every(key => {
      var val = this.ctx.state.user.get(key.name);
      if (val == null || val === '') {
        return false;
      } else {
        return true;
      }
    });
  }

  save() {
    if (this.validate()) {
      // TODO: all props are valid, send to server, update UI with good-alert
      this.ctx.state.user.save()
        .then(function() {}, ParseUtils.onError);
    } else {
      // normal HTML5 'required' will be scrolled to, but not these weird Select boxes
      if (!this.ctx.state.user.get('school')) {
        $('html, body')
          .animate(
            {
              scrollTop: $(React.findDOMNode(this.ctx.refs.school)).offset().top - offset
            },
            delay
          );
      } else if (!this.ctx.state.user.get('major')) {
        $('html, body')
          .animate(
            {
              scrollTop: $(React.findDOMNode(this.ctx.refs.major)).offset().top - offset
            },
            delay
          );
      }
    }
  }

  updateField(field, e) {
    this.ctx.state.user.set(field, e.target.value);
    this.ctx.forceUpdate();
  }
}

var Registration = React.createClass({

  getInitialState() {
    return {
      uploadAgain: false, // upload a new resume to replace old one

      user: Parse.User.current(),
      UserUtils: new UserUtils(this),

      majors: null,
      schools: null,

      application: null,
      ApplicationUtils: new ApplicationUtils(this),
    };
  },

  componentDidMount() {
    // jquery haxx0rs because the scrolling to an invalid input is off due to
    // the absolute positioned header
    document.addEventListener('invalid', function(e){
       $(e.target).addClass("invalid");
       $('html, body').animate({scrollTop: $($(".invalid")[0]).offset().top - offset }, delay);
    }, true);

    document.addEventListener('change', function(e){
       $(e.target).removeClass("invalid");
    }, true);

    // Load initial data
    new Parse.Query('Major')
      .find((majors) => this.setState({majors}), ParseUtils.onError);

    new Parse.Query('School')
      .find((schools) => this.setState({schools}), ParseUtils.onError);

    if (Parse.User.current()) {
      this.state.ApplicationUtils.load();
    }
  },

  _onLoad() {
    this.setState(
      {user: Parse.User.current()},
      () => {this.state.ApplicationUtils.load();}
    );
  },

  _onSave(e) {
    if (e) {
      e.preventDefault();
    }

    var resumeUpload = React.findDOMNode(this.refs.resume);
    if (resumeUpload && resumeUpload.files.length) {
      var file = resumeUpload.files[0];

      var parseFile = new Parse.File(file.name, file);
      parseFile.save().then(
        (file) => {
          // attach File to user, then save
          this.state.user.set('resume', file);
          this.state.UserUtils.save();

          this.setState({ // TODO: iffy
            uploadAgain: false,
          });
        },
        ParseUtils.onError
      );
    } else {
      // Save the User
      this.state.UserUtils.save();
    }

    // Save the Application
    this.state.ApplicationUtils.save();

    $('html, body')
      .animate(
        {
          scrollTop: $(React.findDOMNode(this.refs.status)).offset().top - offset - 250
        },
        delay
      );
  },

  _appStatus() {
    return this.state.UserUtils.validate() &&
      this.state.ApplicationUtils.validate();
  },

  render() {
    var {application, majors, schools, user} = this.state;

    if (!user) {
      return <SignIn onLogin={this._onLoad}/>;
    }

    if (!application) {
      return null;
    }

    var schoolOpts = [];
    if (schools) {
      schools.forEach(school => {
        schoolOpts.push({label: school.get('name'), value: school.get('name')});
      });
    }
    var schoolCSS = cx({
      'form-group': true,
      'error': schoolInvalid,
    });

    var majorOpts = [];
    if (majors) {
      majors.forEach(major => {
        majorOpts.push({label: major.get('name'), value: major.get('name')});
      });
    }
    var majorCSS = cx({
      'form-group': true,
      'error': majorsInvalid,
    });
    return (
      <form onSubmit={this._onSave}>
        {
          this._appStatus() ?
          <div ref="status" className="alert alert-success" role="alert">Application Status: Submitted</div> :
          <div ref="status" className="alert alert-danger" role="alert">Application Status: Incomplete</div>
        }
        <div className="form-group">
          <label htmlFor="email" className="required">Email address*</label>
          <input
            id="email"
            type="email"
            className="form-control"
            placeholder="Email"
            required="required"
            value={user.get('email')}
            onChange={this.state.UserUtils.updateField.bind(this.state.UserUtils, 'email')}
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
            value={user.get('firstName')}
            onChange={this.state.UserUtils.updateField.bind(this.state.UserUtils, 'firstName')}
          />
          <input
            id="lastName"
            type="text"
            className="form-control"
            placeholder="Last Name"
            required="required"
            value={user.get('lastName')}
            onChange={this.state.UserUtils.updateField.bind(this.state.UserUtils, 'lastName')}
          />
        </div>
        <div className="form-group">
          <label className="required">Gender*</label>
          <select
            className="form-control input-md"
            required="required"
            value={user.get('gender')}
            onChange={this.state.UserUtils.updateField.bind(this.state.UserUtils, 'gender')} >
            <option value="">Please select a gender</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className={schoolCSS} ref="school">
          <label className="required">School*</label>
          <Select
            value={user.get('school')}
        		allowCreate={true}
        		placeholder="Select your school"
        		options={schoolOpts}
        		onChange={
              (val) => {
                if (val === '') {
                  this.state.UserUtils.updateField('school', {target: {value: null}});
                  return;
                }

                var opts = schoolOpts.filter(opt => {
                  return opt.value === val;
                });
                if (!opts.length) {
                  var School = Parse.Object.extend('School');
                  var newSchool = new School();

                  newSchool.set('name', val)
                    .save(function(){}, ParseUtils.onError);
                }

                this.state.UserUtils.updateField('school', {target: {value: val}});
              }
            } />
        </div>
        <div className="form-group">
          <label className="required">Graduating Year*</label>
          <select
            className="form-control input-md"
            required="required"
            value={user.get('graduatingYear')}
            onChange={this.state.UserUtils.updateField.bind(this.state.UserUtils, 'graduatingYear')} >
            <option value="">Please select a year</option>
            <option value="2015">2015</option>
            <option value="2016">2016</option>
            <option value="2017">2017</option>
            <option value="2018">2018</option>
            <option value="2019">2019</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className={majorCSS} ref="major">
          <label className="required">Major(s)*</label>
          <Select
        		value={user.get('major')}
            multi={true}
            delimiter={'***'}
        		allowCreate={true}
        		placeholder="Select your major(s)"
        		options={majorOpts}
        		onChange={
              (val) => {
                if (val === '') {
                  this.state.UserUtils.updateField('major', {target: {value: null}});
                  return;
                }

                var majors = val.split('***');
                majors.forEach(major => {
                  var opts = majorOpts.filter(opt => {
                    return opt.value === major;
                  });
                  if (!opts.length) {
                    var Major = Parse.Object.extend('Major');
                    var newMajor = new Major();

                    newMajor.set('name', major)
                      .save(function(){}, ParseUtils.onError);
                  }
                });

                this.state.UserUtils.updateField('major', {target: {value: majors}});
              }
            } />
        </div>
        <div className="form-group">
          <label className="required">Shirt Size*</label>
          <select
            className="form-control input-lg"
            required="required"
            value={user.get('shirtSize')}
            onChange={this.state.UserUtils.updateField.bind(this.state.UserUtils, 'shirtSize')} >
            <option value="">Please select a size</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
            <option value="XL">XL</option>
            <option value="XXL">XXL</option>
          </select>
        </div>
        <div className="form-group">
            <div className="checkbox">
              <label className="required" htmlFor="firstHackathon">
                <input
                  type="checkbox"
                  id="firstHackathon"
                  checked={user.get('firstHackathon')}
                  onChange={
                    (e) => {
                      var oldVal = user.get('firstHackathon');
                      this.state.UserUtils.updateField('firstHackathon', {target:{value: !oldVal}});
                    }
                  } />
                  Is this your first hackathon?*
              </label>
            </div>
        </div>
        <div className="form-group">
          <label htmlFor="github">Github/LinkedIn</label>
          <input
            id="github"
            type="text"
            className="form-control"
            placeholder="https://github.com/username"
            value={user.get('github')}
            onChange={this.state.UserUtils.updateField.bind(this.state.UserUtils, 'github')}
          />
          <input
            id="linkedin"
            type="text"
            className="form-control"
            placeholder="https://www.linkedin.com/in/username"
            value={user.get('linkedin')}
            onChange={this.state.UserUtils.updateField.bind(this.state.UserUtils, 'linkedin')}
          />
        </div>
        <div className="form-group">
          <label htmlFor="resume" id="resumeLabel">Resume</label>
          {
            !this.state.uploadAgain && user.get('resume') ?
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
          <label>Food Restrictions</label>
          <select
            className="form-control input-lg"
            value={user.get('foodRestrictions')}
            onChange={this.state.UserUtils.updateField.bind(this.state.UserUtils, 'foodRestrictions')} >
            <option value="">Please select an option</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="other">Other (specify in special needs)</option>
          </select>
        </div>
        <div className="form-group">
            <div className="checkbox">
              <label className="required" htmlFor="needsTravelReimbursement">
                <input
                  type="checkbox"
                  id="needsTravelReimbursement"
                  checked={application.get('needsTravelReimbursement')}
                  onChange={
                    (e) => {
                      var oldVal = application.get('needsTravelReimbursement');
                      this.state.ApplicationUtils.updateField('needsTravelReimbursement', {target:{value: !oldVal}});
                    }
                  } />
                Do you need travel reimbursement?*
              </label>
            </div>
        </div>
        <div className="form-group">
          <label htmlFor="specialneeds">Special Needs</label>
          <textarea
            className="form-control"
            rows="2"
            id="specialneeds"
            value={user.get('specialNeeds')}
            onChange={this.state.UserUtils.updateField.bind(this.state.UserUtils, 'specialNeeds')}
          />
        </div>
        <button type="submit" className="btn btn-primary">Save Application</button>
      </form>
    );
  }
});

module.exports = Registration;
