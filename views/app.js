$(document).ready(function(){

  var markers = []

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: new google.maps.LatLng(40.771,-73.974)
  });
  // console.log(map.center);
  // getTips(40.771,-73.974);
  // var center = {
  //   lat: undefined,
  //   lng: undefined
  // };

//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(function (position) {
//
//       center = {
//         lat: position.coords.latitude,
//         lng: position.coords.longitude
//       };
//
//       map.setCenter(center);
//       getTips(center);
//     }, function () {
//       console.log('Error in the geolocation service.');
//     });
//   } else {
//     console.log('Browser does not support geolocation.');
//   }
// });

  $('#search-button').on('click',function(event){
    event.preventDefault();
    let address = `${$("#search-field").val()}`;
    console.log('ehhhh?', address);
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        let lat = results[0].geometry.location.lat();
        let lng = results[0].geometry.location.lng();
        let location = [lat, lng];
        console.log('???', location);
        $.ajax({
          url: `https://glacial-coast-82060.herokuapp.com?lat=${location[0]}&lon=${location[1]}`,
          dataType: 'json',
          method: 'GET',
          success: function(tips) {
            console.log('tips', tips);
            deleteMarkers();
            getMarkers(tips);
          },
          error: function(error) {
            console.log('error');
          }
        });
      }
    })
  })

  function deleteMarkers() {
      markers.forEach(function(marker) {
        marker.setMap(null);
        marker = null;
      })
      markers = [];
    }

  function getTips() {
    $.ajax({
      url: `https://glacial-coast-82060.herokuapp.com?lat=${location[0]}&lon=${location[1]}`,
      dataType: 'json',
      method: 'GET',
      success: getMarkers,
      error: function(error) {
        console.log('error');
      }
    });
    }

  function getMarkers(tips) {
    // getTips(location).then(tips => {
      let markers = [];
      tips.forEach(tip => {
        let text = tip.body;
        let center = {
          lat: tip.location[0],
          lng: tip.location[1]
        };
        console.log('???', center)
        var image = {
          url: 'marker.png',
          // This marker is 20 pixels wide by 32 pixels high.
          size: new google.maps.Size(32, 32),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          anchor: new google.maps.Point(0,32),
          labelOrigin: new google.maps.Point(9, 9)
        };
        var pin = new google.maps.Marker({
          position: center,
          map,
          icon: image,
          label: {
            text:tip.body,
            color: "#eb3a44",
            fontSize: "16px",
            fontWeight: "bold"
          });
        markers.push(pin)
        console.log('making a marker');
        console.log(tip);
        // var myLatLng = new google.maps.LatLng(location);
        //       var marker = new google.maps.Marker({
        //             position: myLatLng,
        //             map: map,
        //             title: 'Hello World!'
        //         });
        // // var coords = location.features.geometry.coordinates;
        // var latLng = new google.maps.LatLng(coords[1],coords[0]);
        //     var marker = new google.maps.Marker({
        //       position: latLng,
        //       map: map
        // let markers=[];
        // let icon = {
        //   url: 'marker.png',
        //   origin: [0.5, 0.5]
        // }
        // let marker = new MarkerWithLabel({
        //   map: map,
        //   position: new google.maps.LatLng(tip.location),
        //   labelContent: tip.body
        // })
      })
    // })
  }
    });
  // function addPost(post) {
  //   fetch('https://glacial-coast-82060.herokuapp.com/posts', {
  //       method: 'POST',
  //       body: JSON.stringify(post),
  //       headers: {
  //           'Accept':'application/json',
  //           'Content-Type':'application/json',
  //       }
  //   })
  //   .then(newPost => {
  //       console.log('this is the newPost: ');
  //       console.dir(newPost);
  //       //render the new markers
  //       getMarkers(location);
  //   });
  // }
  //
  //
  //     $('#submit-button').on('click',function(event){
  //         event.preventDefault();
  //         let address = `${$("#tip-field").val()}`;
  //         // let a = getLatitudeLongitude(address);
  //         console.log('ehhhh?', address);
  //         var geocoder = new google.maps.Geocoder();
  //         geocoder.geocode( { 'address': address}, function(results, status) {
  //           if (status == google.maps.GeocoderStatus.OK) {
  //             let lat = results[0].geometry.location.lat();
  //             let lng = results[0].geometry.location.lng();
  //             let location = [lat, lng];
  //             console.log('???', location);
  //             // return location;
  //
  //           const post = {
  //             'body' : `${$("#postData").val()}`,
  //             'location': location
  //             // 'address': `${$("#address").val()}`
  //           };
  //           console.log('logging the post');
  //           console.log(post);
  //           addPost(post);
  //           getMarkers(location);
  //           }
  //           });
  //     });
  //
  //
  // // $('#submit-button').on('click', (event)=>{
  // //   event.preventDefault();
  // //   const post = {
  // //       'body' : `${$("#tip-field").val()}`,
  // //       'location': [clickedLocation[1],clickedLocation[0]]
  // //   };
  // //   console.log('logging the post');
  // //   console.log(post);
  // //   addPost(post);
  // // })
  // //
  // // $('#search-button').on('click', (event)=>{
  // //   event.preventDefault();
  // //   let searchArray = $("#search-field").val().toString().split(',').map(val=>parseInt(val));
  // //   console.log(cityLocation)
  // //   CenterMap(cityLocation.geobyteslongitude,cityLocation.geobyteslatitude);
  // //   getTips(cityLocation.geobyteslatitude,cityLocation.geobyteslongitude)
  // //
  // // });
  //
//   function deleteMarkers() {
//     markers.forEach(function(marker) {
//       marker.setMap(null);
//       marker = null;
//     })
//     markers = [];
//   }
//
//   function getTips() {
//     $.ajax({
//       url: "http://localhost:3000/api",
//       method: 'GET',
//       success: placeRestaurants,
//       error: function(error) {
//         console.log('error');
//       }
//     });
//   }
//
//   function placeRestaurants(restaurants){
//     restaurants.forEach(function(restaurant){
//       var center = {
//         lat: restaurant.location.coordinates[1],
//         lng: restaurant.location.coordinates[0]
//       };
//       var pin = new google.maps.Marker({
//         position: center,
//         map: map,
//         title: restaurant.name
//       });
//       markers.push(pin)
//     });
//   }
//
// });


// $(function () {
//
//     var mapOptions = {
//         zoom: 10,
//         center: new google.maps.LatLng(40.771,-73.974)
//     };
//
//     var map;
//     var locationMarker;
//
//     var geocoder = new google.maps.Geocoder();
//
//     function initialize() {
//         map = new google.maps.Map(document.getElementById('map'), mapOptions);
//
// // // var input = document.getElementById('search-field');
//         var autocompleteInput = new google.maps.places.Autocomplete(document.getElementById('search-field'));
//
//         //Autocomplete place Changed
//         google.maps.event.addListener(autocompleteInput, 'place_changed', function () {
//
//             autocompleteInput.bindTo('bounds', map);
//
//             locationMarker = new google.maps.Marker({
//                 map: map
//             });
//
//             var selectedPlace = autocompleteInput.getPlace();
//             if (!selectedPlace.geometry) {
//                 return;
//             }
//
//             if (selectedPlace.geometry.viewport) {
//                 map.fitBounds(selectedPlace.geometry.viewport);
//             } else {
//                 map.setCenter(selectedPlace.geometry.location);
//                 map.setZoom(17);
//             }
//
//             locationMarker.setPosition(selectedPlace.geometry.location);
//
//             var locationAddress = '';
//             if (selectedPlace.address_components) {
//                 address = [
//                   (selectedPlace.address_components[0] && selectedPlace.address_components[0].short_name || ''),
//                   (selectedPlace.address_components[1] && selectedPlace.address_components[1].short_name || ''),
//                   (selectedPlace.address_components[2] && selectedPlace.address_components[2].short_name || '')
//                 ].join(' ');
//             }
//
//         }); //From place_changed
//
//     }
//
// var input = document.getElementById('search-field');
//
// var searchBox = new google.maps.places.SearchBox(input);
//
// searchBox.addListener('places_changed', function() {
//   var places = searchBox.getPlaces();
//
//   if (places.length == 0) {
//     return;
//   }
//
//   // Clear out the old markers.
//   markers.forEach(function(marker) {
//     marker.setMap(null);
//   });
//
//   let markers = [];
//
//   // For each place, get the icon, name and location.
//   var bounds = new google.maps.LatLngBounds();
//   places.forEach(function(place) {
//     if (!place.geometry) {
//       console.log("Returned place contains no geometry");
//       return;
//     }
//     var icon = {
//       url: place.icon,
//       size: new google.maps.Size(71, 71),
//       origin: new google.maps.Point(0, 0),
//       anchor: new google.maps.Point(17, 34),
//       scaledSize: new google.maps.Size(25, 25)
//     };
//
//     // Create a marker for each place.
//     markers.push(new google.maps.Marker({
//       map: map,
//       icon: icon,
//       title: place.name,
//       position: place.geometry.location
//     }));
//
//     if (place.geometry.viewport) {
//       // Only geocodes have viewport.
//       bounds.union(place.geometry.viewport);
//     } else {
//       bounds.extend(place.geometry.location);
//     }
//   });
//   map.fitBounds(bounds);
// });
//     google.maps.event.addDomListener(window, 'load', initialize);
//
// });
//

// // // let tipMap = {};
// // // tipMapp.markers = [];
// // // let map;
// // // var input = document.getElementById('search-field');
// // // var autocomplete = new google.maps.places.Autocomplete(input, {types:['geocode']});
// //
// // // var MAPAPP = {};
// // // MAPAPP.markers = [];
// // // MAPAPP.currentInfoWindow;
// // // MAPAPP.pathName = window.location.pathname;
// // //
// // // $(document).ready(function() {
// // //     initialize();
// // //     populateMarkers(MAPAPP.pathName);
// // // });
// //
// // function initMap() {
// //   var center = new google.maps.LatLng(40.771,-73.974);
// //   var mapOptions = {
// //     zoom: 10,
// //     center
// //   };
// //   this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
// // };
// // //
// // // // function geolocate() {
// // // //   if (navigator.geolocation) {
// // // //     navigator.geolocation.getCurrentPosition(function(position) {
// // // //       var geolocation = {
// // // //         lat: position.coords.latitude,
// // // //         lng: position.coords.longitude
// // // //       };
// // // //       var circle = new google.maps.Circle({
// // // //         center: geolocation,
// // // //         radius: position.coords.accuracy
// // // //       });
// // // //       autocomplete.setBounds(circle.getBounds());
// // // //     });
// // // //   }
// // // // }
// // // //
//
// //
// // // function initAutocomplete() {
// // //   var map = new google.maps.Map(document.getElementById('map'), {
// // //     center: {lat: -33.8688, lng: 151.2195},
// // //     zoom: 13,
// // //     mapTypeId: 'roadmap'
// // //   });
// // //
// // //   // Create the search box and link it to the UI element.
// // //   var input = document.getElementById('pac-input');
// // //   var searchBox = new google.maps.places.SearchBox(input);
// // //   map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
// // //
// // //   // Bias the SearchBox results towards current map's viewport.
// // //   map.addListener('bounds_changed', function() {
// // //     searchBox.setBounds(map.getBounds());
// // //   });
// // //
// // //   var markers = [];
// // //   // Listen for the event fired when the user selects a prediction and retrieve
// // //   // more details for that place.
// // //   searchBox.addListener('places_changed', function() {
// // //     var places = searchBox.getPlaces();
// // //
// // //     if (places.length == 0) {
// // //       return;
// // //     }
// // //
// // //     // Clear out the old markers.
// // //     markers.forEach(function(marker) {
// // //       marker.setMap(null);
// // //     });
// // //     markers = [];
// // //
// // //     // For each place, get the icon, name and location.
// // //     var bounds = new google.maps.LatLngBounds();
// // //     places.forEach(function(place) {
// // //       if (!place.geometry) {
// // //         console.log("Returned place contains no geometry");
// // //         return;
// // //       }
// // //       var icon = {
// // //         url: place.icon,
// // //         size: new google.maps.Size(71, 71),
// // //         origin: new google.maps.Point(0, 0),
// // //         anchor: new google.maps.Point(17, 34),
// // //         scaledSize: new google.maps.Size(25, 25)
// // //       };
// // //
// // //       // Create a marker for each place.
// // //       markers.push(new google.maps.Marker({
// // //         map: map,
// // //         icon: icon,
// // //         title: place.name,
// // //         position: place.geometry.location
// // //       }));
// // //
// // //       if (place.geometry.viewport) {
// // //         // Only geocodes have viewport.
// // //         bounds.union(place.geometry.viewport);
// // //       } else {
// // //         bounds.extend(place.geometry.location);
// // //       }
// // //     });
// // //     map.fitBounds(bounds);
// // //   });
// // // }
// //
// // // function initialize() {
// // //         var goo = google.maps,
// // //           map = new goo.Map(document.getElementById('map_canvas'), {
// // //             zoom: 1,
// // //             center: new goo.LatLng(0, 0),
// // //             noClear: true
// // //           }),
// // //           input = map.getDiv().querySelector('input'),
// // //           ac = new goo.places.SearchBox(input),
// // //           service = new goo.places.PlacesService(map),
// // //           win = new goo.InfoWindow,
// // //           markers = [],
// // //           request;
// // //
// // //
// // //         map.controls[goo.ControlPosition.TOP_CENTER].push(input);
// // //
// // //         if (input.value.match(/\S/)) {
// // //           request = {
// // //             query: input.value
// // //           };
// // //           if (ac.getBounds()) {
// // //             request.bounds = ac.getBounds();
// // //           }
// // //           service.textSearch(request, function(places) {
// // //             //set the places-property of the SearchBox
// // //             //places_changed will be triggered automatically
// // //             ac.set('places', places || [])
// // //           });
// // //         }
// // //
// // //         goo.event.addListener(ac, 'places_changed', function() {
// // //
// // //           win.close();
// // //
// // //           //remove previous markers
// // //           while (markers.length) {
// // //             markers.pop().setMap(null);
// // //           }
// // //
// // //           //add new markers
// // //           (function(places) {
// // //             var bounds = new goo.LatLngBounds();
// // //             for (var p = 0; p < places.length; ++p) {
// // //               markers.push((function(place) {
// // //                 bounds.extend(place.geometry.location);
// // //                 var marker = new google.maps.Marker({
// // //                     map: map,
// // //                     position: place.geometry.location
// // //                   }),
// // //                   content = document.createElement('div');
// // //                 content.appendChild(document.createElement('strong'));
// // //                 content.lastChild.appendChild(document.createTextNode(place.name));
// // //                 content.appendChild(document.createElement('div'));
// // //                 content.lastChild.appendChild(document.createTextNode(place.formatted_address));
// // //                 goo.event.addListener(marker, 'click', function() {
// // //                   win.setContent(content);
// // //                   win.open(map, this);
// // //                 });
// // //                 return marker;
// // //               })(places[p]));
// // //             };
// // //             if (markers.length) {
// // //               if (markers.length === 1) {
// // //                 map.setCenter(bounds.getCenter());
// // //               } else {
// // //                 map.fitBounds(bounds);
// // //               }
// // //             }
// // //           })(this.getPlaces());
// // //         });
// // //       }
// // //       google.maps.event.addDomListener(window, 'load', initialize);
// //
// // // var autocomplete = new google.maps.places.Autocomplete(input, {types:['geocode']});
// // // function initMap() {
// // //   map = new google.maps.Map(document.getElementById('map'), {
// // //     center: {lat: 40.771, lng: -73.974},
// // //     zoom: 10
// // //   });
// // // }
// // //
// // // function getTips (lat, lon) {
// // //   return fetch(`https://tipical.herokuapp.com?lat=${lat}&lon=${lon}`).then(tips=>{
// // //     return tips.json();
// // //   })
// // // }
// // //
// // // function getMarkers(lat, lon) {
// // //   getTips(lat, lon).then(tips => {
// // //     tips.forEach(tip => {
// // //       let marker = new google.maps.Marker({
// // //         map: map,
// // //         position: new google.maps.LatLng()
// // //       })
// // //     })
// // //   })
// // // }
// // // let renderList = function(lat,lon){
// // //   console.log(`lat: ${lat}, lon: ${lon}`);
// // //   if(lat == undefined || lon == undefined){
// // //     $.get('https://glacial-coast-82060.herokuapp.com/').then((val)=>{
// // //       console.log("rendering default view");
// // //       populateList(val);
// // //
// // //     });
// // //   }else{
// // //     $.get(`https://glacial-coast-82060.herokuapp.com?lat=${lat}&lon=${lon}`).then((val)=>{
// // //       console.log("rendering Secondary view");
// // //       populateList(val);
// // //
// // //     });
// // //   }
// // // };
// // //
// // // renderList();
// // //
// // // let populateList = function(val){
// // //   let html = '';
// // //   val.forEach((val)=>{
// // //     html+=`
// // //       <div class="ui message grey column">
// // //         <div class="ui menu">
// // //           <p class="header item">${val.points.length}</p>
// // //           <p class = "header item">${val.location}</p>
// // //           <p class = "header item">${val.username}</p>
// // //           <p class="header item floated right">${val.date}</p>
// // //         </div>
// // //         <div><p>${val.body}</p></div>
// // //       </div>
// // //
// // //     `;
// // //   });
// // //   $('#posts').html(html);
// // // };
// //
