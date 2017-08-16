function getCurrentUser(){
  return fetch('https://glacial-coast-82060.herokuapp.com/users', {
      method: 'get',
      headers: {
          'Accept':'application/json',
          'Content-Type':'application/json',
      }
  })
  .then(val => {
      console.log('this is the val: ');
      console.dir(val);
      return val;
  });
}

function addPost(post) {
  fetch('https://glacial-coast-82060.herokuapp.com/posts', {
      method: 'POST',
      body: JSON.stringify(post),
      headers: {
          'Accept':'application/json',
          'Content-Type':'application/json',
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
        let address = `${$("#address").val()}`;
        // let a = getLatitudeLongitude(address);
        // console.log('ehhhh?', a);
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            let lat = results[0].geometry.location.lat();
            let lng = results[0].geometry.location.lng();
            let location = [lat, lng];
            console.log('???', location);
            // return location;

          const post = {
            'body' : `${$("#postData").val()}`,
            'location': location
            // 'address': `${$("#address").val()}`
          };
          console.log('logging the post');
          console.log(post);
          addPost(post);
          // getMarkers(location);
          }
          });
        });
});
