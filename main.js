
var CDN = "//fenixrepo.fao.org/cdn/js/";

require.config({
    i18n: {
        locale: 'en'
    },
    paths: {
        'text':                   CDN+"requirejs/plugins/text/2.0.12/text",
        'i18n':                   CDN+"requirejs/plugins/i18n/2.0.4/i18n",
        'domready':               CDN+"requirejs/plugins/domready/2.0.1/domReady",
        'jquery':                 CDN+"jquery/2.1.1/jquery.min",
        'underscore':             CDN+"underscore/1.8.0/underscore.min",
        'handlebars':             CDN+"handlebars/4.0.5/handlebars.min",
        'bootstrap':              CDN+"bootstrap/3.3.7/js/bootstrap.min",
        'ion-rangeslider':        CDN+"ion.rangeSlider/2.1.2/js/ion-rangeSlider/ion.rangeSlider",
        'leaflet':                CDN+"leaflet/0.7.7/leaflet-src",
        //'leaflet-google':         CDN+"leaflet/plugins/Google",
        'leaflet-google':         "src/Google",

        'leaflet-panel': "node_modules/leaflet-panel-layers/src/leaflet-panel-layers",
        'leaflet-betterwms': "src/L.TileLayer.BetterWMS",

        'nls': "i18n",
    },
    shim: {
        'underscore': { exports: '_' },
        'bootstrap': ['jquery'],
        'ion-rangeslider': ['jquery'],
        'leaflet-panel': ['leaflet'],        
        'leaflet-google': ['leaflet'],
        'leaflet-betterwms': ['leaflet','jquery']
    }
});

require(['jquery','underscore','handlebars', 'ion-rangeslider', 
    'leaflet', 'leaflet-panel', 'leaflet-betterwms', 
    'config/config',
    'config/panels'
], function($, _, Handlebars, Rangeslider,
    L, LeafletPanel, LeafletBetterWMS, 
    Config,
    ConfigPanels
) {

    window.map = L.map('map', {
            crs: L.CRS[ Config.map.crs.replace(':','') ],
    		center: [42,12],
            maxZoom: 16,
            minZoom: 4,
            zoom: 4
    	})
        .on('zoomend', function() {
            console.log('zoom', this.getZoom() );
        })
        .on('overlayadd', function(e) {
            console.log('overlayadd', e.layer.wmsParams );  
        })
        .on('baselayerchange', function(e) {
            console.log('baselayerchange', e.layer );  
        })

    window.panel = L.control.panelLayers(null, ConfigPanels.categories.layers, {
        title: ConfigPanels.categories.title,
        position: 'topright',
        collapsibleGroups: true,
        compact: false,
        buildItem: function(item) {
            
            var $node = $('<span class="">');

            var $title = $('<span class="leaflet-panel-layers-title">');
            $title.append(item.name);

            $node.append($title, '<input class="opacity-slider" type="text" value="'+item.layer.options.opacity+'" />');

            $node.find('.opacity-slider').ionRangeSlider({
                min: 0.1, max: 1, step: 0.1,
                hide_min_max: true, hide_from_to: true,
                from: item.layer.options.opacity,
                onChange: function (o) {
                    item.layer.setOpacity(o.from);
                }
            });

            return $node[0];
        }
    }).on('panel:selected', function(layer) {

        //console.log( layer.name );

    }).addTo(map);

    L.control.panelLayers(
        ConfigPanels.baselayers.layers,
        //null,
        ConfigPanels.rawlayers.layers
        , {
        title: ConfigPanels.rawlayers.title,
        position: 'bottomleft',
        collapsibleGroups: true,
        compact: true
    }).addTo(map);

});
