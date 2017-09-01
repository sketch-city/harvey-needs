(function(window){
  var MarkersCollection = function(markers, onAdd, setActive){
    var activeName = '';

    this.collection = [];
    this.outputs = [];

    this.onAdd = function(marker){
      var output = (onAdd && onAdd(marker)) || marker;
      this.outputs.push(output);
      return output;
    };

    Object.defineProperty(this, 'active', {
      set: function(active){
        var activeMarker = this.findByName(active);
        activeName = active;
        setActive(activeMarker);
      },
      get: function() {
        return activeName;
      }
    });

    if (markers) {
      markers.forEach(this.add.bind(this));
    }

    return this;
  };

  MarkersCollection.prototype.add = function(marker){
    this.collection.push(marker);
    return this.onAdd(marker);
  }

  MarkersCollection.prototype.findByName = function(name) {
    var marker = _.find(this.collection, {key: name});
    var markerIndex;

    if (marker) {
      markerIndex = _.findIndex(this.collection, {key: name});
    } else {
      marker = _.find(this.collection, {previousKey: name});
      markerIndex = _.findIndex(this.collection, {previousKey: name});
    }

    if (!marker) {
      return;
    }

    return {
      data: marker,
      outputs: this.outputs[markerIndex]
    };
  }

  window.MarkersCollection = MarkersCollection;

})(window);