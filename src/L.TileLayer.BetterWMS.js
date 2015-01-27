var chartData = [];
L.TileLayer.BetterWMS = L.TileLayer.WMS.extend({

  onAdd: function (map) {
    // Triggered when the layer is added to a map.
    //   Register a click listener, then do all the upstream WMS things
    L.TileLayer.WMS.prototype.onAdd.call(this, map);
    map.on('click', this.getFeatureInfo, this);
},

onRemove: function (map) {
    // Triggered when the layer is removed from a map.
    //   Unregister a click listener, then do all the upstream WMS things
    L.TileLayer.WMS.prototype.onRemove.call(this, map);
    map.off('click', this.getFeatureInfo, this);
},

getFeatureInfo: function (evt) {
    // Make an AJAX request to the server 
    var url = this.getFeatureInfoUrl(evt.latlng),
    showResults = L.Util.bind(this.showGetFeatureInfo, this);
    $.ajax({
      url: url,
      success: function (data, status, xhr) {
        var err = typeof data === 'string' ? null : data;
        showResults(err, evt.latlng, data);
    },
    // error: function (xhr, status, error) {
    //     showResults(error);  
    // }
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
      // time: this.wmsParams.time,
      time: ["1985-1-15","1985-2-15","1985-3-15","1985-4-15","1985-5-15","1985-6-15","1985-7-15","1985-8-15","1985-9-15","1985-10-15","1985-11-15","1985-12-15"],
      styles: this.wmsParams.styles,
      transparent: this.wmsParams.transparent,
      version: this.wmsParams.version,      
      format: this.wmsParams.format,
      bbox: this._map.getBounds().toBBoxString(),
      height: size.y,
      width: size.x,
      layers: this.wmsParams.layers,
      query_layers: this.wmsParams.layers,
      info_format: 'text/xml'
  };
  
  params[params.version === '1.3.0' ? 'i' : 'x'] = point.x;
  params[params.version === '1.3.0' ? 'j' : 'y'] = point.y;
  
  return this._url + L.Util.getParamString(params, this._url, true);
},

showGetFeatureInfo: function (err, latlng, content) {
   console.log(content.getElementsByTagName('time')[0].innerHTML.substr(0,10))
    // loop though time / values and create object
    for (i = 0; i <12; i++) { 
      chartData.push({
        x:content.getElementsByTagName('time')[i].innerHTML.substr(0,10),
        y: Number(content.getElementsByTagName('value')[i].innerHTML)})
  }


// make graph here (move later)


var parseDate = d3.time.format("%Y-%m-%d").parse;

// var graph = new Rickshaw.Graph( {
//         element: document.querySelector("#chart"),
//         renderer: 'line',
//         width: 800,
//         height: 250,
//         series: [ {
//                 color: 'steelblue',
//                 data: chartData
//         } ]
// } );

// var y_ticks = new Rickshaw.Graph.Axis.Y( {
//     graph: graph,
//     orientation: 'left',
//     tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
//     element: document.getElementById('y_axis'),
// } );


// graph.render();
//

// console.log(content.getElementsByTagName('time'))
    // Otherwise show the content in a popup, or something.
  // chartData =content.getElementsByTagName('value');

    L.popup({ maxWidth: 800})
      .setLatLng(latlng)
      .setContent(content.getElementsByTagName('value')[0].innerHTML)
      .openOn(map);
}
});

L.tileLayer.betterWms = function (url, options) {
  return new L.TileLayer.BetterWMS(url, options);  
};