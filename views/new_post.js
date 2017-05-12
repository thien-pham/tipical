let username;
let pw;
function addPost(post) {
  
  fetch('https://arcane-retreat-92908.herokuapp.com/posts', {
      method: 'POST',
      body: JSON.stringify(post),
      headers: {
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization' : `Basic ${btoa(username + ":" + pw)}`
      }
  })
  .then(newPost => {
      console.log('this is the newPost: ');
      console.dir(newPost);
  });
}

$(document).ready(function() {
    $('#sub').on('click',function(event){
        username = $("#uname").val();
        pw = $("#pw").val();

        event.preventDefault();
     
        const post = {
              'body' : `${$("#postData").val()}`,
              'location': [parseFloat($("#lat").val()),parseFloat($("#lon").val())],
              'username' : `${username}`
          };
          console.log('logging the post');
          console.log(post);
          addPost(post);

    });
});
