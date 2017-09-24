var bathroomTemplate = (
    "<il class='new-location'>" +
      "<p><span class='bathroom-location-name'></span></p>" +
      "<button class='delete-location'>" +
      "<span class='button-label'>Delete</span>" +
      "</button>" +
    "</il>"
);

var BATHROOMS_URL = '/bathrooms';

function getAndDisplayBathrooms() {
  //console.log('Retrieving bathroom location');
  $.getJSON(BATHROOMS_URL, function(eachBathroom) {
    //console.log('Rendering bathroom location');
    var bathroomElements = eachBathroom.bathrooms.map(function(bathroom) {
      var element = $(bathroomTemplate);
      element.attr('id', bathroom.id);
      var bathroomName = element.find('.bathroom-location-name');
      bathroomName.text(bathroom.name);
      return element;
    });
    $('.locations').html(bathroomElements);
  });
}

function addBathroomLocation(bathroom) {
  //console.log('Adding bathroom location: ' + bathroom);
  $.ajax({
    method: 'POST',
    url: BATHROOMS_URL,
    data: JSON.stringify(bathroom),
    success: function(data) {
      getAndDisplayBathrooms();
    },
    dataType: 'json',
    contentType: 'application/json'
  });
}

function deleteBathroomLocation(bathroomId) {
  console.log('Deleting bathroom location `' + bathroomId + '`');
  $.ajax({
    url: BATHROOMS_URL + '/' + bathroomId,
    method: 'DELETE',
    success: getAndDisplayBathrooms
  });
}

function handleBathroomAdd() {
  $('.add-bathroom-form').submit(function(e) {
    e.preventDefault();
    addBathroomLocation({
      type: $(e.currentTarget).find('.type').val(),
      city: $(e.currentTarget).find('.city').val(),
      name: $(e.currentTarget).find('.name').val(),
      street: $(e.currentTarget).find('.street').val(),
      zipcode: $(e.currentTarget).find('.zipcode').val()
    })
  });
}

function handleBathroomDelete() {
  $('.locations').on('click', '.delete-location', function(e) {
    e.preventDefault();
    deleteBathroomLocation($(e.currentTarget).closest('.new-location').attr('id'));
  });
}

// terrible global variables //
var map;
var icon = 'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_purple.png';

function initMap() {
  $.getJSON(BATHROOMS_URL, function(eachBathroom) {
    //console.log('Retrieving bathroom data');
    var bathrooms = eachBathroom.bathrooms;
    bathrooms.forEach(function(element) {
      var coords = element.coord;
      var names = element.names;
      addMarkers(coords, names);
    });
  }); 
    var newOrleans = { lng: -90.0715, lat: 29.9511 };
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: newOrleans
  });
}

// add marker function //
function addMarkers(coords, names) {
  var marker = new google.maps.Marker({
    position: coords,
    map: map,
    icon: icon
  });

  var infoWindow = new google.maps.InfoWindow({
    content: names
  });
  marker.addListener('click', function() {
    infoWindow.open(map, marker);
  });
}

$(function() {
  getAndDisplayBathrooms();
  handleBathroomAdd();
  handleBathroomDelete();
});