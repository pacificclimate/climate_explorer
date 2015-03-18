window.pdp = (function(a, b) {
    "use strict";
    a.curry = function(a) {
        var b = Array.prototype.slice.call(arguments, 1);
        return function() {
            var c = Array.prototype.slice.call(arguments, 0),
                d = b.concat(c);
            return a.apply(this, d);
        };
    };
    a.createInputElement = function(a, b, c, d, e) {
        var f = document.createElement("input");
        f.type = a;
        if (typeof b != "undefined") f.className = b;
        if (typeof c != "undefined") f.id = c;
        if (typeof d != "undefined") f.name = d;
        if (typeof e != "undefined") {
            f.value = e;
            f.defaultValue = e;
        }
        return f;
    };
    a.createTextarea = function(a, b, c) {
        var d = document.createElement("textarea");
        if (typeof a != "undefined") d.id = a;
        if (typeof b != "undefined") d.value = d.defaultValue = b;
        if (typeof c != "undefined") d.readonly = "readonly";
        return d;
    };
    a.createDiv = function(a, b) {
        var c = document.createElement("div");
        if (typeof a != "undefined") c.id = a;
        if (typeof b != "undefined") c.className = b;
        return c;
    };
    a.createLabel = function(a, b, c) {
        var d = document.createElement("label");
        if (typeof a != "undefined") d.id = a;
        d.appendChild(document.createTextNode(b));
        d.htmlFor = c;
        return d;
    };
    a.createLegend = function(a, b) {
        var c = document.createElement("legend");
        if (typeof a != "undefined") c.id = a;
        c.appendChild(document.createTextNode(b));
        return c;
    };
    a.createForm = function(a, b, c, d) {
        var e = document.createElement("form");
        if (typeof a != "undefined") e.id = a;
        if (typeof b != "undefined") e.name = b;
        if (typeof c != "undefined") e.method = c;
        if (typeof d != "undefined") e.action = d;
        return e;
    };
    a.createFieldset = function(b, c) {
        var d = document.createElement("fieldset");
        if (typeof b != "undefined") d.id = b;
        if (typeof c != "undefined") d.appendChild(a.createLegend(b + "-legend", c));
        return d;
    };
    a.createOption = function(a, b, c) {
        var d = document.createElement("option");
        d.appendChild(document.createTextNode(b));
        d.value = a;
        if (typeof c != "undefined") d.selected = c;
        return d;
    };
    a.createOptgroup = function(a, b) {
        var c = document.createElement("optgroup");
        c.label = a;
        c.appendChild(b);
        return c;
    };
    a.getOptionsRecursive = function(c, d) {
        var e = document.createDocumentFragment();
        b.each(c, function(c, f) {
            if (b.isArray(f)) e.appendChild(a.createOptgroup(c, a.getOptionsRecursive(f[0], d)));
            else if (typeof d != "undefined" && c == d) e.appendChild(a.createOption(c, f.name, "selected"));
            else e.appendChild(a.createOption(c, f.name));
            return true;
        });
        return e;
    };
    a.createSelect = function(b, c, d, e) {
        var f = document.createElement("select");
        f.name = c;
        if (typeof b != "undefined") f.id = b;
        var g = a.getOptionsRecursive(d, e);
        f.appendChild(g);
        return f;
    };
    a.createLink = function(a, b, c, d, e) {
        var f = document.createElement("a");
        if (typeof a != "undefined") f.id = a;
        if (typeof b != "undefined") f.title = b;
        if (typeof c != "undefined") f.href = c;
        if (typeof e != "undefined") f.name = e;
        f.appendChild(document.createTextNode(d));
        return f;
    };
    a.createHelpLink = function(b, c) {
        var d = document.createElement("span");
        d.className = "helplink";
        d.appendChild(a.createLink(b, c, "#", "[?]"));
        return d;
    };
    a.createHelpItem = function(a, b) {
        var c = document.createDocumentFragment();
        var d = document.createElement("dt");
        var e = document.createElement("dd");
        d.appendChild(document.createTextNode(a));
        e.appendChild(document.createTextNode(b));
        c.appendChild(d);
        c.appendChild(e);
        return c;
    };
    a.createHelpGroup = function(a, b, c) {
        var d = document.createDocumentFragment();
        var e = document.createElement("h" + c);
        e.appendChild(document.createTextNode(a));
        d.appendChild(e);
        d.appendChild(b);
        return d;
    };
    a.getHelpRecursive = function(c, d) {
        var e = document.createDocumentFragment();
        b.each(c, function(c, f) {
            if (b.isArray(f)) e.appendChild(a.createHelpGroup(c, a.getHelpRecursive(f[0]), d + 1));
            else if (typeof f.help != "undefined") e.appendChild(a.createHelpItem(f.name, f.help));
            return true;
        });
        return e;
    };
    a.createDialog = function(a, c, d, e) {
        b(a).dialog({
            appendTo: "#main",
            autoOpen: false,
            title: c,
            width: d,
            height: e,
            modal: true,
            buttons: {
                "Close": function() {
                    b(this).dialog("close");
                }
            }
        });
    };
    a.createHelp = function(b, c, d, e, f, g, h) {
        if (typeof g == "undefined") g = "dl";
        if (typeof h == "undefined") h = a.getHelpRecursive;
        var i = a.createDiv(b);
        var j = document.createDocumentFragment();
        var k = i.appendChild(document.createElement(g));
        k.appendChild(h(c, 2));
        a.createDialog(i, d, e, f);
        return j;
    };
    a.getTextareaLabeled = function(b, c, d, e) {
        var f = document.createDocumentFragment();
        f.appendChild(a.createLabel(b + "-label", c, b));
        var g = f.appendChild(a.createTextarea(b, d, e));
        return f;
    };
    a.getSelector = function(b, c, d, e, f, g) {
        var h = a.createDiv(c);
        h.appendChild(a.createLabel(c + "-label", b, c));
        h.appendChild(a.createSelect(e, d, g, f));
        return h;
    };
    a.getCheckbox = function(b, c, d, e, f) {
        var g = a.createDiv(b);
        g.appendChild(a.createInputElement("checkbox", undefined, c, d, e));
        g.appendChild(a.createLabel(c + "-label", f, c));
        return g;
    };
    a.getSelectorWithHelp = function(c, d, e, f, g, h, i, j, k, l, m) {
        var n = a.getSelector(c, d, e, f, g, h);
        var o = d + "-help";
        var p = o + "-link";
        n.appendChild(a.createHelpLink(p, i));
        n.appendChild(a.createHelp(o, h, c, j, k, l, m));
        b("#" + p, n).click(function() {
            b("#" + o).dialog("open");
            return false;
        });
        return n;
    };
    a.mkOpt = function(a, b) {
        return {
            name: a,
            help: b
        };
    };
    a.mkOptGroup = function(a) {
        return [a];
    };
    return a;
}(window.pdp || {}, jQuery));

function getDateRange() {
    var a = pdp.createDiv("date-range");
    a.appendChild(pdp.createLabel("date-range-label", "Date Range", "date-range"));
    a.appendChild(pdp.createInputElement("text", "datepickerstart", "from-date", "from-date", "YYYY/MM/DD"));
    a.appendChild(document.createTextNode(" to "));
    a.appendChild(pdp.createInputElement("text", "datepickerend", "to-date", "to-date", "YYYY/MM/DD"));
    a.appendChild(pdp.createInputElement("hidden", "", "input-polygon", "input-polygon", ""));
    $('.datepickerstart', a).datepicker({
        inline: true,
        dateFormat: 'yy/mm/dd',
        changeMonth: true,
        changeYear: true,
        yearRange: '1870:cc',
        defaultDate: '1870/01/01'
    });
    $('.datepickerend', a).datepicker({
        inline: true,
        dateFormat: 'yy/mm/dd',
        changeMonth: true,
        changeYear: true,
        yearRange: '1870:cc',
        defaultDate: 'cc'
    });
    return a;
}

function generateMenuTree(a, b) {
    var c = $("<ul/>");
    $.each(Object.keys(a), function(d, e) {
        var f = $('<li/>');
        if (a[e] instanceof Object) f.append($('<a/>').text(e)).append(generateMenuTree(a[e], b));
        else {
            var g = a[e] + "/" + e;
            var h = e;
            if (typeof b != 'undefined') h = b[e];
            f.attr('id', g);
            $('<a/>').text(h).click(function() {
                ncwms.params.LAYERS = g;
                ncwms.events.triggerEvent('change', g);
                current_dataset = g;
                processNcwmsLayerMetadata(ncwms);
            }).addClass('menu-leaf').appendTo(f);
        }
        f.appendTo(c);
    });
    return c;
}

function getRasterAccordionMenu(a, b) {
    var c = "dataset-menu";
    var d = pdp.createDiv(c);
    var e = '../menu.json?ensemble_name=' + a;
    $.ajax(e, {
        dataType: "json"
    }).done(function(a) {
        var d = generateMenuTree(a, b);
        d.addClass("dataset-menu");
        $("#" + c).html(d);
        $(".dataset-menu").accordion({
            accordion: true,
            speed: 200,
            closedSign: '[+]',
            openedSign: '[-]'
        });
    });
    return d;
}
var getRasterControls = function(a) {
    var b = pdp.createDiv('', 'control');
    var c = pdp.createForm(undefined, undefined, undefined);
    var d = pdp.createFieldset("filterset", "Dataset Selection");
    d.appendChild(getRasterAccordionMenu(a));
    c.appendChild(d);
    b.appendChild(c);
    return b;
};
var getRasterDownloadOptions = function(a) {
    var b = document.createDocumentFragment();
    var c = b.appendChild(pdp.createDiv('', 'control'));
    var d = c.appendChild(pdp.createForm("download-form", "download-form", "get"));
    var e = d.appendChild(pdp.createFieldset("downloadset", "Download Data"));
    if (a) e.appendChild(getDateRange());
    e.appendChild(createRasterFormatOptions());
    e.appendChild(createDownloadButtons("download-buttons", "download-buttons", {
        "download-timeseries": "Download",
        "metadata": "Metadata",
        "permalink": "Permalink"
    }));
    return b;
};

function Colorbar(a, b) {
    this.div_id = a;
    this.layer = b;
    this.minimum = 0.0;
    this.maximum = 0.0;
    this.units = "";
    $("#" + a).html('<div id="minimum"></div><div id="midpoint"></div><div id="maximum"></div>');
    $("#" + a).css({
        border: "2px solid black"
    });
    $('#maximum').css({
        position: "absolute",
        top: "-0.5em",
        right: "20px"
    });
    $('#midpoint').css({
        position: "absolute",
        top: "50%",
        right: "20px"
    });
    $('#minimum').css({
        position: "absolute",
        bottom: "-0.5em",
        right: "20px"
    });
};
Colorbar.prototype = {
    constructor: Colorbar,
    midpoint: function() {
        if (this.layer.params.LOGSCALE) {
            var a = this.minimum <= 0 ? 1 : this.minimum;
            return Math.exp((Math.log(this.maximum) - Math.log(a)) / 2);
        } else return (this.minimum + this.maximum) / 2;
    },
    graphic_url: function() {
        var a = this.layer.params.STYLES.split('/')[1];
        return pdp.ncwms_url + "?REQUEST=GetLegendGraphic&COLORBARONLY=true&WIDTH=1" + "&HEIGHT=300" + "&PALETTE=" + a + "&NUMCOLORBANDS=254";
    },
    metadata_url: function(a) {
        if (a === undefined) a = this.layer.params.LAYERS;
        return "http://tools.pacificclimate.org/dataportal/bc_prism/metadata.json?request=GetMinMaxWithUnits" + "&id=" + a.split('/')[0] + "&var=" + a.split('/')[1];
    },
    format_units: function(a) {
        switch (a) {
            case "degC":
            case "degrees_C":
            case "celsius":
                return "&#8451;";
            case "mm d-1":
            case "mm day-1":
                return "mm/day";
            case "meters s-1":
                return "m/s";
            case "kg m-2":
                return "kg/m<sup>2</sup>";
                break;
            default:
                return a;
        }
    },
    refresh_values: function(a) {
        var b = this.metadata_url(a);
        var c = $.ajax({
            url: b,
            context: this
        });
        c.done(function(a) {
            this.minimum = a.min;
            this.maximum = a.max;
            this.units = this.format_units(a.units);
            this.redraw();
        });
    },
    force_update: function(a, b, c) {
        this.minimum = a;
        this.maximum = b;
        if (typeof c !== "undefined") this.units = this.format_units(c);
        this.redraw();
    },
    redraw: function() {
        var a = $("#" + this.div_id);
        a.css('background-image', "url(" + this.graphic_url() + ")");
        a.find("#minimum").html(round(this.minimum) + " " + this.units);
        a.find("#maximum").html(round(this.maximum) + " " + this.units);
        a.find("#midpoint").html(round(this.midpoint()) + " " + this.units);
    }
};
var round = function(a) {
    return Math.round(a * 100) / 100;
};

function createFormatOptions() {
    var a = {
        nc: pdp.mkOpt('NetCDF', 'NetCDF is a self-describing file format widely used in the atmospheric sciences. Self describing means that the format information is contained within the file itself, so generic tools can be used to import these data. The format requires use of freely available applications to view, import, and export the data.'),
        ascii: pdp.mkOpt('CSV/ASCII', 'CSV/ASCII response will return an OPeNDAP plain-text response which is a human readable array notation. For weather station data, the format normally consists of a sequence of fields separated by a comma and a space (e.g. " ,")'),
        xlsx: pdp.mkOpt('MS Excel 2010', 'This data format is compatible with many popular spreadsheet programs such as Open Office, Libre Office and Microsoft Excel 2010. Data organization is similar to CSV, but the format is more directly readable with spreadsheet software.')
    };
    return pdp.getSelectorWithHelp('Output Format', 'data-format', 'data-format', 'data-format-selector', 'csv', a, 'View output format descriptions', 450, 450);
}

function createRasterFormatOptions() {
    var a = {
        nc: pdp.mkOpt('NetCDF', 'NetCDF is a self-describing file format widely used in the atmospheric sciences. Self describing means that the format information is contained within the file itself, so generic tools can be used to import these data. The format requires use of freely available applications to view, import, and export the data.'),
        ascii: pdp.mkOpt('ASCII', 'ASCII response will return an OPeNDAP plain-text response which is a human readable array notation.'),
        aig: pdp.mkOpt('Arc/Info ASCII Grid', 'This format is the ASCII interchange format for Arc/Info Grid. It takes the form of one ASCII file per layer, plus sometimes an associated .prj file, all of which are wrapped up in zip archive.')
    };
    return pdp.getSelectorWithHelp('Output Format', 'data-format', 'data-format', 'data-format-selector', 'nc', a, 'View output format descriptions', 450, 450);
}

function createMetadataFormatOptions() {
    var a = {
        WFS: pdp.mkOptGroup({
            csv: pdp.mkOpt('CSV'),
            GML2: pdp.mkOpt('GML2'),
            'GML2-GZIP': pdp.mkOpt('GML2-GZIP'),
            'text/xml; subtype=gml/3.1.1': pdp.mkOpt('GML3.1'),
            'text/xml; subtype=gml/3.2': pdp.mkOpt('GML3.2'),
            'json': pdp.mkOpt('GeoJSON'),
            'SHAPE-ZIP': pdp.mkOpt('Shapefile')
        }),
        WMS: pdp.mkOptGroup({
            'application/atom+xml': pdp.mkOpt('AtomPub'),
            'image/gif': pdp.mkOpt('GIF'),
            'application/rss+xml': pdp.mkOpt('GeoRSS'),
            'image/geotiff': pdp.mkOpt('GeoTiff'),
            'image/geotiff8': pdp.mkOpt('GeoTiff 8bit'),
            'image/jpeg': pdp.mkOpt('JPEG'),
            'application/vnd.google-earth.kmz+xml': pdp.mkOpt('KML (compressed)'),
            'application/vnd.google-earth.kml+xml': pdp.mkOpt('KML (plain)'),
            'application/openlayers': pdp.mkOpt('OpenLayers'),
            'application/pdf': pdp.mkOpt('PDF'),
            'image/png': pdp.mkOpt('PNG'),
            'image/png8': pdp.mkOpt('PNG 8bit'),
            'image/svg+xml': pdp.mkOpt('SVG'),
            'image/tiff': pdp.mkOpt('Tiff'),
            'image/tiff8': 'Tiff 8bit'
        })
    };
    return pdp.getSelector('Output Format', 'metadata-format', "metadata-format", undefined, undefined, a);
}

function createDownloadButtons(a, b, c) {
    var d = pdp.createDiv(a);
    d.className = b;
    $.each(c, function(a, b) {
        d.appendChild(pdp.createInputElement("button", undefined, a, a, b));
        d.appendChild(document.createTextNode(" "));
    });
    return d;
}

function getCatalog(a) {
    $.ajax({
        'url': '../catalog/' + 'catalog.json',
        'type': 'GET',
        'dataType': 'json',
        'success': function(b, c, d) {
            a(b);
        }
    });
}

function getActiveFilters() {
    var a = [];
    for (var b in this)
        if (this.hasOwnProperty(b) && b != 'values') a.push(this[b]);
    return a;
};

function pp_bignum(a) {
    if (a > 1e9) return Math.floor(a / 1e9).toString() + 'G';
    if (a > 1e6) return Math.floor(a / 1e6).toString() + 'M';
    if (a > 1e3) return Math.floor(a / 1e3).toString() + 'k';
    return a;
};

function polygon_as_text() {
    var a = new OpenLayers.Projection("EPSG:4326");
    var b = new OpenLayers.Projection("EPSG:3005");
    var c = map.getLayersByName("Polygon selection")[0].features;
    if (c.length === 0) return '';
    var d = new OpenLayers.Geometry.MultiPolygon($.map(c, function(a) {
        return a.geometry.clone();
    }));
    d.transform(b, a);
    return d.toString();
};

function getProjection(a) {
    return new OpenLayers.Projection("EPSG:" + a);
}

function getBC3005Bounds() {
    return new OpenLayers.Bounds(-236114, 41654.75, 2204236, 1947346.25);
}

function getBC3005Bounds_vic() {
    return new OpenLayers.Bounds(611014.125, 251336.4375, 2070975.0625, 1737664.5625);
}

function getNA4326Bounds() {
    return new OpenLayers.Bounds(-150, 40, -50, 90);
}

function getWorld4326Bounds() {
    return new OpenLayers.Bounds(-180, -90, 180, 90);
}

function getBC3005Resolutions() {
    return [2218.5, 1109.25, 554.625, 277.3125, 138.6562, 69.32812, 34.66406];
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

function BC3005_map_options_vic() {
    bounds = getBC3005Bounds_vic();
    var a = {
        restrictedExtent: bounds,
        displayProjection: getProjection(4326),
        projection: getProjection(3005),
        units: 'Meter'
    };
    return a;
}

function na4326_map_options() {
    bounds = getNA4326Bounds();
    projection = getProjection(4326);
    var a = {
        restrictedExtent: bounds,
        units: 'degrees',
        displayProjection: projection,
        projection: projection
    };
    return a;
}

function world4326_map_options() {
    bounds = getWorld4326Bounds();
    projection = getProjection(4326);
    var a = {
        restrictedExtent: bounds,
        displayProjection: projection,
        maxResolution: 0.703125,
        numZoomLevels: 15,
        projection: projection,
        units: 'degrees'
    };
    return a;
}

function getGSBaseLayer(a, b, c) {
    return new OpenLayers.Layer.WMS(b, a + "gwc/service/wms", {
        layers: c,
        transparent: true
    }, {
        isBaseLayer: true,
        restrictedExtent: new OpenLayers.Bounds(-236114, 41654.75, 2204236, 1947346.25),
        maxExtent: new OpenLayers.Bounds(-236114, 41654.75, 2204236, 1947346.25),
        resolutions: [2218.5, 1109.25, 554.625, 277.3125, 138.6562, 69.32812, 34.66406],
        attribution: '© OpenStreetMap contributors'
    });
}

function getNaBaseLayer(a, b, c, d) {
    return new OpenLayers.Layer.WMS(b, a, {
        layers: c
    }, {
        projection: d,
        maxResolution: 1.40625,
        numZoomLevels: 10,
        attribution: '© OpenStreetMap contributors'
    });
}

function getTileBaseLayer(a, b, c, d) {
    return new OpenLayers.Layer.XYZ(b, a + "/" + c + "/${z}/${x}/${y}.png", {
        projection: d,
        zoomOffset: 4,
        attribution: '© OpenStreetMap contributors'
    });
}

function getBC3005OsmBaseLayer(a, b, c) {
    return new OpenLayers.Layer.WMS(b, a, {
        layers: c
    }, {
        projection: getProjection(3005),
        units: 'Meter',
        maxExtent: new OpenLayers.Bounds(-1000000, -1000000, 3000000, 3000000),
        maxResolution: 7812.5,
        numZoomLevels: 12,
        attribution: '© OpenStreetMap contributors'
    });
}

function getBasicControls() {
    return [new OpenLayers.Control.LayerSwitcher({
        'ascending': false
    }), new OpenLayers.Control.ScaleLine({
        geodesic: true
    }), new OpenLayers.Control.KeyboardDefaults(), new OpenLayers.Control.MousePosition({
        div: $('#location')[0]
    }), new OpenLayers.Control.PanZoomBar({
        panIcons: true
    }), new OpenLayers.Control.Attribution()];
}

function getEditingToolbar(a) {
    var b = new OpenLayers.Control.Panel({
        displayClass: 'olControlEditingToolbar',
        defaultControl: a[0]
    });
    b.addControls(a);
    return b;
}

function getHandNav() {
    return new OpenLayers.Control.Navigation({
        handleRightClicks: true,
        zoomBox: new OpenLayers.Control.ZoomBox(),
        enabled: true,
        selected: true
    });
}

function getPolygonLayer() {
    return new OpenLayers.Layer.Vector("Polygon selection", {
        'geometryType': OpenLayers.Geometry.Polygon
    });
}

function getBoxLayer(a) {
    a = typeof a !== 'undefined' ? a : "Box selection";
    var b = new OpenLayers.Layer.Vector(a);
    b.events.register('beforefeatureadded', b, function(a) {
        this.removeAllFeatures();
        b.ncbounds = new OpenLayers.Bounds();
    });
    b.events.register('featureadded', b, function(a) {
        selectionBbox = this.features[0].geometry.getBounds();
    });
    return b;
}

function getPolyEditor(a) {
    return new OpenLayers.Control.DrawFeature(a, OpenLayers.Handler.Polygon, {
        'displayClass': 'olControlDrawFeaturePolygon'
    });
}

function getBoxEditor(a) {
    return new OpenLayers.Control.DrawFeature(a, OpenLayers.Handler.RegularPolygon, {
        handlerOptions: {
            sides: 4,
            irregular: true
        },
        displayClass: 'olControlDrawFeaturePolygon'
    });
}
var getOpacitySlider = function(a) {
    var b = document.createElement('div');
    b.className = "opacitySliderContainer";
    b.style.padding = "0.5em";
    var c = document.createElement('div');
    c.className = "opacitySliderTitle";
    c.innerHTML = 'Climate Layer Opacity';
    c.setAttribute("unselectable", "on");
    c.className += " unselectable";
    c.style.display = "block";
    c.style.marginBottom = "0.5em";
    c.style.padding = "0 2em";
    c.style.fontWeight = "bold";
    b.appendChild(c);
    var d = document.createElement('div');
    d.style.position = "relative";
    d.style.marginBottom = "0.5em";
    d.className = "opacitySliderElement";
    b.appendChild(d);
    $(d).slider({
        animate: "fast",
        range: "min",
        min: 0,
        value: 70,
        slide: function(b, c) {
            a.setOpacity(c.value / 100);
        }
    });
    return b;
};

function addLoadingIcon(a) {
    $("#map-wrapper").append('<div id="loading" class="invisible"><center><img src="' + pdp.app_root + '/images/loading.gif" alt="Layer loading animation" /><p>Loading...</p></center></div>');
    a.events.register('loadstart', $("#loading"), function(a) {
        this.removeClass("invisible");
    });
    a.events.register('loadend', $("#loading"), function(a) {
        this.addClass("invisible");
    });
}
window.pdp = (function(a, b) {
    "use strict";
    a.init_login = function(a) {
        var c = {
            "Launchpad": "https://login.launchpad.net/",
            "Verisign": "http://pip.verisignlabs.com",
            "Google": "https://www.google.com/accounts/o8/id",
            "Yahoo": "http://open.login.yahooapis.com/openid20/www.yahoo.com/xrds"
        };
        var d = {
            "Launchpad": "https://login.launchpad.net/pBkz56vSM5432lMr/+new_account",
            "Verisign": "https://pip.verisignlabs.com/register.do",
            "Google": "https://accounts.google.com/NewAccount",
            "Yahoo": "https://edit.yahoo.com/registration?.src=fpctx&.intl=ca&.done=http%3A%2F%2Fca.yahoo.com%2F"
        };
        var e = document.getElementById(a).appendChild(pdp.createLink("login-button", undefined, undefined, "Login with OpenID"));
        var f = document.getElementById(a).appendChild(pdp.getLoginForm(c));
        f = b("#login-form").dialog({
            appendTo: "#main",
            autoOpen: false,
            title: "login",
            width: "40%",
            modal: true,
            dialogClass: "no-title",
            buttons: {
                "Close": function() {
                    b(this).dialog("close");
                }
            }
        });
        e = b("#login-button");
        e.prop("loggedIn", false);

        function g(a, c, d) {
            var g = pdp.app_root + "/check_auth_app/";
            var h = b("select[name='openid-provider']")[0].value;
            var i = window.open(pdp.app_root + "/check_auth_app/?openid_identifier=" + h + "&return_to=" + g);
            var j = new RegExp("^" + g);
            var k = setInterval(function() {
                try {
                    if (i.closed) {
                        clearInterval(k);
                        f.dialog("close");
                        pdp.checkLogin(e, c, d);
                    } else if (j.test(i.location.href)) {
                        clearInterval(k);
                        i.close();
                        f.dialog("close");
                        pdp.checkLogin(e, c, d);
                    }
                } catch (a) {}
            }, 500);
        }

        function h(a) {
            pdp.eraseCookie("beaker.session.id");
            b.ajax({
                url: "./?openid_logout",
                success: function() {
                    e.prop("loggedIn", false);
                    e.html("Login with OpenID");
                    alert("Logout successful.");
                },
                error: function() {
                    alert("We're not authorized! I'm not sure what to do. Abort! Abort!");
                }
            });
            return false;
        }

        function i(a) {
            var c = b("select[name='openid-provider'] option:selected").html();
            var e = d[c];
            window.open(e);
        }

        function j(a) {
            b("#filter").submit();
            b("#do-login").unbind("click");
            b("#do-login").click(g);
        }

        function k(a) {
            f.dialog("open");
            return false;
        }

        function l(a) {
            if (e.prop("loggedIn")) h(a);
            else k(a);
        }
        pdp.checkLogin(e);
        e.click(l);
        b("#do-login").click(g);
        b("#do-signup").click(i);
        return e;
    };
    a.checkLogin = function(a, c, d) {
        b.ajax({
            url: pdp.app_root + "/check_auth_app/",
            dataType: "json",
            success: function(b) {
                a.prop("loggedIn", true);
                a.html("Logout as: " + b.email);
                if (c) c();
            },
            error: function() {
                a.prop("loggedIn", false);
                a.html("Login with OpenID");
                if (d) d();
            }
        });
    };
    a.createCookie = function(a, b, c) {
        var d;
        if (c) {
            var e = new Date();
            e.setTime(e.getTime() + (c * 24 * 60 * 60 * 1000));
            d = "; expires=" + e.toGMTString();
        } else d = "";
        document.cookie = a + "=" + b + d + "; path=/";
    };
    a.readCookie = function(a) {
        var b = a + "=";
        var c = document.cookie.split(";");
        for (var d = 0; d < c.length; d++) {
            var e = c[d];
            while (e.charAt(0) == " ") e = e.substring(1, e.length);
            if (e.indexOf(b) === 0) return e.substring(b.length, e.length);
        }
        return null;
    };
    a.eraseCookie = function(a) {
        pdp.createCookie(a, "", -1);
    };
    a.getLoginForm = function(a) {
        function c(a, c, d) {
            var e = document.createElement("select");
            if (typeof a != "undefined") e.id = a;
            if (typeof c != "undefined") e.name = c;
            b.each(d, function(a, b) {
                e.appendChild(pdp.createOption(b, a));
            });
            return e;
        }
        var d = function(a) {
            var b = pdp.createFieldset(undefined, "Login");
            var d = b.appendChild(pdp.createDiv("login-or-signup"));
            d.appendChild(pdp.createLabel(undefined, "OpenID Provider"));
            var e = d.appendChild(pdp.createDiv());
            var f = c(undefined, "openid-provider", a);
            e.appendChild(f);
            var g = d.appendChild(pdp.createDiv());
            var h = pdp.createInputElement("button", undefined, "do-login", undefined, "Open login window");
            g.appendChild(h);
            var i = d.appendChild(pdp.createDiv());
            i.appendChild(document.createTextNode("--- or ---"));
            var j = d.appendChild(pdp.createDiv());
            var k = pdp.createInputElement("button", undefined, "do-signup", undefined, "Open sign up window");
            j.appendChild(k);
            return b;
        };
        var e = function() {
            var a = pdp.createFieldset(undefined, "How it works");
            var b = a.appendChild(document.createElement("p"));
            b.appendChild(document.createTextNode("Click \"Login\" to use an existing OpenID account. " + "A new window will open asking you to sign in with the account provider. " + "Once signed in, you will be returned to the data portal. " + "PCIC uses OpenID to allow us to communicate with users via e-mail. " + "If you don't have an OpenID account, click \"Sign up\"." + "For information about OpenID click "));
            var c = document.createElement("a");
            var d = document.createTextNode("here");
            c.appendChild(d);
            c.href = "http://openid.net/get-an-openid/what-is-openid/";
            b.appendChild(c);
            return a;
        };
        var f = function() {
            var a = pdp.createFieldset(undefined, "Why do you want my e-mail address?");
            var b = a.appendChild(document.createElement("p"));
            b.appendChild(document.createTextNode("PCIC will use your address only to contact you in the event major errors  are found in the data or when major changes to the data in the portal are made. " + "Your e-mail address is the only personal information that PCIC will gather and will be kept secure."));
            return a;
        };
        var g = pdp.createForm("login-form", "login-form", "get");
        g.appendChild(d(a));
        g.appendChild(e());
        g.appendChild(f());
        return g;
    };
    return a;
}(window.pdp, jQuery));
var cfTime = function(a, b) {
    this.units = a;
    this.sDate = b;
};
cfTime.prototype.setMaxTimeByIndex = function(a) {
    this.maxIndex = a;
    this.eDate = this.toDate(a);
    return this.eDate;
};
cfTime.prototype.toDate = function(a) {
    if (a === undefined) return this.sDate;
    if (this.units === "days") {
        var b = new Date(this.sDate.getTime());
        b.setDate(this.sDate.getDate() + a);
        return b;
    }
};
cfTime.prototype.toIndex = function(a) {
    if (a < this.sDate || (this.eDate && this.eDate < a)) return;
    if (this.units === "days") {
        var b = 1000 * 60 * 60 * 24;
        var c = a.getTime() - this.sDate.getTime();
        var d = c / b;
        return Math.floor(d);
    }
};
var processNcwmsLayerMetadata = function(a) {
    getNCWMSLayerCapabilities(a);
    var b = catalog[getNcwmsLayerId(a)];
    var c = $.ajax({
        url: (b + ".dds?time").replace("/data/", "/catalog/")
    });
    var d = $.ajax({
        url: (b + ".das").replace("/data/", "/catalog/")
    });
    $.when(c, d).done(function(b, c) {
        var d = ddsToTimeIndex(b[0]);
        c = dasToUnitsSince(c[0]);
        var e = c[0];
        var f = c[1];
        var g = new cfTime(e, f);
        g.setMaxTimeByIndex(d);
        a.times = g;
        setTimeAvailable(g.sDate, g.eDate);
    });
};
var getNcwmsLayerId = function(a) {
    return a.params.LAYERS.split("/")[0];
};
var ddsToTimeIndex = function(a) {
    return parseInt(a.match(/\[time.*]/g)[0].match(/\d+/)[0], 10);
};
var dasToUnitsSince = function(a) {
    var b = a.match(/time \{[\s\S]*?\}/gm)[0];
    var c = /\"(.*?) since (.*?)\"/g;
    var d = c.exec(b);
    var e = d[1];
    var f = d[2];
    c = /(\d{4})-(\d{2}|\d)-(\d{2}|\d)( |T)(\d{2}|\d):(\d{2}|\d):(\d{2}|\d)/g;
    d = c.exec(f);
    if (d) {
        for (var g = 0; g < d.length; g++) d[g] = +d[g];
        var h = new Date(d[1], --d[2], d[3], d[5], d[6], d[7], 0);
        return [e, h];
    }
    c = /(\d{4})-(\d{2}|\d)-(\d{2}|\d)/g;
    d = c.exec(f);
    if (d) return [e, new Date(d[1], --d[2], d[3])];
    return undefined;
};
var getNCWMSLayerCapabilities = function(a) {
    var b = {
        REQUEST: "GetCapabilities",
        SERVICE: "WMS",
        VERSION: "1.1.1",
        DATASET: a.params.LAYERS.split("/")[0]
    };
    $.ajax({
        url: a.url,
        data: b
    }).fail(handle_ie8_xml).always(function(a, b, c) {
        window.ncwmsCapabilities = $(c.responseXML);
    });
};
var setTimeAvailable = function(a, b) {
    $.each([".datepickerstart", ".datepickerend"], function(c, d) {
        $(d).datepicker("option", "minDate", a);
        $(d).datepicker("option", "maxDate", b);
    });
    $(".datepicker").datepicker("setDate", a);
    $(".datepickerstart").datepicker("setDate", a);
    $(".datepickerend").datepicker("setDate", b);
};
var intersection = function(a, b) {
    return new OpenLayers.Bounds(Math.max(a.left, b.left), Math.max(a.bottom, b.bottom), Math.min(a.right, b.right), Math.min(a.top, b.top));
};
var getRasterNativeProj = function(a, b) {
    var c = a.find('Layer > Name:contains("' + b + '")').parent().find('BoundingBox')[0];
    var d = c.attributes.getNamedItem('SRS');
    return new OpenLayers.Projection(d.value);
};
var getRasterBbox = function(a, b) {
    var c = a.find('Layer > Name:contains("' + b + '")').parent().find('LatLonBoundingBox')[0];
    var d = new OpenLayers.Bounds();
    d.extend(new OpenLayers.LonLat(parseFloat(c.attributes.getNamedItem('minx').value), parseFloat(c.attributes.getNamedItem('miny').value)));
    d.extend(new OpenLayers.LonLat(parseFloat(c.attributes.getNamedItem('maxx').value), parseFloat(c.attributes.getNamedItem('maxy').value)));
    return d;
};
var getTimeSelected = function(a) {
    var b = new Date($(".datepickerstart").datepicker("option", "minDate"));
    var c = $(".datepickerstart").datepicker("getDate");
    var d = $(".datepickerend").datepicker("getDate");
    var e = a.times.units;
    var f = a.times.toIndex(c);
    var g = a.times.toIndex(d);
    return [f, g];
};
var rasterBBoxToIndicies = function(a, b, c, d, e, f) {
    var g = new OpenLayers.Bounds();
    var h = function(a, b, c) {
        var d;
        if (c.responseXML) d = c.responseXML;
        else {
            var e = new DOMParser();
            d = e.parseFromString(c.responseText, 'text/xml');
        }
        var h = parseInt($(d).find("iIndex").text());
        var i = parseInt($(d).find("jIndex").text());
        if (!isNaN(g.toGeometry().getVertices()[0].x)) {
            g.extend(new OpenLayers.LonLat(h, i));
            f(g);
        } else g.extend(new OpenLayers.LonLat(h, i));
    };
    var i = function(c, d) {
        var e = {
            REQUEST: "GetFeatureInfo",
            BBOX: a.getExtent().toBBOX(),
            SERVICE: "WMS",
            VERSION: "1.1.1",
            X: c,
            Y: d,
            QUERY_LAYERS: b.params.LAYERS,
            LAYERS: b.params.LAYERS,
            WIDTH: a.size.w,
            HEIGHT: a.size.h,
            SRS: a.getProjectionObject().projCode,
            INFO_FORMAT: "text/xml"
        };
        $.ajax({
            url: pdp.ncwms_url[0],
            data: e
        }).fail(handle_ie8_xml).always(h);
    };
    var j = new OpenLayers.LonLat(c.left, c.top).transform(d, a.getProjectionObject());
    var k = new OpenLayers.LonLat(c.right, c.bottom).transform(d, a.getProjectionObject());
    var l = a.getPixelFromLonLat(j);
    var m = a.getPixelFromLonLat(k);
    i(l.x, l.y);
    i(m.x, m.y);
};

function filter_undefined(a) {
    return a == '<ogc:Filter xmlns:ogc="http://www.opengis.net/ogc"><ogc:And/></ogc:Filter>';
}

function generateGetFeatureInfoParams(a, b, c, d, e, f) {
    var g = {
        REQUEST: "GetFeatureInfo",
        EXCEPTIONS: "application/vnd.ogc.se_xml",
        SERVICE: "WMS",
        VERSION: "1.1.0",
        INFO_FORMAT: 'text/html',
        FORMAT: 'image/png'
    };
    var h = {
        BBOX: a.getExtent().toBBOX(),
        X: b,
        Y: c,
        QUERY_LAYERS: d.params.LAYERS,
        FEATURE_COUNT: e,
        LAYERS: 'CRMP:crmp_network_geoserver',
        WIDTH: a.size.w,
        HEIGHT: a.size.h,
        SRS: d.params.SRS,
        BUFFER: f
    };
    if (!filter_undefined(d.params.filter)) g.FILTER = d.params.filter;
    for (var i in h) g[i] = h[i];
    return g;
}

function getLoadingPopup(a, b) {
    popup = new OpenLayers.Popup.Anchored(a, b, new OpenLayers.Size(100, 60), 'Loading... <center><img style="padding-top:4px" width=30 height=30 src="' + pdp.app_root + '/images/anim_loading.gif"></center>', null, true, null);
    popup.autoSize = true;
    popup.border = '1px solid #808080';
    return popup;
}