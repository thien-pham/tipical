function addUser(user) {
    fetch('https://arcane-retreat-92908.herokuapp.com/users', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
            'Accept':'application/json',
            'Content-Type':'application/json',
            'Authorization' : "Basic root:root"
        }
    })
    .then(newUser => {
        console.log('this is the newuser: ');
        console.dir(newUser);
    });
}

$(document).ready(function() {
    $('#signupButton').on('click',function(event){
        event.preventDefault();
        const user = {
            'username': $('#username').val(),
            'password': $('#password').val()
        };
        console.log(user);
        addUser(user);
    });
});
