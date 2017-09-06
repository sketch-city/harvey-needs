(function(window) {

  var LIST_ELEMENT = document.getElementById('list');
  var SIDEBAR_ELEMENT = document.querySelector('.halp-sidebar');

  window.SEARCH_WRAPPER_ELEMENT = document.querySelector('.halp-list--search');
  window.SIDEBAR_TOP = document.querySelector('.halp-form');

  var ACTIVE_PLACE;

  var CONFIG = getConfig();
  var DEFAULTS = CONFIG.mapDefaults;

  function initApp(map, listElement, sidebarElement) {

    var markers = new MarkersCollection([], addMarker, function(activeMarker){
      activeMarker.outputs.onSelect();
    });

    var aboutViewHelper = getAboutViewHelper(sidebarElement);
    var listViewHelper = getListViewHelper(sidebarElement, markers);
    var mapViewHelper = getMapViewHelper(map, markers, DEFAULTS);

    aboutViewHelper.initialize();

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

      listElement.appendChild(markerListItem);

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
    var map = new google.maps.Map(document.getElementById('map'), DEFAULTS);
    var shelters = getSheltersHelpers();
    var needs = getNeedsHelpers();

    var markersCollection = initApp(map, LIST_ELEMENT, SIDEBAR_ELEMENT);

    axios.all([utils.loadData(shelters), utils.loadData(needs)])
      .then(axios.spread(function(sheltersResponse, needsResponse){
        var sheltersList = utils.getData(sheltersResponse.data.shelters, shelters.filter, shelters.cleanData);
        var needsList = utils.getData(needsResponse.data.needs, needs.filter, needs.cleanData);
        var marker;

        _.concat(sheltersList, needsList)
          .forEach(markersCollection.add.bind(markersCollection));

        return markersCollection;
      }))
      .then(initRouting)
      .then(initSearch);

    utils.autodetectLocation(function(position) {
      map.setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    });
  }

  function initRouting(markersCollection) {
    function handlePlace(request){
      if (
        request.params.place &&
        markersCollection.active !== request.params.place
      ) {
        markersCollection.active = request.params.place;
      }
    }

    function index() {}

    page('/', index);
    page('/:place', handlePlace);
    if ( window.location.pathname !== '/') {
      page.base(_.trimEnd(window.location.pathname, '/'));
    }
    page({hashbang: true});
  }

  function initSearch(){
    var jets = new Jets({
      searchTag: '#search',
      contentTag: '#list'
    });
    var inViewHalpTop = inView('.halp-form');

    SIDEBAR_ELEMENT.addEventListener('scroll', _.throttle(function(){
      inViewHalpTop.check();
    }, 100));

    inViewHalpTop.on('enter', function(){
      SEARCH_WRAPPER_ELEMENT.className = 'halp-list--search';
    });

    inViewHalpTop.on('exit', function(){
      SEARCH_WRAPPER_ELEMENT.className = 'halp-list--search fixed';
    });

  }

  utils.loadAnalytics();

  window.initMap = initMap;
  utils.loadMap();


}(window));
