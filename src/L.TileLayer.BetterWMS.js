(function() {

L.TileLayer.BetterWMS = L.TileLayer.WMS.extend({
  
  options: {    
    formatPopup: null,
  },

  initialize: function(url, options) {
    
    L.TileLayer.WMS.prototype.initialize.call(this, url, options);
    L.Util.setOptions(this, options || {});

    this._formatPopup = this.options.formatPopup || this._defaultFormatPopup;
  },

  _defaultFormatPopup: function(data) {
    return JSON.stringify(data);
  },

  onAdd: function (map) {

    var self = this;
    // Triggered when the layer is added to a map.
    //   Register a click listener, then do all the upstream WMS things
    L.TileLayer.WMS.prototype.onAdd.call(this, map);

    this._geoLayer = L.geoJson(null, {
      fill: false,
      weight: 3,
      opacity: 1,
      color: '#f0c'
    })
    .addTo(map);

    map.on('click', this.getFeatureInfo, this)
       .on('popupclose', function() {
        self._geoLayer.clearLayers();
       });
  },
  
  onRemove: function (map) {
    // Triggered when the layer is removed from a map.
    //   Unregister a click listener, then do all the upstream WMS things
    L.TileLayer.WMS.prototype.onRemove.call(this, map);
    map.off('click', this.getFeatureInfo, this);
  },
  
  getFeatureInfo: function (evt) {
    // Make an AJAX request to the server and hope for the best
    var url = this.getFeatureInfoUrl(evt.latlng),
        showResults = L.Util.bind(this.showGetFeatureInfo, this);
    
    $.ajax({
      url: url,
      dataType: 'jsonp',
      jsonpCallback: 'getJson',
      success: function (data, status, xhr) {
        var err = typeof data === 'object' ? null : data;
        showResults(err, evt.latlng, data);
      },
      error: function (xhr, status, error) {
        showResults(error);  
      }
    });

  },
  
  getFeatureInfoUrl: function (latlng) {
    // Construct a GetFeatureInfo request URL given a point
    var point = this._map.latLngToContainerPoint(latlng, this._map.getZoom()),
        size = this._map.getSize(),
        
        params = {
          request: 'GetFeatureInfo',
          service: 'WMS',
          srs: 'EPSG:4326',
          styles: this.wmsParams.styles,
          transparent: this.wmsParams.transparent,
          version: this.wmsParams.version,      
          format: this.wmsParams.format,
          bbox: this._map.getBounds().toBBoxString(),
          height: size.y,
          width: size.x,
          layers: this.wmsParams.layers,
          query_layers: this.wmsParams.layers,
          format_options: 'callback: getJson',
          info_format: 'text/javascript'
        };
    
    params[params.version === '1.3.0' ? 'i' : 'x'] = point.x;
    params[params.version === '1.3.0' ? 'j' : 'y'] = point.y;
    
    return this._url + L.Util.getParamString(params, this._url, true);
  },
  
  showGetFeatureInfo: function (err, latlng, data) {
    
    if(_.isObject(data) && data.features && data.features.length) {

      var content = this._formatPopup( data.features[0].properties );

      this._geoLayer.clearLayers();
      this._geoLayer.addData(data);

      L.popup({maxWidth: 800 })
        .setLatLng(latlng)
        .setContent(content)
        .openOn(this._map);
    }
  }
});

L.tileLayer.betterWms = function (url, options) {
  return new L.TileLayer.BetterWMS(url, options);  
};

}).call(this);