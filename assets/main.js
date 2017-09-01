(function(window) {

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

  var ACTIVE_PLACE;

  function initApp(map) {
    var markers = new MarkersCollection([], addMarker, function(activeMarker){
      activeMarker.outputs.onSelect();
    });

    var listViewHelper = getListViewHelper(SIDEBAR_ELEMENT, markers);
    var mapViewHelper = getMapViewHelper(map, markers, DEFAULTS);

    function addMarker(marker) {
      var mapMarker = mapViewHelper.makeItem(marker);
      var markerListItem = listViewHelper.makeItem(marker);

      function highlight() {
        listViewHelper.highlightItem(markerListItem, marker);
        mapViewHelper.highlightItem(mapMarker, marker);
        page('/' + marker.key);
      };

      var setActive = function() {
        markers.active = marker.key;
      };

      LIST_ELEMENT.appendChild(markerListItem);

      if (mapMarker) {
        mapMarker.setMap(map);
        mapMarker.addListener('click', setActive);
      }

      markerListItem.addEventListener('click', setActive);

      return {
        mapMarker: mapMarker,
        listItem: markerListItem,
        onSelect: highlight
      };
    }

    return markers;
  }

  function initMap() {
    // Create a map object and specify the DOM element for display.
    var map = new google.maps.Map(MAP_ELEMENT, DEFAULTS);
    var shelters = getSheltersHelpers();
    var needs = getNeedsHelpers();

    var markersCollection = initApp(map);
    window.markersCollection = markersCollection;

    axios.all([utils.loadData(shelters), utils.loadData(needs)])
      .then(axios.spread(function(sheltersResponse, needsResponse){
        var sheltersList = utils.getData(sheltersResponse.data.shelters, shelters.filter, shelters.cleanData);
        var needsList = utils.getData(needsResponse.data.needs, needs.filter, needs.cleanData);
        var marker;

        _.concat(sheltersList, needsList)
          .forEach(markersCollection.add.bind(markersCollection));

        if (ACTIVE_PLACE){
          markersCollection.active = ACTIVE_PLACE;
        }
      }));

    utils.autodetectLocation(function(position) {
      map.setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    });
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

  initRouting();
  window.initMap = initMap;
  utils.loadMap();


}(window));
