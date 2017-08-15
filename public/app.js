var RESULTS_URL = '/bathrooms';

let stateFacet = (function() {

  let state = {};  

  //console.log('before getData', state);

  function getData(bathrooms) {
    //console.log('before assignment inside getData', state);
    state = bathrooms;
    //console.log('inside getData', state);
  }

  function seeData() {
    //console.log('inside seeData', state);
    return state;
  }

  return {
     setData: getData,
     showData: seeData
  }

}());

function initMap(state) {
  //console.log(state);
  let coords = state.bathrooms[0].coords;

  let map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(coords),
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
}


$.getJSON(RESULTS_URL, function(data) {
  //console.log(data);

  stateFacet.setData(data);
  initMap(stateFacet.showData());
  // antiquated. redo in jQuery -- with init function

  // get map to show up in browser
  /*let map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(29.9511, -90.0715),
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  for (let bathrooms in data);
  let bathroomsArray = data.bathrooms;
  //console.log(bathroomsArray);

  let locationsArray = [];

  for (let i = 0; i < bathroomsArray.length; i++) {
    locationsArray.push(bathroomsArray[i].coords);
  }
  //console.log(locationsArray);

  let infoWindow = new google.maps.InfoWindow();

  // loop thru address array, grap lat and lngcoords from address object
  for (let i = 0; i < locationsArray.length; i++) {
    //console.log(locationsArray[i]);
    let latLng = new google.maps.LatLng(locationsArray[i].lat, locationsArray[i].lng);

    // build marker object, grab name and type from data json 
    let marker = new google.maps.Marker({
      position: latLng,
      map: map,
      name: bathroomsArray[i].name,
      type: bathroomsArray[i].type
    });

    // use closure to make infowindow appear on click
    (function(marker) {
      google.maps.event.addListener(marker, 'click', function(event) {
        infoWindow.setContent(`Bathroom at ${marker.name} is ${marker.type}.`);
        infoWindow.open(map, marker);
      });
    })(marker);
  }*/
});


