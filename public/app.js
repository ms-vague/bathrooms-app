'use strict';

var RESULTS_URL = '/bathrooms';

let stateFacet = (function() {

  let state = {

  }

  function getBathroomsFromServer() {
    $.getJSON(RESULTS_URL, function(bathrooms) {
        state = bathrooms;
    });
  } 
  getBathroomsFromServer();

  function getBathrooms(bathrooms) {
    state = bathrooms;
  }

  function addBathroomLocation() {
    var bathroomsArray = state.bathrooms;
    bathroomsArray.map(function(bathroom) {
      console.log(bathroom);
    });
  }

  return {
    showData: addBathroomLocation
  }

}());





