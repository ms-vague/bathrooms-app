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

  function seeData() {
    return state;
  }

  return {
    showData: seeData
  }

}());
