function addPost(post) {
  let username = $('#uname').val();
  let pw = $('#pw').val();
  fetch('https://arcane-retreat-92908.herokuapp.com/posts', {
      method: 'POST',
      body: JSON.stringify(post),
      credentials:'include',
      headers: {
          'Accept':'application/json',
          'Content-Type':'application/json',
          // 'Authorization' : `Basic ${btoa(username + ":" + pw)}`
      }
  })
  .then(newPost => {
      console.log('this is the newPost: ');
      console.dir(newPost);
  });
}

$(document).ready(function() {
    $('#sub').on('click',function(event){
        event.preventDefault();
        const post = {
            'body' : `${$("#postData").val()}`,
            'location': [parseFloat($("#lat").val()),parseFloat($("#lon").val())],
            'username' : `${$('#uname').val()}`
        };
        console.log('logging the post');
        console.log(post);
        addPost(post);
    });
});
