(function(window) {

  // some constants, all caps just for convention.
  var API_KEYS_ENDPOINT = './api/keys';

  var HOUSTON_CENTER = {
    lat: 29.7604,
    lng: -95.3698
  };

  var DEFAULTS = {
    center: HOUSTON_CENTER,
    zoom: 12
  };

  var LINKS_ELEMENTS = document.querySelectorAll('a');

  var MAP_ELEMENT = document.getElementById('map');
  var MARKERS_API_ENDPOINT = './api/markers';

  var LIST_ELEMENT = document.getElementById('list');
  var SIDEBAR_ELEMENT = document.querySelector('.halp-sidebar');
  var SIDEBAR_SCROLLER = zenscroll.createScroller(SIDEBAR_ELEMENT);

  var MARKERS = new MarkersCollection([], addMarker);

  var SPREADSHEET = 'https://spreadsheets.google.com/feeds/list/14GHRHQ_7cqVrj0B7HCTVE5EbfpNFMbSI9Gi8azQyn-k/od6/public/values?alt=json-in-script&callback=p';

  var ACTIVE_PLACE;

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

  function loadData() {
    var url = "https://spreadsheets.google.com/feeds/list/14GHRHQ_7cqVrj0B7HCTVE5EbfpNFMbSI9Gi8azQyn-k/od6/public/values?alt=json-in-script&callback=initData";

    asyncLoadScript(url);
  }

  function getResponseData(response) { return response.data; }

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

  function handleReturnedMarkers(responseData) {
    if (responseData.result && responseData.result.markers) {
      responseData.result.markers.forEach(MARKERS.add.bind(MARKERS));
    }
  }

  function makePositionFromLatLngArray(latLng) {
    return (latLng && {
      lat: latLng[0],
      lng: latLng[1]
    });
  }

  function getPositionFromMarkerResponse(marker){
    return makePositionFromLatLngArray(marker.cleanLatLng) ||
      makePositionFromLatLngArray(marker.rawLatLng);
  }

  function makeMapMarker(marker) {
    var position = _.pick(marker, ['lat', 'lng']);

    if (position) {
      var marker = new google.maps.Marker({
        position: position,
        title: marker.address
      });

      return marker;
    }
  }

  function makeGetDirectionsLink(marker){
    var baseURL = 'https://www.google.com/maps/dir//';

    return baseURL + marker.addressName + '/@' + marker.lat + ',' + marker.lng;
  }

  function makeAddressDisplay(marker) {
    var address = marker.addressName.replace(marker.name + ', ', '');
    return marker.name + '<br/>' + address;
  }

  function makeMarkerHTML(marker) {
    var transformLatLng = function(num){ return num.toFixed(4)};

    var infoHTML = [];
    if(marker.volunteerNeeds) {
      infoHTML.push('<h3>Volunteer Needs</h3>')
      infoHTML.push('<p class="halp-list--item-type">' + marker.volunteerNeeds + '</p>');
    }
    if(marker.supplyNeeds) {
      infoHTML.push('<h3>Supply Needs</h3>')
      infoHTML.push('<p class="halp-list--item-type">' + marker.supplyNeeds + '</p>');
    }
    if(marker.phone) {
      infoHTML.push('<p class="halp-list--item-type"><a href="tel:' + marker.tel + '">' + marker.phone + '</a></p>');
    }
    infoHTML.push('<p class="halp-list--item-address">@ <a href="' + makeGetDirectionsLink(marker) + '" target="_blank"><strong>' + makeAddressDisplay(marker) + '</strong></a></p>');
    infoHTML.push('<a class="button" href="' + makeGetDirectionsLink(marker) + '" target="_blank">Get Directions</a>');
    infoHTML.push('<p>Share link: </p><pre><code>' + window.location.origin + window.location.pathname + '/#!/' + marker.key + '</code></pre>')
    return infoHTML.join('');
  }

  function makeListItemElement(marker) {
    var item = document.createElement('li');
    item.innerHTML = makeMarkerHTML(marker);

    return item;
  }

  function highlightItem(selectedItemElement, selectedMarkerInfo) {
    var activeClassName = 'active';

    Array.prototype.forEach.call(LIST_ELEMENT.querySelectorAll('li'), function(itemElement){
      if(itemElement !== selectedItemElement){
        itemElement.classList.remove(activeClassName);
      }
    });

    SIDEBAR_SCROLLER.intoView(selectedItemElement, 200, function(){    
      selectedItemElement.classList.add(activeClassName);
    });
  }

  function highlightMapMarker(selectedMapMarker, selectedMarkerInfo) {
    MARKERS.outputs.forEach(function(output, index){
      var marker = MARKERS.collection[index];
      if(output.mapMarker && (output.mapMarker !== selectedMapMarker)){
        output.mapMarker.setIcon('//maps.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png');
        output.mapMarker.setZIndex(1);
      }
    });

    if (selectedMapMarker) {
      selectedMapMarker.setIcon('//maps.google.com/intl/en_us/mapfiles/ms/micons/purple-dot.png');
      selectedMapMarker.setZIndex(10);

      if(!MAP.getBounds().contains(selectedMapMarker.getPosition())){
        MAP.setZoom(DEFAULTS.zoom);
        MAP.setCenter(selectedMapMarker.getPosition());
      }
    }
  }

  function highlightMarkerByName(name) {
    var marker = _.find(MARKERS.collection, {key: name});
    var markerIndex = _.findIndex(MARKERS.collection, {key: name});
    var markerListItem = MARKERS.outputs[markerIndex].listItem;
    var mapMarker = MARKERS.outputs[markerIndex].mapMarker;

    _.delay(function(){
      highlightItem(markerListItem, marker);
      highlightMapMarker(mapMarker, marker);
    }, 100);
  }

  function addMarker(marker) {
    var mapMarker = makeMapMarker(marker);
    var markerListItem = makeListItemElement(marker);
    var highlight = function() {
      highlightItem(markerListItem, marker);
      highlightMapMarker(mapMarker, marker);
      page('/' + marker.key)
    }

    LIST_ELEMENT.appendChild(markerListItem);

    if (mapMarker) {
      mapMarker.setMap(MAP);
      mapMarker.addListener('click', highlight);
    }

    markerListItem.addEventListener('click', highlight);

    return {
      mapMarker: mapMarker,
      listItem: markerListItem,
      onSelect: highlight
    };
  }

  function initMap() {
    // Create a map object and specify the DOM element for display.
    var map = new google.maps.Map(MAP_ELEMENT, DEFAULTS);
    window.MAP = map;
    loadData();

    autodetectLocation(function(position) {
      map.setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    });

  }

  function getFromEntry(columnName, entry){
    return _.property('gsx$' + columnName + '.$t')(entry);
  }

  function initData(data){
    var entries = data.feed.entry;
    var hasNeeds = _.filter(entries, function(entry){
      return getFromEntry('supplyneeds', entry) || getFromEntry('volunteerneeds', entry);
    });

    var placesWithNeeds = _.map(hasNeeds, function(entry){
      return {
        address: getFromEntry('address', entry),
        lat: parseFloat(getFromEntry('latitude', entry)),
        lng: parseFloat(getFromEntry('longitude', entry)),
        name: getFromEntry('shelter', entry),
        phone: getFromEntry('phone', entry),
        tel: getFromEntry('phone', entry).replace(/\D+/g, ''),
        addressName: getFromEntry('addressname', entry),
        supplyNeeds: getFromEntry('supplyneeds', entry),
        volunteerNeeds: getFromEntry('volunteerneeds', entry),
        key: _.kebabCase(getFromEntry('shelter', entry))
      };
    });

    var markers = _.map(placesWithNeeds, makeMapMarker);
    _.forEach(placesWithNeeds, MARKERS.add.bind(MARKERS));
    if (ACTIVE_PLACE){
      highlightMarkerByName(ACTIVE_PLACE);
    }
  }

  function handlePlace(request){
    ACTIVE_PLACE = request.params.place;
  }

  function hello(){

  }

  function initRouting() {
    page('/', hello);
    page('/:place', handlePlace);
    page.base('/harvey-needs');
    page({hashbang: true});
  }

  window.initMap = initMap;
  window.initData = initData;
  initRouting();
  loadMap();


}(window));
