let bathroomTemplate = (
    "<li class='new-location'>" +
      "<p><span class='bathroom-location-name'></span></p>" +
      "<button class='delete-location'>" +
      "<span class='button-label'>Delete</span>" +
      "</button>" +
    "</li>"
);

let BATHROOMS_URL = '/bathrooms';

function getAndDisplayBathrooms() {
  $.getJSON(BATHROOMS_URL, function(bathrooms) {
    let bathroomElements = bathrooms.map(function(bathroom) {
      let element = $(bathroomTemplate);
      element.attr('id', bathroom._id);
      let bathroomName = element.find('.bathroom-location-name');
      bathroomName.text(bathroom.name);
      return element;
    });
    $('.each-location').html(bathroomElements);
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
  //console.log('Deleting bathroom location `' + bathroomId + '`');
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
    window.location.href = 'results.html';
  });
}

function handleBathroomDelete() {
  $('.each-location').on('click', '.delete-location', function(e) {
    e.preventDefault();
    deleteBathroomLocation($(e.currentTarget).closest('.new-location').attr('id'));
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
      displayLocationInfo(city, names, type, street);
    });
  }); 
    const newOrleans = { lng: -90.0715, lat: 29.9511 };
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: newOrleans
  });
}

function addMarkers(coords, names, type) {
  console.log('94', coords)
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

let displayTemplate = ( 
    "<li class='list-info'>" +
      "<p><span class='bathroom-location-city'>City: </span></p>" +
      "<p><span class='bathroom-location-name'>Name: </span></p>" +
      "<p><span class='bathroom-location-type'>Type: </span></p>" +
      "<p><span class='bathroom-location-street'>Street: </span></p>" +
    "</li>"
);

// function below is a work in progress //

function displayLocationInfo(city, name, type, street) {
  $(".display-info")
    .append(displayTemplate)
    .find(".bathroom-location-city")
    .after(city)
}

function enlargeDisplayBox() {
  $(".display-info").on("mouseenter", ".list-info", function(e) {
    $(e.currentTarget).closest(".list-info").animate({
      width: "350px",
      height: "300px",
      borderWidth: "8px"
    }, 1000);
  });
  $(".display-info").on("mouseleave", ".list-info", function(e) {
    $(e.currentTarget).closest(".list-info").animate({
      width: "250px",
      height: "200px",
      borderWidth: "2px"
    }, "slow");
  });
}

$(function() {
  getAndDisplayBathrooms();
  handleBathroomAdd();
  handleBathroomDelete();
  enlargeDisplayBox();
});