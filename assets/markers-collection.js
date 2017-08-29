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

  window.MarkersCollection = MarkersCollection;

})(window);