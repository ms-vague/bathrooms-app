'use strict';

$(function() {

  var RESULTS_URL = '/bathrooms';
  var $type = $('.type');
  var $city = $('.city');
  var $name = $('.name');
  var $street = $('.street');
  var $zipcode = $('.zipcode');

  $.ajax({
    type: 'GET',
    url: RESULTS_URL,
    success: function(bathrooms) {
      $.each(bathrooms, function(i, bathroom) {
        //console.log(bathroom);
        bathroom.map(function(eachLocation) {
          //console.log(eachLocation);
          // below to see if it's working //
          $('.bathrooms').append(`<li> ${eachLocation.name}` + ` ` + `${eachLocation.zipcode} </li>`);
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
    //console.log(JSON.stringify(bathroom));
    $.ajax({
      type: 'POST',
      url: RESULTS_URL,
      data: JSON.stringify(bathroom),
      contentType: "application/json; charset=utf-8",
      success: function(newBathroom) {
        console.log('Success');
      },
      error: function() {
        alert('Error saving bathroom');
      }
    })
  });

});





