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
let USERS_URL = '/users';

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

// add users to database //

function registerUser(user) {
    $.ajax({
    method: "POST",
    url: USERS_URL,
    data: JSON.stringify(user),
    success: function(user) {
      console.log(user.username + " has been added to users database.")
    },
    error: function() {
      console.log("Didn't work.")
    },
    dataType: "json",
    contentType: "application/json"
  });
}

function registerUserToDatabase() {
  $(".register-form").submit(function(e) {
      e.preventDefault();
      registerUser({
        username: $(e.currentTarget).find(".username").val(),
        password: $(e.currentTarget).find(".user-password").val(),
        firstname: $(e.currentTarget).find(".user-first-name").val(),
        lastname: $(e.currentTarget).find(".user-last-name").val()
    });
  });
}

// user login //

function getBearerToken(user) { 
  $.ajax({
    method: "POST",
    url: "/auth/login",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(user),
    success: function(userData) {
      localStorage.setItem("authToken", userData.authToken);
      let token = localStorage.getItem("authToken");
      //window.location.replace("results.html");
    },
    error: function(data) {
      $(".unauth").css({"background-color": "#FF0000",
        "width": "400px",
        "height": "30px",
        "height": "50px",
        "padding": "6px",
        "border-radius": "2px"})
      .text(data.statusText + ": Password or Username is incorrect");
    },
      complete: function(data) {
      $.ajax({
        method: "POST",
        url: "/auth/login",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(user),
        success: function() {
          console.log("Ok");
                $.ajax({
                  method: "GET",
                  url: "/bathrooms",
                  contentType: "application/json",
                  dataType: "json",
                  data: JSON.stringify(user),
                  beforeSend: function(xhr) {
                    let authToken = data.responseJSON.authToken;
                    if (localStorage.authToken) {
                      xhr.setRequestHeader("Authorization", "Bearer " + localStorage.authToken);
                    }
                  },
                  success: function(data) {
                    console.log(data);
                  }
                });
        }
      }); 
    }
  }); 
  $.ajax({
    method: "GET",
    url: "/login",
    contentType: "application/json",
    dataType: "json",
    data: JSON.stringify(user),
    beforeSend: function(xhr) {
      if (localStorage.authToken) {
        xhr.setRequestHeader("Authorization", "Bearer " + localStorage.authToken);
      }
    }
  });
}

function userLogin() {
  $(".login-form").submit(function(e) {
    e.preventDefault();
    getBearerToken({
      username: $(e.currentTarget).find(".username").val(),
      password: $(e.currentTarget).find(".user-password").val()
    });
  });
}

$(function() {
  getAndDisplayBathrooms();
  handleBathroomAdd();
  handleBathroomDelete();
  displayLocationInfo();
  registerUserToDatabase();
  userLogin();
});