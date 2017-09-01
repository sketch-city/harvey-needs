(function(window){

  function buildGoogleMapsScriptsUrl(options) {
    return 'https://maps.googleapis.com/maps/api/js?key=' + options.key + '&libraries=places&callback=' + options.callbackName;
  }

  function asyncLoadScript(src) {
    var scriptEl = document.createElement('script');
    scriptEl.src = src;
    scriptEl.async = 'async';
    scriptEl.defer = 'defer';
    document.body.appendChild(scriptEl);
  }

  function loadMap() {
    var mapOptions = {
      key: 'AIzaSyDM0QbbXx1iFol1yxSh0UMO0rPMj4ZXlGo',
      callbackName: 'initMap'
    };

    asyncLoadScript(buildGoogleMapsScriptsUrl(mapOptions));
  }

  function loadData(options) {
    return axios.get('//api.harveyneeds.org/api/v1/' + options.endpoint);
  }

  function getData(data, filter, clean){
    return _.chain(data)
      .filter(filter)
      .map(clean)
      .value();
  }

  function isLink(text){
    var expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/gi;
    var regex = new RegExp(expression);
    return regex.test(text);
  }

  function autodetectLocation(handleSuccess, handleError) {
    if (!navigator.geolocation) {
      return;
    }

    function success(position) {
      var latitude  = position.coords.latitude;
      var longitude = position.coords.longitude;
      console.info(position);
    }

    function error() {
      console.info('Could not get position.');
    }

    navigator.geolocation.getCurrentPosition((handleSuccess || success), (handleError || error));

  }


  var utils = {
    isLink: isLink,
    loadMap: loadMap,
    loadData: loadData,
    getData: getData,
    autodetectLocation: autodetectLocation
  };

  window.utils = utils;

}(window));