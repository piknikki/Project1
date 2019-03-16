
// function initMap() {
        
//         var location = new google.maps.LatLng(50.0875726, 14.4189987); // declare location in map

//         var mapCanvas = document.getElementById('map'); // where to place the map in the view
//         var mapOptions = { // basic options for the map
//             center: location,
//             zoom: 16,
//             panControl: false,
//             mapTypeId: google.maps.MapTypeId.ROADMAP
//         }

//         // create greyscale styles
//         var styles = [
//             {"featureType": "landscape", "stylers": [{"saturation": -100}, {"lightness": 65}, {"visibility": "on"}]},
//             {"featureType": "poi", "stylers": [{"saturation": -100}, {"lightness": 51}, {"visibility": "simplified"}]},
//             {"featureType": "road.highway", "stylers": [{"saturation": -100}, {"visibility": "simplified"}]},
//             {"featureType": "road.arterial", "stylers": [{"saturation": -100}, {"lightness": 30}, {"visibility": "on"}]},
//             {"featureType": "road.local", "stylers": [{"saturation": -100}, {"lightness": 40}, {"visibility": "on"}]},
//             {"featureType": "transit", "stylers": [{"saturation": -100}, {"visibility": "simplified"}]},
//             {"featureType": "administrative.province", "stylers": [{"visibility": "off"}]},
//             {"featureType": "water", "elementType": "labels", "stylers": [{"visibility": "on"}, {"lightness": -25}, {"saturation": -100}]},
//             {"featureType": "water", "elementType": "geometry", "stylers": [{"hue": "#ffff00"}, {"lightness": -25}, {"saturation": -97}]}
//             ];

//          var map = new google.maps.Map(mapCanvas, mapOptions); // create a new object and pass configurations from above
//          map.set('styles', styles); // set the greyscale
      
//     google.maps.esvent.addDomListener(window, 'load', initMap); // render on page


