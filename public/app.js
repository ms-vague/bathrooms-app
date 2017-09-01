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

  function appendZipcodes() {
    for (let props in state) {
      var bathroomsArray = state[props];
    }
    let zipcodes = bathroomsArray.map(function(zip) {
        return zip.zipcode; 
    });
    zipcodes.map(function(zip) {
      return $('ul').append('<li>' + zip + '</li>');
    });
  }

  return {
    showData: appendZipcodes
  }

}());




