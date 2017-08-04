$.getJSON('mock-data.json', function(data) {

  let map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(29.9511, -90.0715),
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  let addressArray = [];

  for (let i = 0; i < data.length; i++) {
    addressArray.push((data[i].address.coord));
  } //console.log(addressArray);

  let infoWindow = new google.maps.InfoWindow();

  for (let i = 0; i < addressArray.length; i++) {
    let latLng = new google.maps.LatLng(addressArray[i].lat, addressArray[i].lng);

    let marker = new google.maps.Marker({
      position: latLng,
      map: map,
      name: data[i].name,
      type: data[i].type
    });

    // closure
    (function(marker) {
      google.maps.event.addListener(marker, 'click', function(event) {
        infoWindow.setContent(`Bathroom at ${marker.name} is ${marker.type}.`)
        infoWindow.open(map, marker);
      });
    })(marker);
  }

});


