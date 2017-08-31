'use strict';

var RESULTS_URL = '/bathrooms';

let stateFacet = (function() {

  let state = {
      };  

  function getBathroomsFromServer() {
    $.getJSON(RESULTS_URL, function(bathrooms) {
        state = bathrooms;
    });
  } 
  getBathroomsFromServer();

  function getBathrooms(bathrooms) {
    state = bathrooms;
  }

  function seeZipcodes() {
    for (var props in state) {
      var bathroomsArray = state[props];
    }
    var zipcodes = bathroomsArray.map(function(zip) {
        return zip.zipcode; 
    });
    zipcodes.map(function(x) {
      return $('ul').append('<li>' + x + '</li>');
    });
  }

  return {
    showData: seeZipcodes,
  }

}());




