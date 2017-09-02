(function(window){

  function getListViewHelper(parentElement, markers){
    var sidebarScroller = zenscroll.createScroller(parentElement);
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

    function makeGetDirectionsLink(marker){
      var baseURL = '//www.google.com/maps/dir//';
      return baseURL + marker.name + marker.address + '/@' + marker.lat + ',' + marker.lng;
    }

    function makeShareLink(marker){
      return window.location.origin + window.location.pathname + '/#!/' + marker.key;
    }

    var markerListTemplate = _.template('\
{{ volunteerNeedsHTML }}\
{{ supplyNeedsHTML }}\
<p class="halp-list--item-type">\
  <a href="tel:{{ tel }}">\
    {{ phone }}\
  </a>\
</p>\
<p class="halp-list--item-address">\
  @ <a href="{{ directionLink }}" target="_blank">\
    <strong>\
      {{ name }}<br/>\
      {{ address }}\
    </strong>\
  </a>\
</p>\
{{ detailsHTML }}\
<a class="button button-primary halp-list--item-directions" href="{{ directionLink }}" target="_blank">\
  Get Directions\
</a>\
{{ sourceHTML }}\
<p class="halp-list--item-type">\
  Last updated at <i>{{ lastUpdated }}</i>\
</p>\
<p class="halp-list--item-link"><strong>Share link</strong></p>\
<input onClick="this.setSelectionRange(0, this.value.length)" value="{{ window.location.origin + window.location.pathname }}/#!/{{ key }}" readonly="readonly"></input>\
    ');

    var volunteerNeedsTemplate = _.template('\
<h3>Volunteer Needs</h3>\
<p class="halp-list--item-type">\
  {{ anchorme(volunteerNeeds) }}\
</p>\
    ');

    var supplyNeedsTemplate = _.template('\
<h3>Supply Needs</h3>\
<p class="halp-list--item-type">\
  {{ anchorme(supplyNeeds) }}\
</p>\
    ');

    var markerLinkSourceTemplate = _.template('\
<a class="button button-clear halp-list--item-source" href="{{ source.link }}" target="_blank">\
  {{ source.text }}\
</a>\
    ');

    var detailsTemplate = _.template('\
<p class="halp-list--item-source">\
  <strong>Details</strong> {{ details }}\
</p>\
    ');

    function makeIf(marker, property, render) {
      if (marker[property]) {
        return render(marker);
      }

      return '';
    }

    var makeSupplyNeedsHTML = _.partial(makeIf, _, 'supplyNeeds', supplyNeedsTemplate);
    var makeVolunteerNeedsHTML = _.partial(makeIf, _, 'volunteerNeeds', volunteerNeedsTemplate);
    var makeSourceHTML = _.partial(makeIf, _, 'source', markerLinkSourceTemplate);
    var makeDetailsHTML = _.partial(makeIf, _, 'details', detailsTemplate);

    function makeMarkerHTML(marker) {
      var markerViewModel = _.extend({
        directionLink:      makeGetDirectionsLink(marker),
        shareLink:          makeShareLink(marker),
        sourceHTML:         makeSourceHTML(marker),
        volunteerNeedsHTML: makeVolunteerNeedsHTML(marker),
        supplyNeedsHTML:    makeSupplyNeedsHTML(marker),
        detailsHTML:        makeDetailsHTML(marker),
      }, marker);
      return markerListTemplate(markerViewModel);
    }

    function makeListItemElement(marker) {
      var item = document.createElement('li');
      item.innerHTML = makeMarkerHTML(marker);

      return item;
    }

    function highlightItem(selectedItemElement, selectedMarkerInfo) {
      var activeClassName = 'active';

      Array.prototype.forEach.call(selectedItemElement.parentNode.children, function(itemElement) {
        if(itemElement !== selectedItemElement){
          itemElement.className = '';
        }
      });

      if(selectedItemElement.className !== 'active') {
        sidebarScroller.intoView(selectedItemElement, 200, function() {    
          selectedItemElement.className = 'active';
          if(!inView.is(SIDEBAR_TOP)) {
            SEARCH_WRAPPER_ELEMENT.className = 'halp-list--search fixed';
          }
        });
      }

    }

    return {
      makeItem: makeListItemElement,
      highlightItem: highlightItem
    };
  }

  function getMapViewHelper(map, markers, defaults){
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

    function highlightMapMarker(selectedMapMarker, selectedMarkerInfo) {
      markers.outputs.forEach(function(output, index){
        var marker = markers.collection[index];
        if(output.mapMarker && (output.mapMarker !== selectedMapMarker)){
          output.mapMarker.setIcon('//maps.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png');
          output.mapMarker.setZIndex(1);
        }
      });

      if (selectedMapMarker) {
        selectedMapMarker.setIcon('//maps.google.com/intl/en_us/mapfiles/ms/micons/purple-dot.png');
        selectedMapMarker.setZIndex(10);

        if(!map.getBounds().contains(selectedMapMarker.getPosition())){
          map.setZoom(defaults.zoom);
          map.setCenter(selectedMapMarker.getPosition());
        }
      }
    }

    return {
      makeItem: makeMapMarker,
      highlightItem: highlightMapMarker
    };
  }

  window.getListViewHelper = getListViewHelper;
  window.getMapViewHelper = getMapViewHelper;

}(window));