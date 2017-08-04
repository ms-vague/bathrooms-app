$.getJSON('mock-data.json', function(data) {

  let map = new google.maps.Map(document.getElementById("map"), {
    center: new google.maps.LatLng(29.9511, -90.0715),
    zoom: 6,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  let addressArray = [];

  for (let i = 0; i < data.length; i++) {
    addressArray.push((data[i].address.coord));
  } //console.log(addressArray);

  for (let i = 0; i < addressArray.length; i++) {
    let latLng = new google.maps.LatLng(addressArray[i].lat, addressArray[i].lng);

    let marker = new google.maps.Marker({
      position: latLng,
      map: map,
      title: data[i].name
    });
  }
});


