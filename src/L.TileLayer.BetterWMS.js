// modified from https://gist.github.com/rclark/6908938
L.TileLayer.BetterWMS = L.TileLayer.WMS.extend({

    onAdd: function(map) {
        // Triggered when the layer is added to a map.
        //   Register a click listener, then do all the upstream WMS things
        L.TileLayer.WMS.prototype.onAdd.call(this, map);
        map.on('click', this.getFeatureInfo, this);
    },

    onRemove: function(map) {
        // Triggered when the layer is removed from a map.
        //   Unregister a click listener, then do all the upstream WMS things
        L.TileLayer.WMS.prototype.onRemove.call(this, map);
        map.off('click', this.getFeatureInfo, this);
    },

    getFeatureInfo: function(evt) {

        // Make an AJAX request to the server 
        var url = this.getFeatureInfoUrl(evt.latlng),
            showResults = L.Util.bind(this.showGetFeatureInfo, this);
        $.ajax({
            url: url,
            type: 'GET',
            crossDomain: true, // enable this
            success: function(data, status, xhr) {
                var err = typeof data === 'string' ? null : data;
                showResults(err, evt.latlng, data);
            },
            error: function(xhr, status, error) {
                showResults(error);
            }
        });
    },

    getFeatureInfoUrl: function(latlng) {
        var point = [];
        // Construct a GetFeatureInfo request URL given a point
        point = this._map.latLngToContainerPoint(latlng, this._map.getZoom()),
            size = this._map.getSize(),
            params = {
                request: 'GetFeatureInfo',
                service: 'WMS',
                srs: 'EPSG:4326',
                // time: this.wmsParams.time,
                time: ["1985-1-15", "1985-2-15", "1985-3-15", "1985-4-15", "1985-5-15", "1985-6-15", "1985-7-15", "1985-8-15", "1985-9-15", "1985-10-15", "1985-11-15", "1985-12-15"],
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

        // values weren't showing for a lot of locations clicked on. Implemented from http://gis.stackexchange.com/questions/109414/leaflet-wms-getfeatureinfo-gives-result-only-on-zoom-level-10/132336#132336
        var bds = map.getBounds();
        var sz = map.getSize();
        var w = bds.getNorthEast().lng - bds.getSouthWest().lng;
        var h = bds.getNorthEast().lat - bds.getSouthWest().lat;
        var X2 = (((latlng.lng - bds.getSouthWest().lng) / w) * sz.x).toFixed(0);
        var Y2 = (((bds.getNorthEast().lat - latlng.lat) / h) * sz.y).toFixed(0);

        params[params.version === '1.3.0' ? 'i' : 'x'] = X2;
        params[params.version === '1.3.0' ? 'j' : 'y'] = Y2;

        return this._url + L.Util.getParamString(params, this._url, true);
    },

    showGetFeatureInfo: function(err, latlng, content) {

        if ((content.getElementsByTagName('value')[0].innerHTML) != 'none') {
            // make chart text visible but only add once
            while (counter < 1) {

                svg.append("g")
                    .attr("class", "y axisC")
                    .call(yAxis);

                counter++;

            }

            chartData = [];
            // debugger;
            // loop though time / values and create object
            for (i = 0; i < 12; i++) {
                chartData.push({
                    x: content.getElementsByTagName('time')[i].childNodes[0].nodeValue.substr(0,10),
                    y: Number(content.getElementsByTagName('value')[i].childNodes[0].nodeValue)

                })
            }

            // populate graph
            var parseDate = d3.time.format("%Y-%m-%d").parse,
                bisectDate = d3.bisector(function(d) {
                    return d.x;
                }).left;

            chartData.forEach(function(d) {
                d.x = parseDate(d.x);

            });


            x.domain(d3.extent(chartData, function(d) {
                return d3.time.month(d.x);
            }));

            x.nice(d3.time.month); //needed to show first month on x-axis

            switch (climate_var) {
                case 'pr':
                    d3.select("#temp").remove()
                    svg.append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text("Precipitation (mm)")
                        .attr("id", 'temp');

                    var y = d3.scale.log()
                        .range([heightG, 0]);

                    var line = d3.svg.line()
                        .interpolate("step")
                        .x(function(d) {
                            return x(d.x);
                        })
                        .y(function(d) {
                            return y(d.y);
                        });

                    break;

                case 'tmax':
                case 'tmin':
                    d3.select("#temp").remove()
                    svg.append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text("Temperature (\xB0 C)")
                        .attr("id", 'temp');

                    var y = d3.scale.linear()
                        .range([heightG, 0]);

                    var line = d3.svg.line()
                        .interpolate("basis")
                        .x(function(d) {
                            return x(d.x);
                        })
                        .y(function(d) {
                            return y(d.y);
                        });

                    break;

            }

            yAxis = d3.svg.axis()
                .scale(y)
                .ticks(5, ",.1")
                .orient("left");

            y.domain([ymin, ymax]);

            // y.domain(d3.extent(chartData, function(d) {return d.y;}));

            svg.selectAll("circle")
                .data(chartData)
                .enter()
                .append("circle")
                .attr("r", 3.5)
                .attr("cx", function(d) {
                    return x(d.x);
                })
                .attr("cy", function(d) {
                    return y(d.y);
                })
                .style("fill", "rgb(214,39,40)");

            // circle and line transitions
            svg.selectAll("circle")
                .transition()
                .duration(1000)
                .attr("r", 3.5)
                .attr("cx", function(d) {
                    // console.log(d)
                    return x(d.x);
                })
                .attr("cy", function(d) {
                    return y(d.y);
                })
                .style("fill", "rgb(214,39,40)");

            svg.selectAll("path")
                .transition()
                .duration(1000)
                .attr("d", line(chartData));


            //Update X axis
            svg.select(".x.axisC")
                .call(xAxis);

            //y-axis transition
            svg.select(".y.axisC")
                .transition()
                .duration(1000)
                .call(yAxis);

            function mousemove() {
                var x0 = x.invert(d3.mouse(this)[0]),
                    i = bisectDate(chartData, x0, 1),
                    d0 = chartData[i - 1],
                    d1 = chartData[i],
                    dd = x0 - d0.x > d1.x - x0 ? d1 : d0;
                focus.attr("transform", "translate(" + x(dd.x) + "," + y(dd.y) + ")");
                focus.select("text").text(dd.y.toFixed(2));
            }

            // mouseover stuff
            var focus = svg.append("g")
                .attr("class", "focus")
                .style("display", "none");

            focus.append("text")
                .attr("x", 6)
                .attr('y', 10)
                .attr("dy", ".35em");

            svg.append("rect")
                .attr("class", "overlay")
                .attr("width", width)
                .attr("height", height)
                .on("mouseover", function() {
                    focus.style("display", null);
                })
                .on("mouseout", function() {
                    focus.style("display", "none");
                })
                .on("mousemove", mousemove);

            function mousemove() {
                var x0 = x.invert(d3.mouse(this)[0]),
                    i = bisectDate(chartData, x0, 1),
                    d0 = chartData[i - 1],
                    d1 = chartData[i],
                    dd = x0 - d0.x > d1.x - x0 ? d1 : d0;
                focus.attr("transform", "translate(" + x(dd.x) + "," + y(dd.y) + ")");
                focus.select("text").text(dd.y.toFixed(2));
            }

            switch (climate_var) {
                case 'tmax':
                case 'tmin':
                    L.popup({
                            maxWidth: 800
                        })
                        .setLatLng(latlng)
                        .setContent(Number(content.getElementsByTagName('value')[this.wmsParams.month - 1].childNodes[0].nodeValue).toFixed(2) + " \xB0C")
                        .openOn(map);
                    break;

                case 'pr':
                    L.popup({
                            maxWidth: 800
                        })
                        .setLatLng(latlng)
                        .setContent(Number(content.getElementsByTagName('value')[this.wmsParams.month - 1].childNodes[0].nodeValue).toFixed(2) + " mm")
                        .openOn(map);
                    break;
            }

        };

    }

});

L.tileLayer.betterWms = function(url, options) {
    return new L.TileLayer.BetterWMS(url, options);
};