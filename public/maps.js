var initMap = function() {
    var options = {
      center: {
        lat: 29.9511,
        lng: -90.0715
      },
      zoom: 10
    }
    var map = new google.maps.Map(document.getElementById('map'), options);
  }
  // initMap inside for closure //
$(function() {
  var RESULTS_URL = '/bathrooms';

  function getBathroomsFromServer() {
    $.getJSON(RESULTS_URL, function(bathrooms) {
      state = bathrooms;
      console.log(state);
      for (let prop in state) {
        let bathroomsArray = state[prop]
        bathroomsArray.map(function(bathroom) {
          return bathroom.coord;
        });
      }
    });
  }
  getBathroomsFromServer();
  initMap();
});