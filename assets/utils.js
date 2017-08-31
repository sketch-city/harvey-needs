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

  function loadSheet(sheetInfo, callbackName) {
    var docId = sheetInfo.docId;
    var sheetId = sheetInfo.sheetId || 'od6' ;

    var url = 'https://spreadsheets.google.com/feeds/list/' + docId + '/' + sheetId + '/public/values?alt=json-in-script&callback=' + callbackName;
    asyncLoadScript(url);
  }

  function getFromEntry(columnName, entry){
    return _.property('gsx$' + columnName + '.$t')(entry);
  }

  function getDataFromSheets(data, filter, clean){
    return _.filter(data.feed.entry, filter)
      .map(clean);
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
    loadMap: loadMap,
    loadSheet: loadSheet,
    getFromEntry: getFromEntry,
    getDataFromSheets: getDataFromSheets,
    autodetectLocation: autodetectLocation
  };

  window.utils = utils;

}(window));