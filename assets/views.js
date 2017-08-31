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
<h3>Volunteer Needs</h3>\
<p class="halp-list--item-type">\
  {{ volunteerNeeds }}\
</p>\
<h3>Supply Needs</h3>\
<p class="halp-list--item-type">\
  {{ supplyNeeds }}\
</p>\
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
<a class="button" href="{{ directionLink }}" target="_blank">\
  Get Directions\
</a>\
<p class="halp-list--item-type">\
  Last updated at <strong>{{ lastUpdated }}</strong>\
</p>\
<p>Share link: </p>\
<pre><code>{{ window.location.origin + window.location.pathname }}/#!/{{ key }}</code></pre>\
    ');

    function makeMarkerHTML(marker) {
      var markerViewModel = _.extend({
        directionLink:  makeGetDirectionsLink(marker),
        shareLink:      makeShareLink(marker)
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