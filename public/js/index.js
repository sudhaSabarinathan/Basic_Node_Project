function postform() {
    $.ajax({
      url: '/register',
      type: 'POST',
      cache: false,
      data: {
        username: $('#username').val(),
        email: $('#email').val(),
        password: $('#password').val(),
        password2: $('#password2').val()
      },
      success: function () {
        $('#error-group').css('display', 'none');
        console.log("successfully registered!!!");
        window.location.replace('/profile')
      },
      error: function (data) {
        console.log(data);
        $('#error-group').css('display', 'block');
        var errors = JSON.parse(data.responseText);
        var errorsContainer = $('#errors');
        errorsContainer.innerHTML = '';
        var errorsList = '';
  
        for (var i = 0; i < errors.length; i++) {
          errorsList += '<li>' + errors[i].msg + '</li>';
        }
        errorsContainer.html(errorsList);
      }
    });
  }

  function postloginform() {
    $.ajax({
      url: '/login',
      type: 'POST',
      cache: false,
      data: {
        username: $('#username').val(),
        password: $('#password').val(),
      },
      success: function () {
        console.log("successfully logged in!!!");
        $('#error-group').css('display', 'none');
        window.location.replace('/');
      },
      error: function (data) {
        console.log("error");
        console.log(data);
        $('#error-group').css('display', 'block');
        var errors = JSON.parse(data.responseText);
        var errorsContainer = $('#errors');
        errorsContainer.innerHTML = '';
        var errorsList = '';
  
        for (var i = 0; i < errors.length; i++) {
          errorsList += '<li>' + errors[i].msg + '</li>';
        }
        errorsContainer.html(errorsList);
      }
    });
  }