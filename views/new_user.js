function addUser(user) {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'http://arcane-retreat-92908.herokuapp.com/users',
        crossdomain: true,
        headers: {'Access-Control-Allow-Origin': '*','Authorization': 'Basic root:root'},
        data: JSON.stringify(user),
        success: function(data){
            const userInfo = {
                'username': data.username,
                'password': data.password
            };
            console.log('success');
            // logIn(userInfo);
        }
    });
}

// function logIn(userInfo) {
//   $.ajax({
//      type: 'POST',
//      dataType: 'json',
//      crossdomain: true,
//      headers: {'Access-Control-Allow-Origin': '*'},
//      contentType: 'application/json; charset=utf-8',
//      url: 'https://arcane-retreat-92908.herokuapp.com/users/login',
//      data: JSON.stringify(userInfo),
//      success: function(data){
//         console.log(data);
//         console.log('success');
//         event.preventDefault();
//      }
//   });
// }

$(document).ready(function() {
    $('#signup').click(function(event){
        event.preventDefault();
        const user = {
            'username': $('#username').val(),
            'password': $('#password').val()
        };
        addUser(user);
    });
});




