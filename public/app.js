var bathroomTemplate = (
  "<div class='module'>" +
    "<ul class='locations'>" +
      "<p><span class='bathroom-location-name'></span></p>" +
      "<button class='delete-location'>" +
      "<span class='button-label'>Delete</span>" +
      "</button>" +
    "</ul>" +
  "</div>"
);

var BATHROOMS_URL = '/bathrooms';

function getAndDisplayBathrooms() {
  console.log('Retrieving bathroom location');
  $.getJSON(BATHROOMS_URL, function(eachBathroom) {
    console.log('Rendering bathroom location');
    var bathroomElements = eachBathroom.bathrooms.map(function(bathroom) {
      var element = $(bathroomTemplate);
      element.attr('class', bathroom.id);
      var bathroomName = element.find('.bathroom-location-name');
      bathroomName.text(bathroom.name);
      return element;
    });
    $('.locations').html(bathroomElements);
  });
}

function addBathroomLocation(bathroom) {
  console.log('Adding bathroom location: ' + bathroom);
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
  $('.module').on('click', '.delete-location', function(e) {
    e.preventDefault();
    console.log('Pew Pew!');
    deleteBathroomLocation($(e.currentTarget).closest('.module').attr('class'));
  });
}

$(function() {
  getAndDisplayBathrooms();
  handleBathroomAdd();
  handleBathroomDelete();
});



/*
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
*/








