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
          getMarkers(location);
          }
          });
        // const post = {
        //   'body' : `${$("#postData").val()}`,
        //   'location': [location]
        //   // 'address': `${$("#address").val()}`
        // };
        // // console.log(post);
        // // let add = document.getElementById('address').value;
        //
        //
        // // getLatLong(post.address);
        // // console.log([lat,lng]);
        // console.log('logging the post');
        // console.log(post);
        // addPost(post);
    });
});

// function showResult(result) {
//     console.log(result);
//
// }
// function getLatitudeLongitude(address) {
//   let geocoder = new google.maps.Geocoder();
//   geocoder.geocode( { 'address': address}, function(results, status) {
//     if (status == google.maps.GeocoderStatus.OK) {
//       let lat = results[0].geometry.location.lat();
//       let lng = results[0].geometry.location.lng();
//       address = [lat, lng];
//       console.log('???', address);
//       // callback(location);
//     }
//   })
// }

// var button = document.getElementById('btn');
//
// button.addEventListener("click", function () {
//     var address = document.getElementById('address').value;
//     getLatitudeLongitude(showResult, address)
// });
// function getLatLong(address) {
//   try{
//     if(address=="")return("");
//     var geo = Maps.newGeocoder().geocode(address);
//     if(geo.status=="OK"){
//       var lng = geo.results[0].geometry.viewport.southwest.lng;
//       var lat = geo.results[0].geometry.viewport.southwest.lat;
//       console.log('????', [lat,lng]);
//       return([lat,lng]);
//     }
//     else{
//       return("error");
//     }
//   }
//   catch(err){
//     return(err);
//   }
// }

// var olview = new ol.View({ center: [0, 0], zoom: 2 }),
//     baseLayer = new ol.layer.Tile({ source: new ol.source.OSM() }),
//     map = new ol.Map({
//       target: document.getElementById('map'),
//       view: olview,
//       layers: [baseLayer]
//     });

// var geocoder = new Geocoder('nominatim', {
//   provider: 'osm',
//   lang: 'en-US', //en-US, fr-FR
//   placeholder: 'Search for ...',
//   featureStyle : ol.style.Style,
//   targetType: 'text-input',
//   limit: 5,
//   keepOpen: true
// });
// // map.addControl(geocoder);
//
// geocoder.on('addresschosen', function(evt){
//   console.log('what happens here', post.address, evt.address)
//   // var feature = evt.feature,
//   //     coord = evt.coordinate,
//   //     address = evt.address;
//   // // some popup solution
//   // content.innerHTML = '<p>'+ address.formatted +'</p>';
//   // overlay.setPosition(coord);
// });

// geocoder.on('addresschosen', function(evt) {
//   // it's up to you
//   console.info(evt);
// });
