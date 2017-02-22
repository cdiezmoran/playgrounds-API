$(function () {
  function updateSignUpButton() {
    $btn = $('.btn-signup')

    if ($btn.hasClass('green')) {
      $btn.removeClass('green');
      $btn.text('Sign up to launch awesome games')
      return
    }

    $btn.addClass('green');
    $btn.text('Sign up to play awesome games')
  }

  $('.btn-signup').click(function(e) {
    e.preventDefault();
    var email = $('[name=email]').val().trim();
    var isDeveloper = isDev();

    if (!validateEmail(email)) {
      swal("Invalid email", "", "error");
      return
    }

    var potentialUser = {
      user: {
        email: email,
        isDeveloper: isDeveloper
      }
    }

    $.ajax({
      type: 'POST',
      url: '/register',
      data: JSON.stringify(potentialUser),
      contentType: 'application/json',
      success: function(data) {
        swal("Good job!", "You clicked the button!", "success");
      },
      error: function(err) {
        swal("There was an error!", err, "error");
      }
    });

    var mailchimpUser = {
      email_address: email,
      status: 'subscribed'
    }

    var listID = '6f7d8c131d';
    var mailchimpApiKey = 'aa2cd30d5e8312ffaec744b0b01c6095-us15';

    var user = 'alphastage'

    $.ajax({
      type: 'POST',
      url: 'https://us15.api.mailchimp.com/3.0/lists/' + listID + '/members',
      data: JSON.stringify(mailchimpUser),
      contentType: 'application/json',
      beforeSend: function (xhr) {
        xhr.setRequestHeader ("Authorization", make_base_auth(user, mailchimpApiKey));
      },
      success: function(data) {
        console.log(data);
      },
      error: function(err) {
        console.log(err);
      }
    })
  });

  function make_base_auth(user, password) {
    var tok = user + ':' + password;
    var hash = btoa(tok);
    return 'Basic ' + hash;
  }

  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  function isDev() {
    $btn = $('.btn-signup')
    if ($btn.hasClass('green')) {
      return false
    }

    return true
  }

  $('.dev-select').click(function (e) {
    e.preventDefault();
    var $target = $('.dev-select');
    var $playerSelect = $('.player-select');

    if ($target.hasClass('active')) {
      return
    }

    $target.addClass('active');
    $playerSelect.removeClass('active');

    updateSignUpButton();
  })

  $('.player-select').click(function (e) {
    e.preventDefault();
    var $target = $('.player-select');
    var $devSelect = $('.dev-select');

    if ($target.hasClass('active')) {
      return
    }

    $target.addClass('active');
    $devSelect.removeClass('active');

    updateSignUpButton();
  })
})
