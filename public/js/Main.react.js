var constants = require('./constants');
var FAQ = require('./FAQ.react');
var React = require('react');
var ImageCarousel = require('./ImageCarousel.react');
var Registration = require('./Registration.react');

var Scroll = require('react-scroll');

var {Element, Link} = Scroll;

var Main = React.createClass({

  render() {
    return (
    <div className="container-fluid main-container">

      <Element name="about" className="element">
        <div className="row info-row">
          <div className="hidden-xs col-sm-offset-1 col-sm-4">
            <ImageCarousel />
          </div>
          <div className="col-xs-10 col-xs-offset-1 col-sm-offset-0 col-sm-6">
            <h1 className="title gold text-center">What is <span className="gold">VandyHacks</span>?</h1>
            <p>
              Founded in the spring of 2015, VandyHacks was the first collegiate hackathon to call the rockin' city of <span className="gold">Nashville, Tennessee</span> home.
              Now, we're proud to bring you VandyHacks II- and it's gonna be even bigger and better. From October 2-4, <span className="gold">250+ students</span> from universities all over the nation will meet at <span className="gold">Vanderbilt University</span> for a weekend of collaboration, innovation, and great food (<span className="gold">#southernhospitality</span>).
              We hope to see y'all there!
            </p>
            <div className="text-center action-buttons">
              <Link to="apply" spy={true} smooth={true} offset={-50} duration={500} >
                <a className="button" href="#apply">Apply</a>
              </Link>
              <a className="button" href="mailto:info@vandyhacks.org">Sponsor</a>
              <a className="button" href="http://goo.gl/forms/or9W0jceFv" target="_mentors">Mentor</a>
            </div>
          </div>
        </div>
      </Element>

      <Element name="faq" className="element">
        <div className="row faq info-row">
          <div className="col-xs-10 col-xs-offset-1">
            <h1 className="title gold text-center">Frequently Asked Questions</h1>
            <FAQ questions={constants.FAQ} />
          </div>
        </div>
      </Element>

      <Element name="apply" className="element">
        <div className="row info-row">
          <div className="col-xs-10 col-xs-offset-1 col-md-8 col-md-offset-2 text-center">
            <h1 className="title gold">Register</h1>
            <Registration />
          </div>
        </div>
      </Element>

      <Element name="spnsrs" className="element">
        <div className="row info-row">
          <div className="col-xs-10 col-xs-offset-1 text-center">
            <h1 className="title gold">Sponsors</h1>
            <a href="http://www.att.com/" target="_att">
              <img src="img/logos/att.jpg" className="spnsr-logo" />
            </a>
            <a href="http://www.digitalreasoning.com/" target="_DR">
              <img src="img/logos/DR.png" className="spnsr-logo" />
            </a>
            <a href="http://www.digitalocean.com/" target="_do">
              <img src="img/logos/DO.svg" className="spnsr-logo" />
            </a>
            <a href="http://www.epic.com/" target="_epic">
              <img src="img/logos/epic.jpg" className="spnsr-logo" />
            </a>
            <a href="http://www.lexmark.com/" target="_lm">
              <img src="img/logos/lexmark.svg" className="spnsr-logo" />
            </a>
            <a href="http://www.capitalone.com/" target="_co">
              <img src="img/logos/capitalone.svg" className="spnsr-logo" />
            </a>
            <a href="http://www.yikyakapp.com" target="_yik">
              <img src="img/logos/yikyak.png" className="spnsr-logo" />
            </a>
            <a href="http://www.eventbrite.com/" target="_eb">
              <img src="img/logos/eventbrite.png" className="spnsr-logo" />
            </a>
            <a href="http://www.launchtn.org/" target="_ltn">
              <img src="img/logos/launchtn.jpg" className="spnsr-logo" />
            </a>
            <a href="http://www.leankit.com/" target="_lk">
              <img src="img/logos/leankit.svg" className="spnsr-logo" />
            </a>
            <a href="http://metova.com/" target="_mt">
              <img src="img/logos/metova.png" className="spnsr-logo" />
            </a>
            <a href="http://engineering.vanderbilt.edu/" target="_vuse">
              <img src="img/logos/vuse.svg" className="spnsr-logo" />
            </a>
            <a href="http://mercury.io/" target="_m">
              <img src="img/logos/mercury.svg" className="spnsr-logo" />
            </a>
            <a href="http://www.lunarlincoln.com/" target="_l">
              <img src="img/logos/lunarlincoln.svg" className="spnsr-logo" />
            </a>
            <a href="http://www.stickermule.com/" target="_mule">
              <img src="img/logos/stickermule.png" className="spnsr-logo" />
            </a>
            <p>Interested in sponsoring? Contact us at <a href="mailto:info@vandyhacks.org" className="gold">info@vandyhacks.org</a>.</p>
          </div>
        </div>
      </Element>

      <div className="row info-row">
        <div className="col-xs-10 col-xs-offset-1 text-center">
          <h1 className="title gold">Partners</h1>
          <a href="https://mlh.io/" target="_partner">
            <img src="img/logos/mlh.svg" className="spnsr-logo" />
          </a>
          <a href="http://devpost.com/" target="_partner">
            <img src="img/logos/devpost.svg" className="spnsr-logo" />
          </a>
          <a href="https://www.thalmic.com/myo/" target="_partner">
            <img src="img/logos/myo.png" className="spnsr-logo" />
          </a>
          <a href="https://www.oculus.com" target="_partner">
            <img src="img/logos/oculus.png" className="spnsr-logo" />
          </a>
        </div>
      </div>
    </div>
    );
  }
});

module.exports = Main;
