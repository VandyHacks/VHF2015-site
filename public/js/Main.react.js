var constants = require('./constants');
var FAQ = require('./FAQ.react');
var React = require('react');
var ImageCarousel = require('./ImageCarousel.react');
var PreRegisterBox = require('./PreRegisterBox.react');

var Scroll = require('react-scroll');

var {Element, Link} = Scroll;

var Main = React.createClass({

  render() {
    return (
    <div className="container-fluid main-container">

      <Element name="about" className="element">
        <div className="row">
          <div className="col-xs-10 col-xs-offset-1">
            <div className="row intro-row">
              <div className="hidden-xs col-sm-4">
                <ImageCarousel />
              </div>
              <div className="col-xs-12 col-sm-8">
                <h1 className="title main-header text-center">What is <span className="gold">VandyHacks</span>?</h1>
                <p className="text-center">VandyHacks is the premiere university hackathon in Nashville, TN, featuring <span className="gold">250+ students</span>. Join us on <span className="gold">October 2-4, 2015</span> at <span className="gold">Vanderbilt University</span>.</p>
                <div className="text-center">
                  <Link to="apply" spy={true} smooth={true} offset={-50} duration={500} >
                    <a className="button" href="#apply">Apply</a>
                  </Link>
                  <a className="button" href="mailto:info@vandyhacks.org">Sponsor</a>
                  <a className="button" href="http://goo.gl/forms/or9W0jceFv" target="_mentors">Mentor</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Element>

      <Element name="faq" className="element">
        <div className="row faq">
          <div className="col-xs-10 col-xs-offset-1">
            <h1 className="title gold text-center">Frequently Asked Questions</h1>
            <FAQ questions={constants.FAQ} />
          </div>
        </div>
      </Element>

      <Element name="apply" className="element">
        <div className="row">
          <div className="col-xs-10 col-xs-offset-1 col-sm-4 col-sm-offset-4 text-center">
            <h1 className="title gold">Pre-register</h1>
            <PreRegisterBox />
          </div>
        </div>
      </Element>

      <Element name="spnsrs" className="element">
        <div className="row">
          <div className="col-xs-10 col-xs-offset-1 text-center">
            <h1 className="title gold">Sponsors</h1>
            <a href="http://www.digitalreasoning.com/" target="_DR">
              <img src="img/logos/DR.png" className="spnsr-logo" />
            </a>
            <p>Interested in sponsoring? Contact us at <a href="mailto:info@vandyhacks.org" className="gold">info@vandyhacks.org</a>.</p>
          </div>
        </div>
      </Element>

      <div className="row">
        <div className="col-xs-10 col-xs-offset-1 text-center">
          <h1 className="title gold">Partners</h1>
          <img src="img/logos/mlh.svg" className="spnsr-logo" />
        </div>
      </div>
    </div>
    );
  }
});

module.exports = Main;
