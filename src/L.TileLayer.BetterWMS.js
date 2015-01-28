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
    chartData = [];
d3.select("#theChart")
       .remove();

    // loop though time / values and create object
    for (i = 0; i <12; i++) { 
      chartData.push({
        x:content.getElementsByTagName('time')[i].innerHTML.substr(0,10),
        y: Number(content.getElementsByTagName('value')[i].innerHTML)})
  }


// make graph here (move later)

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 650 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y-%m-%d").parse;

chartData.forEach(function(d) {
    d.x = parseDate(d.x);
});

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.time.format("%b"));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.x); })
    .y(function(d) {
        return y(d.y); });

var svg = d3.select("#chart").append("svg")
    .attr("id","theChart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


x.domain(d3.extent(chartData, function(d) {return d.x;}));
y.domain(d3.extent(chartData, function(d) {return d.y;}));

svg.append("g") //x axis group
    .attr("class", "x axisC")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axisC")
    .call(yAxis)
  .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Temperature \xB0 C");

svg.append("path")
    .datum(chartData)
    .attr("class", "line")
    .attr("d", line);

svg.selectAll("circle")
    .data(chartData)
    .enter()
    .append("circle")
    .attr("r", 3.5)
    .attr("cx", function(d) { return x(d.x); })
    .attr("cy", function(d) { return y(d.y); });


console.log(this.wmsParams.month)
    // Otherwise show the content in a popup, or something.
  // chartData =content.getElementsByTagName('value');

  L.popup({ maxWidth: 800})
  .setLatLng(latlng)
  .setContent(content.getElementsByTagName('value')[this.wmsParams.month].innerHTML)
  .openOn(map);
}
});

L.tileLayer.betterWms = function (url, options) {
  return new L.TileLayer.BetterWMS(url, options);  
};