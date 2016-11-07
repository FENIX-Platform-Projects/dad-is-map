
var FX_CDN = "//fenixrepo.fao.org/cdn/js/";

require.config({
    i18n: {
        locale: 'en'
    },
    paths: {
        'text':                   FX_CDN+"requirejs/plugins/text/2.0.12/text",
        'i18n':                   FX_CDN+"requirejs/plugins/i18n/2.0.4/i18n",
        'domready':               FX_CDN+"requirejs/plugins/domready/2.0.1/domReady",
        'jquery':                 FX_CDN+"jquery/2.1.1/jquery.min",
        'underscore':             FX_CDN+"underscore/1.8.0/underscore.min",
        'handlebars':             FX_CDN+"handlebars/4.0.5/handlebars.min",
        'bootstrap':              FX_CDN+"bootstrap/3.3.7/js/bootstrap.min",
        'leaflet':                FX_CDN+"leaflet/0.7.7/leaflet",

        'leaflet-panel': "node_modules/leaflet-panel-layers/src/leaflet-panel-layers",

        'config': "config/config",
        'nls': "i18n",
    },
    shim: {
        'underscore': { exports: '_' },
        'bootstrap': ['jquery'],
        'leaflet-panel': ['leaflet'],
        'config': ['i18n']
    }
});

require(['jquery','underscore','handlebars',
    'leaflet', 'leaflet-panel',
    'config'
], function($, _, Handlebars,
    L, LeafletPanel,
    Config
) {

    var map = L.map('map', {
    		center: L.latLng([42.4918,12.4992]),
            layers: L.tileLayer(Config.baselayer),
            attributionControl: false,
            minZoom: 4,
            maxZoom: 8,
            zoom: 4
    	})
        .on('zoomend', function() {
            console.log('zoom', this.getZoom() );
        });

    L.control.panelLayers(null, Config.panel.overlay.layers, {
        title: Config.panel.overlay.title,
        position: 'bottomleft',
        collapsibleGroups: true,
        compact: true
    }).addTo(map);
 
    L.control.panelLayers(null, Config.panel.rawlayers.layers, {
        title: Config.panel.rawlayers.title,
        position: 'bottomright',
        collapsibleGroups: true,
        compact: true
    }).addTo(map);   

    L.control.panelLayers(null, Config.panel.baselayers.layers, {
        title: Config.panel.baselayers.title,
        position: 'topright',
        compact: true
    }).addTo(map);


});
