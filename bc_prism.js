
var selectionLayer;
var current_dataset;
var ncwmsCapabilities;
var selectionBbox;

function getBC3005Bounds() {
    return new OpenLayers.Bounds(-236114, 41654.75, 2204236, 1947346.25);
}

function getProjection(a) {
    return new OpenLayers.Projection("EPSG:" + a);
}


function BC3005_map_options() {
    bounds = getBC3005Bounds();
    var a = {
        restrictedExtent: bounds,
        displayProjection: getProjection(4326),
        projection: getProjection(3005),
        units: 'Meter'
    };
    return a;
}
function init_prism_map() {
    options = BC3005_map_options();
    options.tileManager = null;
    mapControls = getBasicControls();
    selLayerName = "Box Selection";
    selectionLayer = getBoxLayer(selLayerName);
    panelControls = getEditingToolbar([getHandNav(), getBoxEditor(selectionLayer)]);
    mapControls.push(panelControls);
    options.controls = mapControls;
    map = new OpenLayers.Map('pdp-map', options);
    defaults = {
        dataset: "pr_monClim_PRISM_historical_run1_197101-200012",
        variable: "pr"
    };
    params = {
        layers: defaults.dataset + "/" + defaults.variable,
        transparent: 'true',
        time: '1985-06-30',
        styles: 'boxfill/occam_inv',
        logscale: true,
        numcolorbands: 254,
        version: '1.1.1',
        srs: 'EPSG:3005'
    };
    datalayerName = "Climate raster";
    ncwms = new OpenLayers.Layer.WMS(datalayerName, pdp.ncwms_url, params, {
        maxExtent: getBC3005Bounds(),
        buffer: 1,
        ratio: 1.5,
        opacity: 0.7,
        transitionEffect: null,
        tileSize: new OpenLayers.Size(512, 512)
    });
    getNCWMSLayerCapabilities(ncwms);
    current_dataset = params.layers;
    var a = function(a) {
        var b = new Date(this.params.TIME);
        if (a.match(/_yr_/)) var c = b.getFullYear();
        else var c = b.getFullYear() + '/' + (b.getMonth() + 1);
        $('#map-title').html(a + '<br />' + c);
        return true;
    };

    function b(a) {
        var b = a.split('/')[1];
        if (b == 'pr') {
            this.params.LOGSCALE = true;
            this.params.STYLES = 'boxfill/occam_inv';
        } else {
            this.params.LOGSCALE = false;
            this.params.STYLES = 'boxfill/ferret';
        }
    };
    map.addLayers([ncwms, selectionLayer, getBC3005OsmBaseLayer(pdp.tilecache_url, 'BC OpenStreeMap', 'bc_osm')]);
    document.getElementById("pdp-map").appendChild(getOpacitySlider(ncwms));
    map.zoomToExtent(new OpenLayers.Bounds(-236114, 41654.75, 2204236, 1947346.25), true);
    map.getClimateLayer = function() {
        return map.getLayersByName(datalayerName)[0];
    };
    map.getSelectionLayer = function() {
        return map.getLayersByName(selLayerName)[0];
    };
    var c = new Colorbar("pdpColorbar", ncwms);
    // c.refresh_values();
    ncwms.events.registerPriority('change', ncwms, function(a) {
        var d = {
            "id": a.split('/')[0],
            "var": a.split('/')[1]
        };
        var e = $.ajax({
            url: "http://tools.pacificclimate.org/dataportal/bc_prism/metadata.json?request=GetMinMaxWithUnits",
            data: d
        });
        e.done(function(d) {
            var e = b.call(ncwms, a);
            ncwms.mergeNewParams(e);
            c.force_update(d.min, d.max, d.units);
        });
    });
    ncwms.events.register('change', ncwms, a);
    ncwms.events.triggerEvent('change', defaults.dataset + "/" + defaults.variable);
    return map;
};

function getPRISMControls(a) {
    var b = pdp.createDiv('', 'control');
    var c = pdp.createForm(undefined, undefined, undefined);
    var d = pdp.createFieldset("filterset", "Dataset Selection");
    var e = {
        'tmin': "Temperature Climatology (Min.)",
        'tmax': "Temperature Climatology (Max.)",
        'pr': "Precipitation Climatology"
    };
    d.appendChild(getRasterAccordionMenu(a, e));
    c.appendChild(d);
    b.appendChild(c);
    return b;
}

// function download(a, b, c, d, e) {
//     var f = function(b) {
//         if (b.toGeometry().getArea() === 0) {
//             alert("Cannot resolve selection to data grid. Please zoom in and select only within the data region.");
//             return;
//         }
//         var c = d.params.LAYERS.split('/')[0];
//         var f = d.params.LAYERS.split('/')[1];
//         var g = '';
//         if (a != 'aig') g = 'climatology_bounds,';
//         var h = catalog[c] + '.' + a + '?' + g + f + '[0:12][' + b.bottom + ':' + b.top + '][' + b.left + ':' + b.right + ']&';
//         if (e === 'link') alert(h);
//         else if (e === 'data' || e === 'metadata') {
//             if (window.shittyIE) alert("Downloads may not function completely correctly on IE <= 8. Cross your fingers and/or upgrade your browser.");
//             window.open(h, "_blank", "width=600,height=600");
//         }
//     };
//     if (c.features.length === 0) {
//         alert("You need to first select a rectangle of data to download (use the polygon tool in the top, right corner of the map.");
//         return;
//     };
//     if (ncwmsCapabilities === undefined) {
//         alert("I'm still trying to determine the geographic bounds of the selected layer.  Try again in a few seconds.");
//         return;
//     };
//     if (catalog === undefined) {
//         alert("I'm still trying determine what information is available for this layer.  Try again in a few seconds");
//         return;
//     };
//     if (c.features[0].geometry.getArea() === 0) {
//         alert("Selection area must be of non-zero area (i.e. have extent)");
//         return;
//     };
//     var g = getRasterNativeProj(ncwmsCapabilities, current_dataset);
//     var h = getRasterBbox(ncwmsCapabilities, current_dataset);
//     var i = c.features[0].geometry.bounds.clone().transform(c.projection, g);
//     if (!h.intersectsBounds(i)) {
//         alert('Selection area must intersect the raster area');
//         return;
//     }
//     rasterBBoxToIndicies(b, d, intersection(h, i), g, a, f);
// }
$(document).ready(function() {
    map = init_prism_map();
    loginButton = pdp.init_login('login-div');
    pdp.checkLogin(loginButton);
    getCatalog(function(a) {
        catalog = a;
    });
    var a = document.getElementById("pdp-controls").appendChild(getPRISMControls(pdp.ensemble_name));
    var b = document.getElementById("pdp-controls").appendChild(getRasterDownloadOptions(false));
    ncwmsLayer = map.getClimateLayer();
    selectionLayer = map.getSelectionLayer();

    function c() {
        download(type, map, selectionLayer, ncwmsLayer, 'data');
    }

    function d() {
        download(type, map, selectionLayer, ncwmsLayer, 'link');
    }

    function e() {
        download('das', map, selectionLayer, ncwmsLayer, 'metadata');
    }
    $("#download-timeseries").click(function() {
        type = $('select[name="data-format"]').val();
        c();
    });
    $("#permalink").click(function() {
        type = $('select[name="data-format"]').val();
        d();
    });
    $("#metadata").click(e);
});