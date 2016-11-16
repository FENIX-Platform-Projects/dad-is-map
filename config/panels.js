define(['underscore','handlebars','leaflet-google','i18n!nls/panels','text!src/html/popup.html'],
function(_, Handlebars, LeafletGoogle, i18n, popupTmpl) {

//LAYERS URLS
var workspace = "forestry",
    geoserverUrl = "http://fenix.fao.org/geoserver29/ows";

//LAYERS CATEGORIES
var groups = {
        'vc': [
            {name: 'tree',  colors: "#bbfbbc,#27db99,#00441b" },
            {name: 'shrub', colors: "#ee0000" },
        //    {name: 'palm',   colors: "" },
        //    {name: 'bamboo', colors: "" },
        //    {name: 'crop',   colors: "" },
        ],
        'lu': [
            {name: 'cropland',   colors: "#f09e4d", active: true },
            {name: 'forestland', colors: "#418d46" },
            {name: 'grassland',  colors: "#b3dd71" },
            {name: 'wetland',    colors: "#ccecf8" },
            {name: 'settlement', colors: "#d1463f" },
            {name: 'otherland',  colors: "#e1e1e1" },            
        ],
        'fc': [
            {name: 'forest',     colors: "#336633" },
            {name: 'inlandwaterbodies',  colors: "#2dece6" },
            {name: 'otherlandwtreecover', colors: "#89eb32" },
        //  {name: 'unknown',    colors: "" },
            {name: 'otherland',  colors: "#ffffff" },  
            {name: 'otherwoodedland',    colors: "#a39813" },            
        ]
    };

function formatPopup(data) {
    //TODO replace with: return Handlebars(popupTmpl)(data);
    return _.compact(_.map(data, function(v, k) {
        if(v && !_.isNumber(v) && !_.isBoolean(v) && _.isString(v) && v!=='na')
            return '<em>'+k+':</em> '+v;
    })).join('<br>');
}

function formatColors(colors) {
    return _.reduce(colors.split(','), function(out, c) {
        return out+'<i class="layer-color" style="background:'+c+'"></i>';
    },'');
}

//PANELS
return {
    categories: {
        title: i18n['panel_categories'],
        layers: _.map(groups, function(layers, categoryName) {
            return {
                collapsed: false,
                group: i18n[ categoryName ],
                layers: _.map(layers, function(layer, i) {
                    return {
                        active: layer.active || false,
                        name: i18n[ categoryName+'_'+layer.name ],
                        icon: formatColors( layer.colors ),
                        layer: {
                            //type: "tileLayer.wms",
                            type: "tileLayer.betterWms",//with GetCapabilities
                            args: [ geoserverUrl, {
                                    styles: categoryName+'_'+layer.name,
                                    layers: workspace+':'+categoryName+'_'+layer.name,
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
                group: i18n['panel_rawlayers'],
                collapsed: false,
                layers: [
                    {
                        name: i18n['panel_rawpoints'],
                        layer: {
                            type: "tileLayer.wms",
                            args: [ geoserverUrl, {
                                    styles: "global_land_trend_all",
                                    layers: workspace+':'+'global_land_trend',
                                    format: "image/png",
                                    transparent: true,
                                    attribution: i18n['attribution_raw']
                                }
                            ]
                        }
                    },
                    {
                        name: i18n['panel_rawpolygons'],
                        layer: {
                            type: "tileLayer.wms",
                            args: [ geoserverUrl, {
                                    styles: "all_borders",
                                    layers: workspace+':all',
                                    format: "image/png",
                                    transparent: true,
                                    opacity: 0.6
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
                group: i18n['panel_baselayers'],
                collapsed: false,
                collapsibleGroups: true,
                layers: [
                    {
                        //active: true,
                        name: "Google Maps",
                        layer: new L.Google('ROADMAP')
                    },
                    {
                        name: "Google Satellite",
                        layer: new L.Google('SAT')
                    },                    
                    {
                        name: "Open Street Map",
                        layer: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        })
                    },
                    {
                        active: true,
                        name: "CartoDB Light",
                        layer: {
                            type: "tileLayer",
                            args: [
                                "http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png", {
                                    attribution: '&copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
                                    subdomains: 'abcd',
                                    maxZoom: 19,
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