'use strict';

let bathroomTemplate = ( 
    "<div class='location-container'>" +
      "<button class='delete-location'>" +
        "<span class='button-label'>x</span>" +
      "</button>" +
      "<ul class='display-info'>" +
        "<li class='list-info'>" +
          "<p><span class='bathroom-location-city'>City: </span></p>" +
          "<p><span class='bathroom-location-name'>Name: </span></p>" +
          "<p><span class='bathroom-location-type'>Type: </span></p>" +
          "<p><span class='bathroom-location-street'>Street: </span></p>" +
        "</li>" +
      "</ul>" +
    "</div>"
);

let BATHROOMS_URL = '/bathrooms';

function getAndDisplayBathrooms() {
  $.getJSON(BATHROOMS_URL, function(bathrooms) {
    let bathroomElements = bathrooms.map(function(bathroom) {
      let element = $(bathroomTemplate);
      element.attr('id', bathroom._id);
      let bathroomName = element.find('.bathroom-location-name');
      bathroomName.after(bathroom.name);
      let bathroomCity = element.find('.bathroom-location-city');
      bathroomCity.after(bathroom.city);
      let bathroomType = element.find('.bathroom-location-type');
      bathroomType.after(bathroom.type);
      let bathroomStreet = element.find('.bathroom-location-street');
      bathroomStreet.after(bathroom.address.street);
      return element;
    });
    $('.location-info').html(bathroomElements);
  });
}

function addBathroomLocation(bathroom) {
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
      state: $(e.currentTarget).find('.state').val(),
      zipcode: $(e.currentTarget).find('.zipcode').val()
    })
    window.location.replace('results.html');
  });
}

function handleBathroomDelete() {
  $('.location-info').on('click', '.button-label', function(e) {
    e.preventDefault();
    deleteBathroomLocation($(e.currentTarget).closest('.location-container').attr('id'));
  });
}

// google maps implementation //

let map;
const icon = 'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_purple.png';

function initMap() {
  $.getJSON(BATHROOMS_URL, function(bathrooms) {
    bathrooms.forEach(function(element) {
      const coords = element.coordinates;
      const names = element.name;
      const type = element.type;
      const city = element.city;
      const street = element.address.street;
      addMarkers(coords, names, type);
    });
  }); 
    const newOrleans = { lng: -90.0715, lat: 29.9511 };
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: newOrleans
  });
}

function addMarkers(coords, names, type) {
  const infoWindow = new google.maps.InfoWindow({
  content: `${names}'s bathroom is ${type}.`
  });

  const marker = new google.maps.Marker({
    position: coords,
    map: map,
    icon: icon
  });

  marker.addListener('mouseover', function() {
    infoWindow.open(map, marker)
  });
  marker.addListener('mouseout', function() {
    infoWindow.close();
  });
}

// display location info in unique container //

function displayLocationInfo(bathroomTemplate) {
  $(".location-info")
    .append(bathroomTemplate);
}

$(function() {
  getAndDisplayBathrooms();
  handleBathroomAdd();
  handleBathroomDelete();
  displayLocationInfo();
});