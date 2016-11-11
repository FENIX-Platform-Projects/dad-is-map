
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
        'ion-rangeslider':        FX_CDN+"ion.rangeSlider/2.1.2/js/ion-rangeSlider/ion.rangeSlider",
        'leaflet':                FX_CDN+"leaflet/0.7.7/leaflet-src",
        'leaflet-google':         FX_CDN+"leaflet/plugins/Google",

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
    'config/panels'
], function($, _, Handlebars, Rangeslider,
    L, LeafletPanel, LeafletBetterWMS, 
    ConfigPanels
) {

    var map = L.map('map', {
    		center: [42,12],
            minZoom: 4,
            maxZoom: 7,
            zoom: 4
    	})
        .on('zoomend', function() {
            console.log('zoom', this.getZoom() );
        });

    L.control.panelLayers(null, ConfigPanels.categories.layers, {
        title: ConfigPanels.categories.title,
        position: 'topright',
        collapsibleGroups: true,
        compact: true,
/*        buildItem: function(item) {
            
            var $node = $('<span class="">');

            var $title = $('<span class="leaflet-panel-layers-title">');
            $title.append(item.name);

            $node.append($title, '<input class="opacity-slider" type="text" value="'+item.layer.options.opacity+'" />');

            $node.find('.opacity-slider').ionRangeSlider({
                min: 0.1, max: 1, step: 0.1,
                from: item.layer.options.opacity,
                onChange: function (o) {
                    item.layer.setOpacity(o.from);
                }
            });

            return $node[0];
        }*/
    }).on('panel:selected', function(layer) {

        console.log( layer.name );

    }).addTo(map);

    L.control.panelLayers(ConfigPanels.baselayers.layers, ConfigPanels.rawlayers.layers, {
        title: ConfigPanels.rawlayers.title,
        position: 'bottomleft',
        collapsibleGroups: true,
        compact: true
    }).addTo(map);

});
