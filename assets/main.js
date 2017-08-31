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

  var MAP_ELEMENT = document.getElementById('map');

  var LIST_ELEMENT = document.getElementById('list');
  var SIDEBAR_ELEMENT = document.querySelector('.halp-sidebar');

  var MARKERS = new MarkersCollection([], addMarker);

  var ACTIVE_PLACE;

  function highlightMarkerByName(name) {
    _.delay(function(){
      var marker = MARKERS.findByName(name);

      if (!marker){
        return;
      }

      var markerListItem = marker.outputs.listItem;
      var mapMarker = marker.outputs.mapMarker;
      listViewHelper.highlightItem(markerListItem, marker.data);
      mapViewHelper.highlightItem(mapMarker, marker.data);
    }, 100);
  }

  function addMarker(marker) {
    var mapMarker = mapViewHelper.makeItem(marker);
    var markerListItem = listViewHelper.makeItem(marker);

    var highlight = function() {
      listViewHelper.highlightItem(markerListItem, marker);
      mapViewHelper.highlightItem(mapMarker, marker);
      page('/' + marker.key);
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
    var shelters = getSheltersHelpers();
    var needs = getNeedsHelpers();

    window.MAP = map;

    window.listViewHelper = getListViewHelper(SIDEBAR_ELEMENT, MARKERS);
    window.mapViewHelper = getMapViewHelper(MAP, MARKERS, DEFAULTS);

    window.initShelters = _.partial(initData, _, shelters.filter, shelters.cleanData);
    window.initNeeds = _.partial(initData, _, needs.filter, needs.cleanData);

    utils.loadSheet(shelters, 'initShelters');
    utils.loadSheet(needs, 'initNeeds');

    utils.autodetectLocation(function(position) {
      map.setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    });
  }

  function initData(sheetsResponse, filter, clean) {
    var locations = utils.getDataFromSheets(sheetsResponse, filter, clean);
    _.forEach(locations, MARKERS.add.bind(MARKERS));
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
    if ( window.location.pathname !== '/') {
      page.base('/harvey-needs');
    }
    page({hashbang: true});
  }

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-105623670-1', 'auto');
  ga('send', 'pageview');

  window.initMap = initMap;
  initRouting();
  utils.loadMap();


}(window));
