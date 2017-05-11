function addUser(user) {
    fetch('https://arcane-retreat-92908.herokuapp.com/users', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Accept':'application/json',
            'Content-Type':'application/json'
        }
    })
    .then(newUser => {
        console.log('this is the newuser: ');
        console.dir(newUser);
    });
    /*
    $.ajax({
        // beforeSend: function(xhrObj){
        //  xhrObj.setRequestHeader("Authorization","Basic root:root");
        //  xhrObj.setRequestHeader("Access-Control-Allow-Origin","*");
        //  xhrObj.setRequestHeader("Access-Control-Allow-Methods","POST, GET, OPTIONS, PUT, DELETE");
        //  xhrObj.setRequestHeader("Access-Control-Allow-Headers","Content-Type");
        //  xhrObj.withCredentials = true;
        //  } ,
        type: 'POST',
        dataType: 'json',
        url: 'http://arcane-retreat-92908.herokuapp.com/users',
        crossdomain: true,
        cors:true,
        contentType: 'application/json; charset=utf-8',
        headers: {'Accept': 'application/json', 'Access-Control-Allow-Origin': '*','Authorization': 'Basic root:root'},
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
    */
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




