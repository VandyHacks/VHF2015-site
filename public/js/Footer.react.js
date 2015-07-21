var React = require('react');
var Scroll = require('react-scroll');

var {Link} = Scroll;

var Footer = React.createClass({

  render() {
    return (
      <div className="container-fluid contact-logo-bottom-container">
        <Link to="top" spy={true} smooth={true} offset={0} duration={500}>
          <i className="up fa fa-angle-up gold arrow hidden-sm hidden-md hidden-lg"></i>
        </Link>
        <a href="https://www.facebook.com/vandyhacks" target="_fb" className="contact-logo">
          <img src="img/facebook.svg" className="bottom"/>
        </a>
        <a href="https://twitter.com/vandyhacks" target="_tweeter" className="contact-logo">
          <img src="img/twitter.svg" className="bottom"/>
        </a>
        <a href="mailto:info@vandyhacks.org" target="_mail" className="contact-logo">
          <img src="img/email.svg" className="bottom"/>
        </a>
      </div>
    );
  }
});

module.exports = Footer;
