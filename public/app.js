'use strict';
$(function() {
  var RESULTS_URL = '/bathrooms';
  var $location = $('.locations');
  var $type = $('.type');
  var $city = $('.city');
  var $name = $('.name');
  var $street = $('.street');
  var $zipcode = $('.zipcode');

  function addBathroom(bathroom) {
    $location.append(`<li> ${bathroom.name}` + ` ` + `${bathroom.zipcode} </li>`);
  }
  $.ajax({
    type: 'GET',
    url: RESULTS_URL,
    success: function(bathrooms) {
      $.each(bathrooms, function(i, bathroom) {
        //console.log(bathroom);
        bathroom.map(function(eachLocation) {
          //console.log(eachLocation);
          addBathroom(eachLocation);
        });
      });
    },
    error: function() {
      console.log('Error loading bathrooms');
    }
  });
  $('.add-bathroom').on('click', function(e) {
    e.preventDefault();
    var bathroom = {
      type: $type.val(),
      city: $city.val(),
      name: $name.val(),
      street: $street.val(),
      zipcode: $zipcode.val()
    };
    $.ajax({
      type: 'POST',
      url: RESULTS_URL,
      data: JSON.stringify(bathroom),
      contentType: 'application/json; charset=utf-8',
      success: function(newBathroom) {
        console.log('Success');
        addBathroom(newBathroom);
      },
      error: function() {
        console.log('Error saving bathroom');
      }
    });
  });
});

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









