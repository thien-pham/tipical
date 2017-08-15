let clickedMarker;
let geoLocation = {
  lon: -73.974,
  lat: 40.771
};

let vectorSource = new ol.source.Vector(),vectorLayer = new ol.layer.Vector({source: vectorSource})

let map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    }),
    vectorLayer
  ],
  overlay: new ol.Overlay({
    element: document.getElementById('overlay'),
    positioning: 'bottom-center'
  }),
  view: new ol.View({
    center: ol.proj.fromLonLat([geoLocation.lon, geoLocation.lat]),
    zoom: 10
  })
});

function CenterMap(lon, lat) {
    map.getView().setCenter(ol.proj.fromLonLat([parseFloat(lon), parseFloat(lat)]));
    map.getView().setZoom(10);
}

$(function ()
 {
	 $("#search-field").autocomplete({
		source: function (request, response) {
		 $.getJSON(
			"http://gd.geobytes.com/AutoCompleteCity?callback=?&q="+request.term,
			function (data) {
        response(data);
			}
		 );
		},
		minLength: 3,
		select: function (event, ui) {
      var selectedObj = ui.item;
		  $("#search-field").val(selectedObj.value);
  		getCityDetails(selectedObj.value);
		  return false;
		},
		open: function () {
		 $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
		},
		close: function () {
		 $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
		}
	});
	$("#search-field").autocomplete("option", "delay", 100);
  CenterMap(geoLocation.lon, geoLocation.lat);
  getTips(geoLocation.lat, geoLocation.lon);
});

function getCityDetails (fqcn) {
	if (typeof fqcn == "undefined") fqcn = $("#f_elem_city").val();
	cityfqcn = fqcn;
	if (cityfqcn) {
    $.getJSON(
      "http://gd.geobytes.com/GetCityDetails?callback=?&fqcn="+cityfqcn,
         function (data) {
            console.log(data);
            geoLocation = data;
            CenterMap(geoLocation.geobyteslongitude, geoLocation.geobyteslatitude);
            getTips(geoLocation.geobyteslatitude, geoLocation.geobyteslongitude);
          }
    );
	}
}

function getTips (location) {
  return fetch(`https://glacial-coast-82060.herokuapp.com?lat=${location[0]}&lon=${location[1]}`).then(tips=>{
    return tips.json();
  })
}

function getMarkers (location) {
  getTips(location).then(tips => {
    //vectorSource.clear();
    tips.forEach(tip => {
      console.log("making a marker");
      console.log(tip);
      let coordinate = ol.proj.transform([tip.location[1],tip.location[0]], 'EPSG:4326','EPSG:3857');
      let feature = new ol.Feature(
          new ol.geom.Point(coordinate)
      );

      let iconStyle = new ol.style.Style({
          image: new ol.style.Icon({
              anchor: [0.5, 0.5],
              anchorXUnits: 'fraction',
              anchorYUnits: 'fraction',
              opacity: 1,
              src: 'marker.png'
          }),
          text: new ol.style.Text({
              font: '14px Helvetica, sans-serif',
              fill: new ol.style.Fill({ color: '#000' }),
              stroke: new ol.style.Stroke({
                  color: '#fff', width: 5
              }),
              offsetY: 20,
              text: tip.body
          })
      });

      feature.setStyle(iconStyle);
      vectorSource.addFeature(feature);
    })
  });
};

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
      //render the new markers
      getMarkers(location);
      // getMarkers(geoLocation.lat, geoLocation.lon);
  });
}

// $('#search-button').on('click', (event)=>{
//   event.preventDefault();
//   let searchArray = $("#search-field").val().toString().split(',').map(val=>parseInt(val));
//   // console.log(val)
//   console.log('!!!!', searchArray)
//   CenterMap(geoLocation.lon, geoLocation.lat);
//   getTips(geoLocation.lat, geoLocation.lon);
// });

map.on('click', function(evt){
  //now set the location

  let iconStyle = new ol.style.Style({
      image: new ol.style.Icon({
          anchor: [0.5, 46],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 0.75,
          src: '//openlayers.org/en/v3.8.2/examples/data/icon.png'
      })
    });
    if(clickedMarker){
      vectorLayer.getSource().removeFeature(clickedMarker);
    }

    clickedMarker = new ol.Feature(
      new ol.geom.Point(evt.coordinate)
    );

    //THIS IS HOW YOU CAN GET COORDINATES FROM A FEATURE
    clickedLocation = clickedMarker.getGeometry().getCoordinates();
    clickedLocation = ol.proj.transform(clickedLocation, 'EPSG:3857', 'EPSG:4326');
    console.log(clickedLocation)


  clickedMarker.setStyle(iconStyle);
  vectorSource.addFeature(clickedMarker);

});

getMarkers(geoLocation.lat,geoLocation.lon);

// let layer = new ol.layer.Tile({
//   source: new ol.source.OSM()
// });
//
// let map = new ol.Map({
//   layers: [layer],
//   target: 'map',
//   view: new ol.View({
//     center: [40.771, -73.974],
//     zoom: 10
//   }),
//   overlay: new ol.Overlay({
//     element: document.getElementById('overlay'),
//     positioning: 'bottom-center'
//   })
// });
//
// function CenterMap(lat, lon) {
//     // console.log("Long: " + long + " Lat: " + lat);
//     map.getView().setCenter(ol.proj.fromLonLat([parseFloat(lat), parseFloat(lon)]));
//     map.getView().setZoom(11);
// }
//
// function getTips (lat, lon) {
//   return fetch(`https://glacial-coast-82060.herokuapp.com?lat=${lat}&lon=${lon}`).then(tips=>{
//     return tips.json();
//   })
// }
//
// function getMarkers(lat, lon) {
//   getTips(lat, lon).then(tips => {
//     tips.forEach(tip => {
//       let coordinates = ol.proj.transform([tip.location[1],tip.location[0]], 'EPSG:4326','EPSG:3857');
//       let feature = new ol.Feature(
//           new ol.geom.Point(coordinates)
//       );
//
//       let iconStyle = new ol.style.Style({
//           image: new ol.style.Icon({
//           anchor: [0.5, 46],
//           anchorXUnits: 'fraction',
//           anchorYUnits: 'pixels',
//           opacity: 0.75,
//           src: '//openlayers.org/en/v3.8.2/examples/data/icon.png'
//           }),
//           text: new ol.style.Text({
//           font: '16px Calibri,sans-serif',
//           fill: new ol.style.Fill({ color: '#000' }),
//           stroke: new ol.style.Stroke({
//               color: '#fff', width: 5
//           }),
//           text: tip.body
//           })
//       });
//
//       feature.setStyle(iconStyle);
//       vectorSource.addFeature(feature);
//     })
//   });
// };
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
//       getMarkers(autocompleteInput);
//   });
// }
//
// $('#submit-button').on('click', (event)=>{
//   event.preventDefault();
//   const post = {
//       'body' : `${$("#tip-field").val()}`,
//       'location': [clickedLocation[1],clickedLocation[0]]
//   };
//   console.log('logging the post');
//   console.log(post);
//   addPost(post);
// })
//
// $('#search-button').on('click', (event)=>{
//   event.preventDefault();
//   let searchArray = $("#search-field").val().toString().split(',').map(val=>parseInt(val));
//   console.log(cityLocation)
//   CenterMap(cityLocation.geobyteslongitude,cityLocation.geobyteslatitude);
//   getTips(cityLocation.geobyteslatitude,cityLocation.geobyteslongitude)
//
// });
// var pos = ol.proj.fromLonLat([16.3725, 48.208889]);
//
// // Vienna marker
// var marker = new ol.Overlay({
//   position: pos,
//   positioning: 'center-center',
//   element: document.getElementById('marker'),
//   stopEvent: false
// });
// map.addOverlay(marker);
//
// // Vienna label
// var vienna = new ol.Overlay({
//   position: pos,
//   element: document.getElementById('vienna')
// });
// map.addOverlay(vienna);
//
// // Popup showing the position the user clicked
// var popup = new ol.Overlay({
//   element: document.getElementById('popup')
// });
// map.addOverlay(popup);
//
// map.on('click', function(evt) {
//   var element = popup.getElement();
//   var coordinate = evt.coordinate;
//   var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(
//       coordinate, 'EPSG:3857', 'EPSG:4326'));
//
//   $(element).popover('destroy');
//   popup.setPosition(coordinate);
//   // the keys are quoted to prevent renaming in ADVANCED mode.
//   $(element).popover({
//     'placement': 'top',
//     'animation': false,
//     'html': true,
//     'content': '<p>The location you clicked was:</p><code>' + hdms + '</code>'
//   });
//   $(element).popover('show');
// });
//
//
// // $(function () {
// //
// //     var mapOptions = {
// //         zoom: 10,
// //         center: new google.maps.LatLng(40.771,-73.974)
// //     };
// //
// //     var map;
// //     var locationMarker;
// //
// //     var geocoder = new google.maps.Geocoder();
// //
// //     function initialize() {
// //         map = new google.maps.Map(document.getElementById('map'), mapOptions);
// //
// // // // var input = document.getElementById('search-field');
// //         var autocompleteInput = new google.maps.places.Autocomplete(document.getElementById('search-field'));
// //
// //         //Autocomplete place Changed
// //         google.maps.event.addListener(autocompleteInput, 'place_changed', function () {
// //
// //             autocompleteInput.bindTo('bounds', map);
// //
// //             locationMarker = new google.maps.Marker({
// //                 map: map
// //             });
// //
// //             var selectedPlace = autocompleteInput.getPlace();
// //             if (!selectedPlace.geometry) {
// //                 return;
// //             }
// //
// //             if (selectedPlace.geometry.viewport) {
// //                 map.fitBounds(selectedPlace.geometry.viewport);
// //             } else {
// //                 map.setCenter(selectedPlace.geometry.location);
// //                 map.setZoom(17);
// //             }
// //
// //             locationMarker.setPosition(selectedPlace.geometry.location);
// //
// //             var locationAddress = '';
// //             if (selectedPlace.address_components) {
// //                 address = [
// //                   (selectedPlace.address_components[0] && selectedPlace.address_components[0].short_name || ''),
// //                   (selectedPlace.address_components[1] && selectedPlace.address_components[1].short_name || ''),
// //                   (selectedPlace.address_components[2] && selectedPlace.address_components[2].short_name || '')
// //                 ].join(' ');
// //             }
// //
// //         }); //From place_changed
// //
// //     }
// //
// // var input = document.getElementById('search-field');
// //
// // var searchBox = new google.maps.places.SearchBox(input);
// //
// // searchBox.addListener('places_changed', function() {
// //   var places = searchBox.getPlaces();
// //
// //   if (places.length == 0) {
// //     return;
// //   }
// //
// //   // Clear out the old markers.
// //   markers.forEach(function(marker) {
// //     marker.setMap(null);
// //   });
// //   let markers = [];
// //
// //   // For each place, get the icon, name and location.
// //   var bounds = new google.maps.LatLngBounds();
// //   places.forEach(function(place) {
// //     if (!place.geometry) {
// //       console.log("Returned place contains no geometry");
// //       return;
// //     }
// //     var icon = {
// //       url: place.icon,
// //       size: new google.maps.Size(71, 71),
// //       origin: new google.maps.Point(0, 0),
// //       anchor: new google.maps.Point(17, 34),
// //       scaledSize: new google.maps.Size(25, 25)
// //     };
// //
// //     // Create a marker for each place.
// //     markers.push(new google.maps.Marker({
// //       map: map,
// //       icon: icon,
// //       title: place.name,
// //       position: place.geometry.location
// //     }));
// //
// //     if (place.geometry.viewport) {
// //       // Only geocodes have viewport.
// //       bounds.union(place.geometry.viewport);
// //     } else {
// //       bounds.extend(place.geometry.location);
// //     }
// //   });
// //   map.fitBounds(bounds);
// // });
// //     google.maps.event.addDomListener(window, 'load', initialize);
// //
// // });
// //
//
// // //
// // // $(function () {
// // //   var googleMapService = {};
// // //
// // //         // Array of locations obtained from API calls
// // //         var locations = [];
// // //
// // //         // Selected Location (initialize to center of America)
// // //         var selectedLat = 39.50;
// // //         var selectedLong = -98.35;
// // //
// // //         // Functions
// // //         // --------------------------------------------------------------
// // //         // Refresh the Map with new data. Function will take new latitude and longitude coordinates.
// // //         googleMapService.refresh = function(latitude, longitude){
// // //
// // //             // Clears the holding array of locations
// // //             locations = [];
// // //
// // //             // Set the selected lat and long equal to the ones provided on the refresh() call
// // //             selectedLat = latitude;
// // //             selectedLong = longitude;
// // //
// // //             // Perform an AJAX call to get all of the records in the db.
// // //             $http.get('/tips').success(function(response){
// // //
// // //                 // Convert the results into Google Map Format
// // //                 locations = convertToMapPoints(response);
// // //
// // //                 // Then initialize the map.
// // //                 initialize(latitude, longitude);
// // //             }).error(function(){});
// // //         };
// // //
// // //         // Private Inner Functions
// // //         // --------------------------------------------------------------
// // //         // Convert a JSON of users into map points
// // //         var convertToMapPoints = function(response){
// // //
// // //             // Clear the locations holder
// // //             var locations = [];
// // //
// // //             // Loop through all of the JSON entries provided in the response
// // //             for(var i= 0; i < response.length; i++) {
// // //                 var tip = response[i];
// // //
// // //                 // Create popup windows for each record
// // //                 var  contentString =
// // //                     '<p><b>Tip</b>: ' + tip.body +
// // //                     '<br><b>Location</b>: ' + tip.location +
// // //                     '</p>';
// // //
// // //                 // Converts each of the JSON records into Google Maps Location format (Note [Lat, Lng] format).
// // //                 locations.push({
// // //                     latlon: new google.maps.LatLng(tip.location[1], tip.location[0]),
// // //                     message: new google.maps.InfoWindow({
// // //                         content: contentString,
// // //                         maxWidth: 320
// // //                     }),
// // //                     tip: tip.body
// // //             });
// // //         }
// // //         // location is now an array populated with records in Google Maps format
// // //         return locations;
// // //     };
// // //
// // // // Initializes the map
// // // var initialize = function(latitude, longitude) {
// // //
// // //     // Uses the selected lat, long as starting point
// // //     var myLatLng = {lat: selectedLat, lng: selectedLong};
// // //
// // //     // If map has not been created already...
// // //     if (!map){
// // //
// // //         // Create a new map and place in the index.html page
// // //         var map = new google.maps.Map(document.getElementById('map'), {
// // //             zoom: 3,
// // //             center: myLatLng
// // //         });
// // //     }
// // //
// // //     // Loop through each location in the array and place a marker
// // //     locations.forEach(function(n, i){
// // //         var marker = new google.maps.Marker({
// // //             position: n.latlon,
// // //             map: map,
// // //             title: "Big Map",
// // //             icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
// // //         });
// // //
// // //         // For each marker created, add a listener that checks for clicks
// // //         google.maps.event.addListener(marker, 'click', function(e){
// // //
// // //             // When clicked, open the selected marker's message
// // //             currentSelectedMarker = n;
// // //             n.message.open(map, marker);
// // //         });
// // //     });
// // //
// // //     // Set initial location as a bouncing red marker
// // //     var initialLocation = new google.maps.LatLng(latitude, longitude);
// // //     var marker = new google.maps.Marker({
// // //         position: initialLocation,
// // //         animation: google.maps.Animation.BOUNCE,
// // //         map: map,
// // //         icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
// // //     });
// // //     lastMarker = marker;
// // //
// // // };
// // //
// // // // Refresh the page upon window load. Use the initial latitude and longitude
// // // google.maps.event.addDomListener(window, 'load',
// // //     googleMapService.refresh(selectedLat, selectedLong));
// // //
// // // return googleMapService;
// // // });
// //
// //
// // // // $(function () {
// // // //
// // // //     var mapOptions = {
// // // //         zoom: 10,
// // // //         center: new google.maps.LatLng(40.771,-73.974)
// // // //     };
// // // //
// // // //     var map;
// // // //     var locationMarker;
// // // //
// // // //     var geocoder = new google.maps.Geocoder();
// // // //
// // // //     function initialize() {
// // // //         map = new google.maps.Map(document.getElementById('map'), mapOptions);
// // // //
// // // // // // var input = document.getElementById('search-field');
// // // //         var autocompleteInput = new google.maps.places.Autocomplete(document.getElementById('search-field'));
// // // //
// // // //         //Autocomplete place Changed
// // // //         google.maps.event.addListener(autocompleteInput, 'place_changed', function () {
// // // //
// // // //             autocompleteInput.bindTo('bounds', map);
// // // //
// // // var lat;
// // // var lon;
// // // var map;
// // // var infowindow;
// // //
// // // function initAutocomplete() {
// // //     map = new google.maps.Map(document.getElementById('map'), {
// // //         center: {
// // //             lat: 40.771,
// // //             lng: -73.974
// // //         },
// // //         zoom: 10,
// // //         mapTypeId: google.maps.MapTypeId.ROADMAP
// // //     });
// // //
// // //     // Create the search box and link it to UI
// // //     var input = document.getElementById('tip-field');
// // //     var searchBox = new google.maps.places.SearchBox(input);
// // //     google.maps.event.trigger(map, 'resize');
// // //     // Bias the SearchBox results towards current map's viewport.
// // //     map.addListener('bounds_changed', function () {
// // //         searchBox.setBounds(map.getBounds());
// // //     });
// // //     var markers = [];
// // //     // Retrieve place details
// // //     searchBox.addListener('places_changed', function () {
// // //         var places = searchBox.getPlaces();
// // //         console.log('places should be here' + places);
// // //         var map = new google.maps.Map(document.getElementById('map'), {
// // //             center: {
// // //                 lat: -33.8688,
// // //                 lng: 151.2195
// // //             },
// // //             zoom: 10,
// // //             mapTypeId: google.maps.MapTypeId.ROADMAP
// // //         });
// // //         infowindow = new google.maps.InfoWindow();
// // //         // Try HTML5 geolocation.
// // //         if (places.length == 0) {
// // //             alert('No places found');
// // //             if (navigator.geolocation) {
// // //                 navigator.geolocation.getCurrentPosition(function (position) {
// // //                     var pos = {
// // //                         lat: position.coords.latitude,
// // //                         lon: position.coords.longitude
// // //                     };
// // //                     lat = position.coords.latitude;
// // //                     lon = position.coords.longitude;
// // //
// // //                     infowindow.setPosition(pos);
// // //                     infowindow.setContent('Location found.');
// // //                     map.setCenter(pos);
// // //                 }, function () {
// // //                     handleLocationError(true, infowindow, map.getCenter());
// // //                 });
// // //             } else {
// // //                 // Browser doesn't support Geolocation
// // //                 handleLocationError(false, infowindow, map.getCenter());
// // //             }
// // //         }
// // //         // Clear out the old markers.
// // //         markers.forEach(function (marker) {
// // //             marker.setMap(null);
// // //         });
// // //         markers = [];
// // //         // For each place, get the icon, name and location.
// // //         var bounds = new google.maps.LatLngBounds();
// // //
// // //         places.forEach(function (place) {
// // //             var icon = {
// // //                 url: place.icon,
// // //                 size: new google.maps.Size(71, 71),
// // //                 origin: new google.maps.Point(0, 0),
// // //                 anchor: new google.maps.Point(17, 34),
// // //                 scaledSize: new google.maps.Size(25, 25)
// // //             };
// // //             // Create a marker for each place.
// // //             markers.push(new google.maps.Marker({
// // //                 map: map,
// // //                 icon: icon,
// // //                 title: place.name,
// // //                 position: place.geometry.location
// // //             }));
// // //             if (place.geometry.viewport) {
// // //                 // Only geocodes have viewport.
// // //                 bounds.union(place.geometry.viewport);
// // //             } else {
// // //                 bounds.extend(place.geometry.location);
// // //             }
// // //         });
// // //         map.fitBounds(bounds);
// // //     });
// // // }
// // //
// // // function handleLocationError(browserHasGeolocation, infoWindow, pos) {
// // //     infoWindow.setPosition(pos);
// // //     infoWindow.setContent(browserHasGeolocation ?
// // //         'Error: The Geolocation service failed.' :
// // //         'Error: Your browser doesn\'t support geolocation.');
// // // }
// // //
// // // function validatePlace(results, status) {
// // //     if (status === google.maps.places.PlacesServiceStatus.OK) {
// // //         for (var i = 0; i < results.length; i++) {
// // //             createMarker(results[i]);
// // //         }
// // //     }
// // // }
// // //
// // // function createMarker(place) {
// // //     var placeLoc = place.geometry.location;
// // //     var marker = new google.maps.Marker({
// // //         map: map,
// // //         position: place.geometry.location
// // //     });
// // //     google.maps.event.addListener(marker, 'click', function () {
// // //         infowindow.setContent(place.name);
// // //         infowindow.open(map, this);
// // //     });
// // // }
// // //
// // // function searchLocations(serviceType) {
// // //     var service = new google.maps.places.PlacesService(map);
// // //     google.maps.event.trigger(map, 'resize');
// // //     service.nearbySearch({
// // //         location: pos,
// // //         radius: 100,
// // //         types: [serviceType]
// // //     }, validatePlace);
// // // }
// // //
// //
// // // // function getTips (lat, lon) {
// // // //   return fetch(`https://glacial-coast-82060.herokuapp.com?lat=${lat}&lon=${lon}`).then(tips=>{
// // // //     return tips.json();
// // // //   })
// // // // }
// // // //
// // // // function getMarkers(lat, lon) {
// // // //   getTips(lat, lon).then(tips => {
// // // //     tips.forEach(tip => {
// // // //       let marker = new MarkerWithLabel({
// // // //         map: map,
// // // //         position: new google.maps.LatLng(tip),
// // // //         labelContent: tip.body
// // // //       })
// // // //     })
// // // //   })
// // // // }
//
// // //
// // // // // let tipMap = {};
// // // // // tipMapp.markers = [];
// // // // // let map;
// // // // // var input = document.getElementById('search-field');
// // // // // var autocomplete = new google.maps.places.Autocomplete(input, {types:['geocode']});
// // // //
// // // // // var MAPAPP = {};
// // // // // MAPAPP.markers = [];
// // // // // MAPAPP.currentInfoWindow;
// // // // // MAPAPP.pathName = window.location.pathname;
// // // // //
// // // // // $(document).ready(function() {
// // // // //     initialize();
// // // // //     populateMarkers(MAPAPP.pathName);
// // // // // });
// // // //
// // // // function initMap() {
// // // //   var center = new google.maps.LatLng(40.771,-73.974);
// // // //   var mapOptions = {
// // // //     zoom: 10,
// // // //     center
// // // //   };
// // // //   this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
// // // // };
// // // // //
// // // // // // function geolocate() {
// // // // // //   if (navigator.geolocation) {
// // // // // //     navigator.geolocation.getCurrentPosition(function(position) {
// // // // // //       var geolocation = {
// // // // // //         lat: position.coords.latitude,
// // // // // //         lng: position.coords.longitude
// // // // // //       };
// // // // // //       var circle = new google.maps.Circle({
// // // // // //         center: geolocation,
// // // // // //         radius: position.coords.accuracy
// // // // // //       });
// // // // // //       autocomplete.setBounds(circle.getBounds());
// // // // // //     });
// // // // // //   }
// // // // // // }
// // // // // //
// // //
// // // //
// // // // // function initAutocomplete() {
// // // // //   var map = new google.maps.Map(document.getElementById('map'), {
// // // // //     center: {lat: -33.8688, lng: 151.2195},
// // // // //     zoom: 13,
// // // // //     mapTypeId: 'roadmap'
// // // // //   });
// // // // //
// // // // //   // Create the search box and link it to the UI element.
// // // // //   var input = document.getElementById('pac-input');
// // // // //   var searchBox = new google.maps.places.SearchBox(input);
// // // // //   map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
// // // // //
// // // // //   // Bias the SearchBox results towards current map's viewport.
// // // // //   map.addListener('bounds_changed', function() {
// // // // //     searchBox.setBounds(map.getBounds());
// // // // //   });
// // // // //
// // // // //   var markers = [];
// // // // //   // Listen for the event fired when the user selects a prediction and retrieve
// // // // //   // more details for that place.
// // // // //   searchBox.addListener('places_changed', function() {
// // // // //     var places = searchBox.getPlaces();
// // // // //
// // // // //     if (places.length == 0) {
// // // // //       return;
// // // // //     }
// // // // //
// // // // //     // Clear out the old markers.
// // // // //     markers.forEach(function(marker) {
// // // // //       marker.setMap(null);
// // // // //     });
// // // // //     markers = [];
// // // // //
// // // // //     // For each place, get the icon, name and location.
// // // // //     var bounds = new google.maps.LatLngBounds();
// // // // //     places.forEach(function(place) {
// // // // //       if (!place.geometry) {
// // // // //         console.log("Returned place contains no geometry");
// // // // //         return;
// // // // //       }
// // // // //       var icon = {
// // // // //         url: place.icon,
// // // // //         size: new google.maps.Size(71, 71),
// // // // //         origin: new google.maps.Point(0, 0),
// // // // //         anchor: new google.maps.Point(17, 34),
// // // // //         scaledSize: new google.maps.Size(25, 25)
// // // // //       };
// // // // //
// // // // //       // Create a marker for each place.
// // // // //       markers.push(new google.maps.Marker({
// // // // //         map: map,
// // // // //         icon: icon,
// // // // //         title: place.name,
// // // // //         position: place.geometry.location
// // // // //       }));
// // // // //
// // // // //       if (place.geometry.viewport) {
// // // // //         // Only geocodes have viewport.
// // // // //         bounds.union(place.geometry.viewport);
// // // // //       } else {
// // // // //         bounds.extend(place.geometry.location);
// // // // //       }
// // // // //     });
// // // // //     map.fitBounds(bounds);
// // // // //   });
// // // // // }
// // // //
// // // // // function initialize() {
// // // // //         var goo = google.maps,
// // // // //           map = new goo.Map(document.getElementById('map_canvas'), {
// // // // //             zoom: 1,
// // // // //             center: new goo.LatLng(0, 0),
// // // // //             noClear: true
// // // // //           }),
// // // // //           input = map.getDiv().querySelector('input'),
// // // // //           ac = new goo.places.SearchBox(input),
// // // // //           service = new goo.places.PlacesService(map),
// // // // //           win = new goo.InfoWindow,
// // // // //           markers = [],
// // // // //           request;
// // // // //
// // // // //
// // // // //         map.controls[goo.ControlPosition.TOP_CENTER].push(input);
// // // // //
// // // // //         if (input.value.match(/\S/)) {
// // // // //           request = {
// // // // //             query: input.value
// // // // //           };
// // // // //           if (ac.getBounds()) {
// // // // //             request.bounds = ac.getBounds();
// // // // //           }
// // // // //           service.textSearch(request, function(places) {
// // // // //             //set the places-property of the SearchBox
// // // // //             //places_changed will be triggered automatically
// // // // //             ac.set('places', places || [])
// // // // //           });
// // // // //         }
// // // // //
// // // // //         goo.event.addListener(ac, 'places_changed', function() {
// // // // //
// // // // //           win.close();
// // // // //
// // // // //           //remove previous markers
// // // // //           while (markers.length) {
// // // // //             markers.pop().setMap(null);
// // // // //           }
// // // // //
// // // // //           //add new markers
// // // // //           (function(places) {
// // // // //             var bounds = new goo.LatLngBounds();
// // // // //             for (var p = 0; p < places.length; ++p) {
// // // // //               markers.push((function(place) {
// // // // //                 bounds.extend(place.geometry.location);
// // // // //                 var marker = new google.maps.Marker({
// // // // //                     map: map,
// // // // //                     position: place.geometry.location
// // // // //                   }),
// // // // //                   content = document.createElement('div');
// // // // //                 content.appendChild(document.createElement('strong'));
// // // // //                 content.lastChild.appendChild(document.createTextNode(place.name));
// // // // //                 content.appendChild(document.createElement('div'));
// // // // //                 content.lastChild.appendChild(document.createTextNode(place.formatted_address));
// // // // //                 goo.event.addListener(marker, 'click', function() {
// // // // //                   win.setContent(content);
// // // // //                   win.open(map, this);
// // // // //                 });
// // // // //                 return marker;
// // // // //               })(places[p]));
// // // // //             };
// // // // //             if (markers.length) {
// // // // //               if (markers.length === 1) {
// // // // //                 map.setCenter(bounds.getCenter());
// // // // //               } else {
// // // // //                 map.fitBounds(bounds);
// // // // //               }
// // // // //             }
// // // // //           })(this.getPlaces());
// // // // //         });
// // // // //       }
// // // // //       google.maps.event.addDomListener(window, 'load', initialize);
// // // //
// // // // // var autocomplete = new google.maps.places.Autocomplete(input, {types:['geocode']});
// // // // // function initMap() {
// // // // //   map = new google.maps.Map(document.getElementById('map'), {
// // // // //     center: {lat: 40.771, lng: -73.974},
// // // // //     zoom: 10
// // // // //   });
// // // // // }
// // // // //
// // // // // function getTips (lat, lon) {
// // // // //   return fetch(`https://tipical.herokuapp.com?lat=${lat}&lon=${lon}`).then(tips=>{
// // // // //     return tips.json();
// // // // //   })
// // // // // }
// // // // //
// // // // // function getMarkers(lat, lon) {
// // // // //   getTips(lat, lon).then(tips => {
// // // // //     tips.forEach(tip => {
// // // // //       let marker = new google.maps.Marker({
// // // // //         map: map,
// // // // //         position: new google.maps.LatLng()
// // // // //       })
// // // // //     })
// // // // //   })
// // // // // }
// // // // // let renderList = function(lat,lon){
// // // // //   console.log(`lat: ${lat}, lon: ${lon}`);
// // // // //   if(lat == undefined || lon == undefined){
// // // // //     $.get('https://glacial-coast-82060.herokuapp.com/').then((val)=>{
// // // // //       console.log("rendering default view");
// // // // //       populateList(val);
// // // // //
// // // // //     });
// // // // //   }else{
// // // // //     $.get(`https://glacial-coast-82060.herokuapp.com?lat=${lat}&lon=${lon}`).then((val)=>{
// // // // //       console.log("rendering Secondary view");
// // // // //       populateList(val);
// // // // //
// // // // //     });
// // // // //   }
// // // // // };
// // // // //
// // // // // renderList();
// // // // //
// // // // // let populateList = function(val){
// // // // //   let html = '';
// // // // //   val.forEach((val)=>{
// // // // //     html+=`
// // // // //       <div class="ui message grey column">
// // // // //         <div class="ui menu">
// // // // //           <p class="header item">${val.points.length}</p>
// // // // //           <p class = "header item">${val.location}</p>
// // // // //           <p class = "header item">${val.username}</p>
// // // // //           <p class="header item floated right">${val.date}</p>
// // // // //         </div>
// // // // //         <div><p>${val.body}</p></div>
// // // // //       </div>
// // // // //
// // // // //     `;
// // // // //   });
// // // // //   $('#posts').html(html);
// // // // // };
// // // //
