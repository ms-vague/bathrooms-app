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

  function showBathrooms() {
    for (let props in state) {
      var bathroomsArray = state[props]
    }
    bathroomsArray.map(function(bathroom) {
      console.log(bathroom);
    });
  }

  return {
    showData: showBathrooms
  }

}());





