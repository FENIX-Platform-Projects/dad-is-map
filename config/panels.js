define(['underscore','handlebars','leaflet-google',
    'config/config','i18n!nls/panels','i18n!nls/popups','text!src/html/popup.html'
],
function(_,Handlebars,LeafletGoogle,
    Config,i18nPanels,i18nPopups,tmplPopup) {

//LAYERS CATEGORIES
var groups = {
        'vc': [
            {name: 'tree',   active: 1, colors: "#d5efcf,#9ed898,#54b567,#1d8641,#00441b" },
            {name: 'shrub',  active: 1, colors: "#fff5eb,#fed2a6,#fd9243,#df4f05,#7f2704" },
        //  {name: 'palm',   active: 0, colors: "" },
        //  {name: 'bamboo', active: 0, colors: "" },
        //  {name: 'crop',   active: 0, colors: "" },
        ],
        'lu': [
            {name: 'forestland', active: 0, colors: "#418d46" },
            {name: 'cropland',   active: 0, colors: "#f09e4d" },
            {name: 'grassland',  active: 0, colors: "#b3dd71" },
            {name: 'wetland',    active: 0, colors: "#ccecf8" },
            {name: 'settlement', active: 0, colors: "#d1463f" },
            {name: 'otherland',  active: 0, colors: "#e1e1e1" },            
        ],
        'fc': [
            {name: 'forest',             active: 0, colors: "#31a354" },
            {name: 'otherwoodedland',    active: 0, colors: "#addd8e" }, 
            {name: 'otherlandwtreecover',active: 0, colors: "#fce747" },
            {name: 'otherland',          active: 0, colors: "#e5f5e0" },  
            {name: 'inlandwaterbodies',  active: 0, colors: "#a6bddb" },
        //  {name: 'unknown',    active: 0, colors: "" },
        ]
    };

function formatPopup(data) {
    //ALL ATTRIBUTES return _.compact(_.map(data, function(v, k) { return '<em>'+k+':</em> '+v; })).join('<br>');
    return Handlebars.compile(tmplPopup)({
        fields: _.map(data, function(v, k) {
            return i18nPopups[ k ] && {label: i18nPopups[ k ], value: v };
        })
    });
}

function formatColors(colors) {
    return _.reduce(colors.split(','), function(out, c) {
        return out+'<i class="layer-color" style="background:'+c+'"></i>';
    },'');
}

//PANELS
var panelZindex = 0;
return {
    categories: {
        title: i18nPanels['panel_categories'],
        layers: _.map(groups, function(layers, category) {
            return {
                collapsed: false,
                group: i18nPanels[ category ],
                layers: _.map(layers, function(layer, i) {
                    return {
                        active: layer.active || false,
                        name: i18nPanels[ category+'_'+layer.name ],
                        icon: formatColors( layer.colors ),
                        layer: {
                            //type: "tileLayer.wms",
                            type: "tileLayer.betterWms",//with GetCapabilities
                            args: [ Config.geoserverUrl, {
                                    zIndex: (panelZindex++)+100,
                                    srs: Config.map.crs,
                                    styles: category+'_'+layer.name,
                                    layers: Config.workspace+':'+category+'_'+layer.name,
                                    format: "image/png8",
                                    transparent: true,
                                    opacity: 1,
                                    formatPopup: function(data) {
                                        return formatPopup(data)
                                    }
                                }
                            ]
                        }
                    };
                })
            };
        })
    },

    rawlayers: {
        layers: [
            {
                group: i18nPanels['panel_rawlayers'],
                collapsed: false,
                layers: [
                    {
                        name: i18nPanels['panel_rawpoints'],
                        icon: '<i class="layer-color" style="background:#f00;border-radius:10px;height:6px;width:6px;margin:5px"></i>',
                        layer: {
                            type: "tileLayer.wms",
                            args: [ Config.geoserverUrl, {
                                    zIndex: (panelZindex++)+1000,
                                    styles: "all_points",
                                    layers: Config.workspace+':'+'fenix_global_land_trends_points',
                                    format: "image/png",
                                    transparent: true,
                                    attribution: i18nPanels['attribution_raw']
                                }
                            ]
                        }
                    },
                    {
                        name: i18nPanels['panel_rawpolygons'],
                        icon: '<i class="layer-color" style="border:1px solid #f00"></i>',
                        layer: {
                            type: "tileLayer.wms",
                            args: [ Config.geoserverUrl, {
                                    zIndex: (panelZindex++)+1000,
                                    styles: "all_borders",
                                    layers: Config.workspace+':crossview_world',
                                    format: "image/png",
                                    transparent: true,
                                    opacity: 0.8
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    },

    baselayers: {
        layers: [
            {
                group: i18nPanels['panel_baselayers'],
                collapsed: false,
                collapsibleGroups: true,
                layers: [
                    {
                        active: true,
                        name: "Google Maps",
                        layer: new L.Google('ROADMAP', {
                            zIndex: panelZindex++,
                        })
                    },
                    {
                        //active: true,                        
                        name: "Open Street Map",
                        layer: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            zIndex: panelZindex++,
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        })
                    },
                    {
                        name: "CartoDB Light",
                        layer: {
                            type: "tileLayer",
                            args: [
                                "http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png", {
                                    zIndex: panelZindex++,
                                    attribution: '&copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
                                    subdomains: 'abcd',
                                    maxZoom: 19
                                }
                            ]
                        }
                    },
                    {
                        name: "CartoDB Dark",
                        layer: {
                            type: "tileLayer",
                            args: [
                                "http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png", {
                                    zIndex: panelZindex++,
                                    attribution: '&copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
                                    subdomains: 'abcd',
                                    maxZoom: 19,
                                }
                            ]
                        }
                    }
                    //"Positron": "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
                    //"Dark matter": "http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
                    //"Positron (lite)": "http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
                    //"Dark matter (lite)": "http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png",
                    //"CartoDB World Antique": "https://cartocdn_{s}.global.ssl.fastly.net/base-antique/{z}/{x}/{y}.png",
                    //"CartoDB World Eco": "https://cartocdn_{s}.global.ssl.fastly.net/base-eco/{z}/{x}/{y}.png",
                    //"CartoDB World Flat Blue": "https://cartocdn_{s}.global.ssl.fastly.net/base-flatblue/{z}/{x}/{y}.png",
                    //"CartoDB World Midnight Commander": "https://cartocdn_{s}.global.ssl.fastly.net/base-midnight/{z}/{x}/{y}.png",            
                ]
            }
        ]
    }
};

});