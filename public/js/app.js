var $ = require('jquery');
var Main = require('./Main.react');
var React = require('react');
var Parse = require('parse').Parse;
var Scroll = require('react-scroll');

var {Link} = Scroll;

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

React.render(
  <Main />,
  document.getElementById('main')
);

var Bootstrap = require('react-bootstrap');
var {Navbar, Nav, NavItem} = Bootstrap;

React.render(
  <Navbar>
    <div className="navbar-header">
      <img className="navbar-logo navbar-brand" src="../img/logo.svg" height={35} />
    </div>
    <Nav>
      <li>
        <Link to="about" spy={true} smooth={true} offset={-50} duration={500} >About</Link>
      </li>
      <li>
        <Link to="faq" spy={true} smooth={true} offset={-50} duration={500} >FAQ</Link>
      </li>
      <li>
        <Link to="spnsrs" spy={true} smooth={true} offset={-50} duration={500} >Sponsors</Link>
      </li>
    </Nav>
  </Navbar>,
  document.getElementById('nav')
);

$(function() {
  var MOBILE_WIDTH_CUTOFF = 768;
  var $window = $(window);
  var $navbar = $('#nav');
  var $headercontainer = $("#container");

  var onscroll = function () {
    if ($window.width() > MOBILE_WIDTH_CUTOFF) {
      if ($window.scrollTop() > $navbar.offset().top) {
        $navbar.addClass('fixed');
        $headercontainer.css('margin-bottom', $navbar.outerHeight(true));
      } else if ($window.scrollTop() < $headercontainer.outerHeight()) {
        $headercontainer.css('margin-bottom', 0);
        $navbar.removeClass('fixed');
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
    $('.logo').css('margin-left', ($('.logo').width() * SCALING_CONST) / -2);
  };

  $(window).resize(onresize);
  onresize();
});
