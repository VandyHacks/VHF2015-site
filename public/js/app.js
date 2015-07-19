var $ = require('jquery');
var constants = require('./constants');
var FAQ = require('./FAQ.react');
var ImageCarousel = require('./ImageCarousel.react');
var React = require('react');
var Parse = require('parse').Parse;
var PreRegisterBox = require('./PreRegisterBox.react');

var LOCALHOST = 'localhost';
var FB_PROD_ID = 508263295995091;
var FB_DEV_ID = 524904174331003;

// Parse.initialize("DfoMH2OG5zwZ2Fsr0cbcuYkT2NFSrq89zBRIah3H", "UQRnGd3jIMfcg3HLg0sTQhqCdIFcHCx1yPeaE3nP");
// Parse.FacebookUtils.init({
//   appId: window.location.host.slice(0, LOCALHOST.length) === LOCALHOST ?
//     FB_DEV_ID :
//     FB_PROD_ID,
//   cookie: true,  // enable cookies to allow Parse to access the session
//   xfbml: true,  // initialize Facebook social plugins on the page
//   version: 'v2.3' // point to the latest Facebook Graph API version
// });

React.render(
  <ImageCarousel />,
  document.getElementById('image-carousel')
);
React.render(
  <FAQ questions={constants.FAQ} />,
  document.getElementById('faq')
);
// React.render(
//   <PreRegisterBox />,
//   document.getElementById('react-hook')
// );

var Bootstrap = require('react-bootstrap');
var {Navbar, Nav, NavItem} = Bootstrap;


React.render(
  <Navbar>
    <div className="navbar-header">
      <img className="navbar-logo navbar-brand" src="../img/logo.svg" height={35} />
    </div>
    <Nav>
      <NavItem eventKey={1} href='#about'>About</NavItem>
      <NavItem eventKey={2} href='#faq'>FAQ</NavItem>
      <NavItem eventKey={2} href='#spnsrs'>Sponsors</NavItem>
    </Nav>
  </Navbar>,
  document.getElementById('nav')
);

var onscroll = function() {
  if ($(window).width() > 768) {
    if ($(window).scrollTop() > $('.navbar').offset().top) {
      $(".navbar").addClass('fixed');
      $(".header-container").css('margin-bottom', $('.navbar').outerHeight(true));
    } else if ($(window).scrollTop() < $(".header-container").outerHeight()) {
      $(".header-container").css('margin-bottom', 0);
      $(".navbar").removeClass('fixed');
    }
  }
};

$(window).on({
  'scrollstart': onscroll,
  'scroll': onscroll,
});


var widest = null;
$("*").each(function() {
  if (widest == null)
    widest = $(this);
  else
  if ($(this).width() > widest.width())
    widest = $(this);
});
console.log(widest)
