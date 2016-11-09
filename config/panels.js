define(['underscore','handlebars',
    'leaflet-google','i18n!nls/panels','text!src/html/popup.html'
], function(_, Handlebars,
    LeafletGoogle, i18n, popupTmpl) {

var workspace = "forestry",
    geoserverUrl = "http://fenix.fao.org/geoserver29/ows";

//LAYERS CATEGORIES
var groups = {
        'vc': [
            {name: 'tree',  colors: "#FFFFFF,#FFEEEE,#FFDDDD,#FFCCCC" },
            {name: 'shrub', colors: "#EE0000" },
        //    {name: 'palm',   colors: "" },
        //    {name: 'bamboo', colors: "" },
        //    {name: 'crop',   colors: "" },
        ],
        'lu': [
            {name: 'cropland',   colors: "#006600" },
            {name: 'forestland', colors: "" },
            {name: 'grassland',  colors: "" },
            {name: 'wetland',    colors: "" },
            {name: 'settlement', colors: "" },
            {name: 'otherland',  colors: "" },            
        ],
        'fc': [
            {name: 'forest',     colors: "" },
            {name: 'inlandwaterbodies',  colors: "" },
            {name: 'otherlandwtreecover', colors: "" },
        //  {name: 'unknown',    colors: "" },
            {name: 'otherland',  colors: "" },  
            {name: 'otherwoodedland',    colors: "" },            
        ]
    };

return {
    categories: {
        title: i18n['panel_categories'],
        layers: _.map(groups, function(layers, categoryName) {
            return {
                collapsed: false,
                group: i18n[ categoryName ],
                layers: _.map(layers, function(layer, i) {
                    return {
                        active: false,//!!i,
                        name: i18n[ categoryName+'_'+layer.name ],
                        layer: {
                            //type: "tileLayer.wms",
                            type: "tileLayer.betterWms",//with GetCapabilities
                            args: [ geoserverUrl, {
                                    styles: categoryName+'_'+layer.name,
                                    layers: workspace+':'+categoryName+'_'+layer.name,
                                    format: "image/png8",
                                    transparent: true,
                                    opacity: 0.8,
                                    zIndex: 100+i,
                                    formatPopup: function(data) {
                                        //TODO replace with: return Handlebars(popupTmpl);
                                        return _.compact(_.map(data, function(v, k) {
                                            if(v && !_.isNumber(v) && !_.isBoolean(v) && _.isString(v) && v!=='na')
                                                return '<em>'+k+':</em> '+v;
                                        })).join('<br>');
                                    }
                                }
                            ]
                        },
                        icon: _.reduce(layer.colors.split(','), function(out, c) {
                            return out+'<i class="layer-color" style="background:'+c+'"></i>';
                        },'')
                    };
                })
            };
        })
    },


    baselayers: {
        layers: [
            {
                group: i18n['panel_baselayers'],
                collapsed: false,
                collapsibleGroups: true,
                layers: [
                    {
                        name: "Google Maps",
                        layer: new L.Google('ROADMAP')
                    },                
                    {
                        active: true,
                        name: "CartoDB Positron",
                        layer: {
                            type: "tileLayer",
                            args: [
                                "http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
                            ]
                        }
                    },
                    {
                        name: "CartoDB Dark matter",
                        layer: {
                            type: "tileLayer",
                            args: [
                                "http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png"
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
    },

    rawlayers: {
        layers: [
            {
                group: i18n['panel_rawlayers'],
                collapsed: true,
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
                                    zIndex: 10000
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
                                    opacity: 0.6,
                                    zIndex: 20000
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    }
};

});