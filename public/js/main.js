$(function() {
  jQuery(".full-width-text").fitText();
});

var Main ={};

Main.handleParseError = function(err) {
  console.log(err);
  switch (err.code) {
    case Parse.Error.INVALID_SESSION_TOKEN:
      Parse.User.logOut();
      break;
  }
}

Main.onsignup = function(user) {
  FB.api(
    "/" + user.attributes.authData.facebook.id,
    function (response) {
      if (response && !response.error) {
        //fbq('track', 'LoggedIn');
        /* handle the result */
        user.setEmail(response.email);
        user.set('firstName', response.first_name);
        user.set('lastName', response.last_name);
        user.set('gender', response.gender);
        user.save(null, {
          error: Main.handleParseError,
          success: function(user) {
            console.log('success');
            Main.showEmailDialog(Parse.User.current());
          },
        });
      } else {
        console.log('FB auth error: ');
        console.log(response);
      }
    }
  );
};

Main.showEmailDialog = function(user) {
  $("#login-fb").hide();
  $("#emailField").val(user.get('email'));
  $("#confirmation").show();
  $("#emailChangeForm").prepend(
    "<div class='alert alert-success' role='alert'>Thanks! We'll let you know when we open registration at the email below!</div>"
  );
}

Main.login = function() {
  // Run code after the Facebook SDK is loaded.
  Parse.FacebookUtils.logIn('email,user_friends',
    {
      success: Main.onsignup,
      error: Main.handleParseError,
    }
  );
};

Main.run = function() {
  var currentUser = Parse.User.current();

  if (currentUser) {
    currentUser.fetch(
      {
        success: function(user) {
          Main.showEmailDialog(user);
        },
        error: Main.handleParseError,
      }
    );
  } else {
    $("#login-fb").show();
  }
};

Main.changeEmail = function() {
  var user = Parse.User.current();
  user.setEmail($("#emailField").val());
  user.save(null, {
    error: Main.handleParseError,
    success: function(user) {
      $("#emailChangeForm").prepend(
        "<div id='email-change-alert' class='alert alert-success' role='alert'>Successfully changed email!</div>"
      );
      setTimeout(function() {
        $("#email-change-alert").remove();
      }, 4000);
    },
  });
};
