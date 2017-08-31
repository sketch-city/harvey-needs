(function(window){
  var MarkersCollection = function(markers, onAdd){
    this.collection = [];
    this.outputs = [];
    this.onAdd = function(marker){
      var output = (onAdd && onAdd(marker)) || marker;
      this.outputs.push(output);
      return output;
    };

    if (markers) {
      markers.forEach(this.add.bind(this));
    }
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