function addPost(post) {
  fetch('http://localhost:8080/posts', {
      method: 'POST',
      body: JSON.stringify(post),
      headers: {
          'Accept':'application/json',
          'Content-Type':'application/json',
          'Authorization' : "Basic root:root"
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
            'body' : 'Mongodb powerful'
        };
        console.log('logging the post');
        console.log(post);
        addPost(post);
    });
});
