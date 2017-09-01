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
<a class="button button-primary halp-list--item-directions" href="{{ directionLink }}" target="_blank">\
  Get Directions\
</a>\
{{ sourceHTML }}\
<p class="halp-list--item-type">\
  Last updated at <i>{{ lastUpdated }}</i>\
</p>\
<p class="halp-list--item-link"><strong>Share link</strong></p>\
<pre><code>{{ window.location.origin + window.location.pathname }}/#!/{{ key }}</code></pre>\
    ');

    var volunteerNeedsTemplate = _.template('\
<h3>Volunteer Needs</h3>\
<p class="halp-list--item-type">\
  {{ volunteerNeeds }}\
</p>\
    ');

    var supplyNeedsTemplate = _.template('\
<h3>Supply Needs</h3>\
<p class="halp-list--item-type">\
  {{ supplyNeeds }}\
</p>\
    ');

    var markerLinkSourceTemplate = _.template('\
<a class="button button-clear halp-list--item-source" href="{{ source.link }}" target="_blank">\
  {{ source.text }}\
</a>\
    ');

    var markerSourceTemplate = _.template('\
<p class="halp-list--item-source">\
  <strong>Details</strong> {{ source.text }}\
</p>\
    ');

    function makeSupplyNeedsHTML(marker) {
      if (marker.supplyNeeds) {
        return supplyNeedsTemplate(marker);
      }

      return '';
    }

    function makeVolunteerNeedsHTML(marker) {
      if (marker.volunteerNeeds) {
        return volunteerNeedsTemplate(marker);
      }

      return '';
    }

    function makeSourceHTML(marker){
      if (marker.source) { 
        if (marker.source.link){
          return markerLinkSourceTemplate(marker);
        } else if (marker.source.text) {
          return markerSourceTemplate(marker);
        }
      }

      return '';
    }

    function makeMarkerHTML(marker) {
      var markerViewModel = _.extend({
        directionLink:      makeGetDirectionsLink(marker),
        shareLink:          makeShareLink(marker),
        sourceHTML:         makeSourceHTML(marker),
        volunteerNeedsHTML: makeVolunteerNeedsHTML(marker),
        supplyNeedsHTML:    makeSupplyNeedsHTML(marker)
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