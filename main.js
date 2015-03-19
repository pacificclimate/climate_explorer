
var width = 760,
    height = 500;

var crs = new L.Proj.CRS('EPSG:3005',
        '+proj=aea +lat_1=50 +lat_2=58.5 +lat_0=45 +lon_0=-126 +x_0=1000000 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=m +no_defs', {
            resolutions: [
                4592, 3000, 1648, 1024, 512, 256, 128,
                64, 32, 16, 8, 4, 2, 1, 0.5
            ],
            origin: [0, 0]
        }),
    southWest = L.latLng(46.851760, -142.734375),
    northEast = L.latLng(60.364901, -114.917969),
    bounds = L.latLngBounds(southWest, northEast);

map = new L.Map('map', {
    crs: crs,
    continuousWorld: true,
    worldCopyJump: false,
    maxBounds: bounds
});

map.setView([54, -122.9364], 1);


queue()
    .defer(d3.json, "canada.json")
    .defer(d3.json, "usa.json")
    .defer(d3.json, "ocean.json")
    .await(ready);

var e,ymin,ymax,climate_var;

function ready(error, canada, usa, ocean) {

    var sliderWidth = 200,
        sliderHeight = 30;

    var margin = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    }

    var current = {
            "month": 1
        },
        maxValue = 12,
        moving;

    var colors = d3.scale.quantize()
        .range(["rgb(69,117,180)", "rgb(116,173,209)", "rgb(171,217,233)", "rgb(224,243,248)", "rgb(255,255,178)", "rgb(254,217,118)", "rgb(254,178,76)", "rgb(253,141,60)", "rgb(252,78,42)", "rgb(227,26,28)", "rgb(177,0,38)"]);

    var legend_labels = ["-20", "-15", "-10", "-5", "0", "5", "10", "15", "20", "25", "30"]

    var sliderContainer = d3.select("#slider").append("svg")
        .attr("width", sliderWidth + margin.left + margin.right + 10)
        .attr("height", sliderHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + (margin.top) + ")");

    var x = d3.scale.linear()
        .domain([1, 12])
        .range([0, sliderWidth])
        .clamp(true);

    var brushToMonth = d3.scale.quantile()
        .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
        .range([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

    var brush = d3.svg.brush()
        .x(x)
        .extent([current.month, current.month])
        .on("brush", brushed);

    var xTicks = {
        "1": "Jan",
        "2": "",
        "3": "Mar",
        "4": "",
        "5": "May",
        "6": "",
        "7": "Jul",
        "8": "",
        "9": "Sep",
        "10": "",
        "11": "Nov",
        "12": ""
    };

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("button")
        .ticks(12)
        .tickFormat(function(d) {
            return xTicks[d];
        })
        .tickSize(10, 0)
        .tickPadding(0);

    var svg = d3.select(map.getPanes().overlayPane).append("svg"),
        g = svg.append("g").attr("class", "leaflet-zoom-hide");

    var pacific = topojson.feature(ocean, ocean.objects.ocean);

    // first variable is used to center and scale map the viewport
    var bTopo = topojson.feature(canada, canada.objects.canada),
        topo = bTopo.features;
    var usTopo = topojson.feature(usa, usa.objects.states);
    
    svg.selectAll("path")
        .data(topo)
        .enter()
        .append("path");

    var transform = d3.geo.transform({
            point: projectPoint
        }),
        path = d3.geo.path().projection(transform);

    var feature = g.selectAll("path")
        .data(bTopo.features)
        .enter()
        .append("path")
        .attr("class", "canada")
        .attr("id", "land");

    map.on("viewreset", reset);

    var featureUS = g.selectAll("path1")
        .data(usTopo.features)
        .enter().append("path")
        .attr("class", "us");

    var ocean = g.selectAll("path2") // only using to mask tiles that spill over boarder. Could clip tiles instead...
        .data(pacific.features)
        .enter().append("path")
        .attr("class", "ocean");

    // console.log(current.month)
    climate_var = "tmax";

    var svgLeg = d3.select("#legMain").append("svg")
        .attr("width", 600)
        .attr("height", 450);

    drawMap(current.month, climate_var) //initialize with Jan and tmax for now

    sliderContainer.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + sliderHeight / 2 + ")")
        .call(d3.svg.axis()
            .scale(x)
            .orient("button")
            .ticks(12)
            .tickFormat(function(d) {
                return xTicks[d];
            })
            .tickSize(0)
            .tickPadding(12))
        .select(".domain")
        .select(function() {
            return this.parentNode.appendChild(this.cloneNode(true));
        })
        .attr("class", "halo");

    sliderContainer.call(xAxis)

    var slider = sliderContainer.append("g")
        .attr("class", "g-slider")
        .call(brush);

    slider.selectAll(".extent, .resize").remove();

    slider.select(".background")
        .attr("height", sliderHeight);

    var handle = slider.append("circle")
        .attr("class", "handle")
        .attr("transform", "translate(0," + sliderHeight / 2 + ")")
        .attr("r", 9);

    var legend = svgLeg.selectAll('g.legendEntry')
        .data(colors.range().reverse())
        .enter()
        .append("g")
        .attr("class", 'legend');

    reset();

    function reset() {

        var bounds = path.bounds(usTopo), //Use US for the projection bounds
            topLeft = bounds[0],
            bottomRight = bounds[1];

        svg.attr("width", bottomRight[0] - topLeft[0])
            .attr("height", bottomRight[1] - topLeft[1])
            .style("left", topLeft[0] + "px")
            .style("top", topLeft[1] + "px");

        g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

        feature.attr("d", path)
            .style("fill", function(d) {
                // console.log(d)
                if (d.properties.province == "British Columbia") {
                    return "none"
                } else {
                    return "#ddd";
                }
            });

        featureUS.attr("d", path)
            .style("fill", "#ddd");

        ocean.attr("d", path)
            .style("fill", "#a6cef5");

    }

    function projectPoint(x, y) {
        var point = map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
    };

    var wmsL;


    function drawMap(date, climate_var) {

        switch (climate_var) {

            case 'pr':
            wmsL = L.tileLayer.betterWms("http://prism.noip.me:82/ncWMS/wms", {
                layers: climate_var + '_monClim_PRISM_historical_run1_197101-200012/' + climate_var,
                format: 'image/png',
                maxZoom: 14,
                minZoom: 0,
                transparent: 'true',
                month: date,
                time: '1985-' + date + '-15',
                styles: 'boxfill/occam_inv',
                COLORSCALERANGE: '10,1200',
                logscale: true,
                numcolorbands: 254,
                version: '1.1.1',
                continuousWorld: true,
                opacity: 1 // change to 1 to make visible
            });
            // console.log(wmsL)

            wmsL.addTo(map)
                svgLeg.selectAll("image").remove()
                svgLeg.selectAll("g").remove()

                svgLeg.append("image")
                    .attr("clip-path", "url(#clip)")
                    .attr("xlink:href", "http://tools.pacificclimate.org/ncWMS-PCIC/wms?REQUEST=GetLegendGraphic&COLORBARONLY=true&WIDTH=1&HEIGHT=13&PALETTE=occam_inv&NUMCOLORBANDS=254&COLORSCALERANGE=0,1200")
                    .attr("width", 150)
                    .attr("height", 150)
                    .attr("transform", "translate(10,30)");

                var y = d3.scale.log()
                    .range([150, 0]);

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .ticks(5,",.1")
                    .orient("right");

                ymin = 10; //hardcoded. Should use data range.
                ymax = 1200;

                y.domain([ymin, ymax]);

                svgLeg.append("g")
                    .attr("class", "y axisC colourY")
                    .call(yAxis)
                    .attr("transform", "translate(90,30)")
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 46)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Precipitation (mm)");

                break;

            case 'tmax':
            case 'tmin':
            wmsL = L.tileLayer.betterWms("http://prism.noip.me:82/ncWMS/wms", {
                layers: climate_var + '_monClim_PRISM_historical_run1_197101-200012/' + climate_var,
                format: 'image/png',
                maxZoom: 14,
                minZoom: 0,
                transparent: 'true',
                month: date,
                time: '1985-' + date + '-15',
                styles: 'boxfill/rainbow',
                COLORSCALERANGE: '-26,30',
                logscale: false,
                numcolorbands: 254,
                version: '1.1.1',
                continuousWorld: true,
                opacity: 1 // change to 1 to make visible
            });

            wmsL.addTo(map)
                svgLeg.selectAll("image").remove()
                svgLeg.selectAll("g").remove()

                svgLeg.append("image")
                    .attr("clip-path", "url(#clip)")
                    .attr("xlink:href", "http://tools.pacificclimate.org/ncWMS-PCIC/wms?REQUEST=GetLegendGraphic&COLORBARONLY=true&WIDTH=1&HEIGHT=13&PALETTE=boxfill/rainbow'&NUMCOLORBANDS=254&COLORSCALERANGE=-26,30")
                    .attr("width", 150)
                    .attr("height", 150)
                    .attr("transform", "translate(10,30)");


                // var j = $.ajax({
                //     url: "http://tools.pacificclimate.org/dataportal/bc_prism/metadata.json?request=GetMinMaxWithUnits",
                //     data: "&id=tmax_monClim_PRISM_historical_run1_197101-200012&var=tmax"
                // });

                // console.log(j)

                var y = d3.scale.linear()
                    .range([150, 0]);

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .ticks(5)
                    .orient("right");

                ymin = -25;
                ymax = 30;
                y.domain([ymin, ymax]);

                svgLeg.append("g")
                    .attr("class", "y axisC colourY")
                    .call(yAxis)
                    .attr("transform", "translate(90,30)")
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 36)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Temperature (\xB0C)");

                break;
        }

    };


    // trace selection
    $(document).ready(function() {
        $('.climate_var').on('change', function() {
            climate_var = $('.climate_var').val();
            // document.getElementById("title").innerHTML = $('.climate_var').val();
            console.log(current.month)
            map.removeLayer(wmsL) // remove player to prevent them from piling up.
          
            drawMap(current.month, climate_var)

        });

    });


    function brushed() {

        var value = brush.extent()[0];

        if (d3.event.sourceEvent) {

            value = Math.round(x.invert(d3.mouse(this)[0]));
            console.log(value)
            brush.extent([value, value]);
        }
        handle.attr("cx", x(value));
        var brushDate = brushToMonth(value);
        console.log(brushDate)
        current.month = brushDate;
        map.removeLayer(wmsL) // remove player to prevent them from piling up.
           

        drawMap(brushDate, climate_var)

    }

}


//setup graph but hide it.

var counter = 0;

var chartData = [];

for (i = 0; i < 0; i++) {
    chartData.push({
        x: '1985-' + i + '-15',
        y: i
    })
}

var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    },
    widthG = 760 / 2 - margin.left - margin.right,
    heightG = 250 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y-%m-%d").parse;

chartData.forEach(function(d) {
    d.x = parseDate(d.x);
});

var x = d3.time.scale()
    .domain([d3.extent(chartData, function(d) {
        return d.x;
    })])
    .range([0, widthG]);

var y = d3.scale.linear()
    .range([heightG, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(11)
    .orient("bottom")
    .tickFormat(d3.time.format("%b"));

var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(5,",.1")
    .orient("left");

var line = d3.svg.line()
    .interpolate("linear")
    .x(function(d) {
        return x(d.x);
    })
    .y(function(d) {
        return y(d.y);
    });

var svg = d3.select("#chart").append("svg")
    .attr("width", widthG + 100 + margin.left + margin.right)
    .attr("height", heightG + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


y.domain([-25, 30]);

svg.append("g") //x axis group
    .attr("class", "x axisC")
    .attr("transform", "translate(0," + heightG + ")")
    .call(xAxis);

svg.append("path")
    .attr("class", "line")
    .attr("d", line(chartData));

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
