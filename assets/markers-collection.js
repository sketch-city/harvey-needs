<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-105727042-2', 'auto');
  ga('send', 'pageview');

</script>




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
