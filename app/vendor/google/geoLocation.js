var GeoLocation = {
getLocation: function ()
  {
  if (navigator.geolocation)
    {
    navigator.geolocation.getCurrentPosition(showPosition);
    }
  else{x.innerHTML="Geolocation is not supported by this browser.";}
  },
showPosition: function (position)
  {
    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;
  x.innerHTML="Latitude: " + lat +
  "<br>Longitude: " + lng;
  }
}
module.exports = GeoLocation;
