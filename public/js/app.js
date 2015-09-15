var $ = require('jquery');
var Bootstrap = require('react-bootstrap');
var Footer = require('./Footer.react');
var Main = require('./Main.react');
var Parse = require('parse').Parse;
var React = require('react');
var Scroll = require('react-scroll');

var {Navbar, Nav, NavItem} = Bootstrap;
var {Element, Link} = Scroll;

var LOCALHOST = 'localhost';
var FB_PROD_ID = 508263295995091;
var FB_DEV_ID = 524904174331003;

Parse.initialize("DfoMH2OG5zwZ2Fsr0cbcuYkT2NFSrq89zBRIah3H", "UQRnGd3jIMfcg3HLg0sTQhqCdIFcHCx1yPeaE3nP");
Parse.FacebookUtils.init({
  appId: window.location.host.slice(0, LOCALHOST.length) === LOCALHOST ?
    FB_DEV_ID :
    FB_PROD_ID,
  cookie: true,  // enable cookies to allow Parse to access the session
  xfbml: true,  // initialize Facebook social plugins on the page
  version: 'v2.3' // point to the latest Facebook Graph API version
});

React.initializeTouchEvents(true);

React.render(
  <Main />,
  document.getElementById('main')
);

React.render(
  <Navbar>
    <div className="navbar-header">
      <Link to="top" spy={true} smooth={true} offset={0} duration={500}>
        <img className="navbar-logo navbar-brand" src="../img/logo.svg" height={35} />
      </Link>
    </div>
    <Nav>
      <li>
        <Link className="hoverable" to="about" spy={true} smooth={true} offset={-50} duration={500} >About</Link>
      </li>
      <li>
        <Link className="hoverable" to="faq" spy={true} smooth={true} offset={-50} duration={500} >FAQ</Link>
      </li>
      <li>
        <Link className="hoverable" to="spnsrs" spy={true} smooth={true} offset={-50} duration={500} >Sponsors</Link>
      </li>
    </Nav>
    <Nav right>
      <li>
        <Link className="hoverable" to="apply" spy={true} smooth={true} offset={-50} duration={500} >Apply</Link>
      </li>
    </Nav>
  </Navbar>,
  document.getElementById('nav')
);

React.render(
  <Element name="top" className="element" />,
  document.getElementById('top')
);

React.render(
  <Footer />,
  document.getElementById('footer')
);


/** jQuery Haxx0rs! **/
$(function() {
  var MOBILE_WIDTH_CUTOFF = 768;
  var $window = $(window);
  var $navbar = $('#nav');
  var $navbarContainer = $('#nav-container');
  var $headercontainer = $("#container");

  var onscroll = function () {
    if ($window.width() > MOBILE_WIDTH_CUTOFF) {
      if ($window.scrollTop() > $navbar.offset().top) {
        $navbarContainer.addClass('fixed');
        $headercontainer.css('margin-bottom', $navbarContainer.outerHeight(true));
      } else if ($window.scrollTop() < $headercontainer.outerHeight()) {
        $headercontainer.css('margin-bottom', 0);
        $navbarContainer.removeClass('fixed');
      }
    }
  };
  $window.on({
    'scrollstart': onscroll,
    'scroll': onscroll,
  });


  // scaling constant because the center of mass of the logo is to the left
  var SCALING_CONST = 0.75980392156863;

  var onresize = function() {
    var width = $('.header').height() * 0.3 * 0.9494595384165937;

    $('.logo').css('margin-left', (width * SCALING_CONST) / -2);
  };

  $(window).resize(onresize);
  onresize();
});
